'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { Portfolio } from '@/lib/supabase';

// Use service role key for admin operations (uploads, inserts, deletes)
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CATEGORIES = ['2D', '3D', 'VFX', 'Graphic Design', 'Art and Design', 'Motion Graphics'];
const ADMIN_PASSWORD = 'admin123';

type Tab = 'upload' | 'manage';

export default function AdminPage() {
  // Auth
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');

  // Upload form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isFeatured, setIsFeatured] = useState(false);

  // Manage tab
  const [tab, setTab] = useState<Tab>('upload');
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState('All');

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwInput === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Incorrect password. Try again.');
    }
  };

  // ── Fetch items ───────────────────────────────────────────────────────────
  const fetchItems = async () => {
    setLoadingItems(true);
    const { data } = await adminSupabase
      .from('portfolio')
      .select('*')
      .order('created_at', { ascending: false });
    setItems(data || []);
    setLoadingItems(false);
  };

  useEffect(() => {
    if (authed && tab === 'manage') fetchItems();
  }, [authed, tab]);

  // ── File pick ─────────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setUploadMsg({ type: 'error', text: 'Title and image are required.' });
      return;
    }

    setUploading(true);
    setUploadMsg(null);

    try {
      // 1. Upload file to Supabase Storage
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: storageErr } = await adminSupabase.storage
        .from('portfolio')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (storageErr) throw storageErr;

      // 2. Get public URL
      const { data: urlData } = adminSupabase.storage.from('portfolio').getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      // 3. Insert into portfolio table
      const { error: dbErr } = await adminSupabase.from('portfolio').insert({
        title: title.trim(),
        category,
        description: description.trim() || null,
        image_url: imageUrl,
        is_featured: isFeatured,
      });

      if (dbErr) throw dbErr;

      setUploadMsg({ type: 'success', text: `"${title}" uploaded successfully!` });
      setTitle('');
      setDescription('');
      setIsFeatured(false);
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadMsg({ type: 'error', text: message });
    } finally {
      setUploading(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (item: Portfolio) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeletingId(item.id);
    try {
      // Extract filename from URL
      const parts = item.image_url.split('/');
      const fileName = parts[parts.length - 1];
      await adminSupabase.storage.from('portfolio').remove([fileName]);
      await adminSupabase.from('portfolio').delete().eq('id', item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Toggle Featured Slideshow ─────────────────────────────────────────────
  const handleToggleFeatured = async (item: Portfolio) => {
    const nextState = !item.is_featured;
    try {
      const { error } = await adminSupabase
        .from('portfolio')
        .update({ is_featured: nextState })
        .eq('id', item.id);
      if (error) throw error;
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_featured: nextState } : i));
    } catch (err) {
      console.error('Error updating slideshow status:', err);
    }
  };

  const filteredItems = filterCat === 'All' ? items : items.filter(i => i.category === filterCat);

  // ─────────────────────────────────────────────────────────────────────────
  // LOGIN SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
      }}>
        <div style={{
          width: '100%', maxWidth: '400px', padding: '0 24px',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '6px' }}>
              <span style={{ color: '#e31c1c' }}>AJ</span> & <span>AN</span>
            </div>
            <div style={{ fontSize: '11px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>

          <div style={{
            background: '#141414', border: '1px solid #222',
            borderRadius: '12px', padding: '36px',
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Sign In</h1>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '28px' }}>Enter your admin password to continue</p>

            <form onSubmit={handleLogin}>
              <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                style={{
                  width: '100%', padding: '12px 14px',
                  background: '#0a0a0a', border: `1px solid ${pwError ? '#e31c1c' : '#2a2a2a'}`,
                  borderRadius: '8px', color: '#fff', fontSize: '14px',
                  outline: 'none', marginBottom: '8px',
                  boxSizing: 'border-box',
                }}
              />
              {pwError && (
                <p style={{ fontSize: '12px', color: '#e31c1c', marginBottom: '16px' }}>{pwError}</p>
              )}
              <button
                type="submit"
                style={{
                  width: '100%', padding: '13px',
                  background: '#e31c1c', color: '#fff',
                  border: 'none', borderRadius: '8px',
                  fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  marginTop: pwError ? '0' : '16px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c41515')}
                onMouseLeave={e => (e.currentTarget.style.background = '#e31c1c')}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ADMIN PANEL
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>

      {/* Top Bar */}
      <header style={{
        height: '80px', background: '#111', borderBottom: '1px solid #1e1e1e',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" style={{ textDecoration: 'none', fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#e31c1c' }}>AJ</span> & AN
          </a>
          <span style={{ color: '#333', fontSize: '16px' }}>|</span>
          <span style={{ fontSize: '13px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href="/" style={{
            fontSize: '13px', color: '#888', textDecoration: 'none',
            padding: '7px 14px', border: '1px solid #2a2a2a', borderRadius: '6px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#444'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            ← View Site
          </a>
          <button
            onClick={() => setAuthed(false)}
            style={{
              fontSize: '13px', color: '#888', background: 'none',
              border: '1px solid #2a2a2a', borderRadius: '6px',
              padding: '7px 14px', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e31c1c'; e.currentTarget.style.borderColor = '#e31c1c33'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: '6px' }}>
            Portfolio Manager
          </h1>
          <p style={{ fontSize: '14px', color: '#555' }}>Upload and manage your creative work</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px', borderBottom: '1px solid #1e1e1e' }}>
          {(['upload', 'manage'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 24px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                color: tab === t ? '#fff' : '#555',
                borderBottom: tab === t ? '2px solid #e31c1c' : '2px solid transparent',
                marginBottom: '-1px', transition: 'all 0.2s',
                textTransform: 'capitalize', letterSpacing: '0.3px',
              }}
            >
              {t === 'upload' ? '+ Upload Work' : `Manage Items ${items.length > 0 && tab === 'manage' ? `(${filteredItems.length})` : ''}`}
            </button>
          ))}
        </div>

        {/* ── UPLOAD TAB ────────────────────────────────────────────────── */}
        {tab === 'upload' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>

            {/* Form */}
            <div>
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Title */}
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Brand Identity for TechCorp"
                    required
                    style={inputStyle}
                    onFocus={e => e.currentTarget.style.borderColor = '#e31c1c'}
                    onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#e31c1c'}
                    onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description <span style={{ color: '#444' }}>(optional)</span></label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Brief description of the project..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#e31c1c'}
                    onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'}
                  />
                </div>

                {/* File Drop Zone */}
                <div>
                  <label style={labelStyle}>Image *</label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => fileRef.current?.click()}
                    style={{
                      border: `2px dashed ${file ? '#e31c1c44' : '#2a2a2a'}`,
                      borderRadius: '10px', padding: '32px 20px',
                      textAlign: 'center', cursor: 'pointer',
                      background: file ? '#e31c1c08' : '#111',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#e31c1c66')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = file ? '#e31c1c44' : '#2a2a2a')}
                  >
                    {file ? (
                      <div>
                        <div style={{ fontSize: '22px', marginBottom: '6px' }}>✅</div>
                        <p style={{ fontSize: '13px', color: '#ccc', fontWeight: 600 }}>{file.name}</p>
                        <p style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
                          {(file.size / 1024 / 1024).toFixed(2)} MB — click to change
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '28px', marginBottom: '10px' }}>📁</div>
                        <p style={{ fontSize: '13px', color: '#888' }}>Drag & drop an image here</p>
                        <p style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>or click to browse</p>
                        <p style={{ fontSize: '11px', color: '#333', marginTop: '8px' }}>JPG, PNG, WEBP — max 10MB</p>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                </div>

                {/* Slideshow Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#e31c1c' }}
                  />
                  <label htmlFor="isFeatured" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                    Show in Homepage Slideshow
                  </label>
                </div>

                {/* Status Message */}
                {uploadMsg && (
                  <div style={{
                    padding: '12px 16px', borderRadius: '8px',
                    background: uploadMsg.type === 'success' ? '#16a34a18' : '#e31c1c18',
                    border: `1px solid ${uploadMsg.type === 'success' ? '#16a34a44' : '#e31c1c44'}`,
                    fontSize: '13px',
                    color: uploadMsg.type === 'success' ? '#4ade80' : '#f87171',
                  }}>
                    {uploadMsg.type === 'success' ? '✅ ' : '❌ '}{uploadMsg.text}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: '14px', background: uploading ? '#5a0a0a' : '#e31c1c',
                    color: uploading ? '#aaa' : '#fff', border: 'none',
                    borderRadius: '8px', fontWeight: 700, fontSize: '15px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', gap: '10px',
                  }}
                  onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = '#c41515'; }}
                  onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = '#e31c1c'; }}
                >
                  {uploading ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                      Uploading...
                    </>
                  ) : (
                    '↑ Upload to Portfolio'
                  )}
                </button>
              </form>
            </div>

            {/* Preview Panel */}
            <div>
              <label style={labelStyle}>Preview</label>
              <div style={{
                border: '1px solid #1e1e1e', borderRadius: '10px',
                overflow: 'hidden', background: '#111',
                aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#333' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🖼️</div>
                    <p style={{ fontSize: '13px' }}>Image preview will appear here</p>
                  </div>
                )}
              </div>
              {title && (
                <p style={{ marginTop: '12px', fontSize: '15px', fontWeight: 700, color: '#fff', textAlign: 'center' }}>{title}</p>
              )}
              {category && (
                <p style={{ marginTop: '4px', fontSize: '12px', color: '#e31c1c', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>{category}</p>
              )}
            </div>
          </div>
        )}

        {/* ── MANAGE TAB ────────────────────────────────────────────────── */}
        {tab === 'manage' && (
          <div>
            {/* Category Filter */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
              {['All', ...CATEGORIES].map(c => (
                <button
                  key={c}
                  onClick={() => setFilterCat(c)}
                  style={{
                    padding: '7px 16px', borderRadius: '100px',
                    border: `1px solid ${filterCat === c ? '#e31c1c' : '#2a2a2a'}`,
                    background: filterCat === c ? '#e31c1c18' : 'transparent',
                    color: filterCat === c ? '#e31c1c' : '#888',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    letterSpacing: '0.3px', transition: 'all 0.2s',
                  }}
                >
                  {c}
                </button>
              ))}
              <button
                onClick={fetchItems}
                style={{
                  padding: '7px 16px', borderRadius: '100px',
                  border: '1px solid #2a2a2a', background: 'transparent',
                  color: '#666', fontSize: '12px', cursor: 'pointer', marginLeft: 'auto',
                }}
              >
                ↻ Refresh
              </button>
            </div>

            {loadingItems ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{ aspectRatio: '3/4', background: '#141414', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: '#444' }}>
                <div style={{ fontSize: '40px', marginBottom: '16px' }}>📂</div>
                <p style={{ fontSize: '15px' }}>No items in {filterCat === 'All' ? 'portfolio' : filterCat} yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {filteredItems.map(item => (
                  <div key={item.id} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '10px', overflow: 'hidden' }}>
                    {/* Image */}
                    <div style={{ aspectRatio: '3/4', background: '#1a1a1a', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      {/* Category badge */}
                      <div style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: '#e31c1ccc', color: '#fff', fontSize: '10px',
                        fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: '4px',
                      }}>
                        {item.category}
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: '14px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: '11px', color: '#444', marginBottom: '12px' }}>
                        {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {/* Slideshow Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(item)}
                        style={{
                          width: '100%', padding: '8px', borderRadius: '6px',
                          border: '1px solid #2a2a2a', background: item.is_featured ? 'rgba(227,28,28,0.12)' : 'transparent',
                          color: item.is_featured ? '#e31c1c' : '#777',
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                          transition: 'all 0.2s', marginBottom: '8px',
                          borderColor: item.is_featured ? 'rgba(227,28,28,0.3)' : '#2a2a2a',
                        }}
                        onMouseEnter={e => { if (!item.is_featured) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; } }}
                        onMouseLeave={e => { if (!item.is_featured) { e.currentTarget.style.color = '#777'; e.currentTarget.style.background = 'transparent'; } }}
                      >
                        {item.is_featured ? '★ Featured in Slideshow' : '☆ Add to Slideshow'}
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        style={{
                          width: '100%', padding: '8px', borderRadius: '6px',
                          border: '1px solid #2a2a2a', background: 'transparent',
                          color: deletingId === item.id ? '#444' : '#e31c1c',
                          fontSize: '12px', fontWeight: 600, cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (deletingId !== item.id) { e.currentTarget.style.background = '#e31c1c18'; e.currentTarget.style.borderColor = '#e31c1c44'; } }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#2a2a2a'; }}
                      >
                        {deletingId === item.id ? 'Deleting...' : '🗑 Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        select option { background: #1a1a1a; color: #fff; }
        input::placeholder, textarea::placeholder { color: #444; }
      `}</style>
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  color: '#888',
  marginBottom: '8px',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: '#0d0d0d',
  border: '1px solid #2a2a2a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
};
