'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !description.trim()) {
      setSubmitMsg({ type: 'error', text: 'All fields are required.' });
      return;
    }

    setSubmitting(true);
    setSubmitMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), description: description.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit form.');

      setSubmitMsg({ type: 'success', text: 'Message sent successfully! Our crew will get back to you shortly.' });
      setName('');
      setEmail('');
      setDescription('');
    } catch (err: any) {
      setSubmitMsg({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* Page Header */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '40px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #1e1e1e',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            letterSpacing: '-2px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Contact Us
        </motion.h1>
      </section>

      {/* Contact Content */}
      <section style={{ padding: '60px 32px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
          
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Name */}
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Status message */}
              {submitMsg && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  background: submitMsg.type === 'success' ? '#16a34a18' : '#e31c1c18',
                  border: `1px solid ${submitMsg.type === 'success' ? '#16a34a44' : '#e31c1c44'}`,
                  color: submitMsg.type === 'success' ? '#4ade80' : '#f87171',
                  fontSize: '14px',
                }}>
                  {submitMsg.text}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 36px',
                  background: submitting ? '#5a0a0a' : '#e31c1c',
                  color: submitting ? '#aaa' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#c41515'; }}
                onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#e31c1c'; }}
              >
                {submitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </motion.div>

          {/* Right Column: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '10px' }}
          >
            <p style={{ fontSize: '16px', color: '#aaa', fontStyle: 'italic', marginBottom: '8px' }}>
              &ldquo;We&apos;re Here for You &ndash; Contact Us Now!&rdquo;
            </p>

            {/* Freelancers */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={iconContainerStyle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div style={{ alignSelf: 'center' }}>
                <h3 style={sectionTitleStyle}>Freelancers</h3>
              </div>
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={iconContainerStyle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h3 style={sectionTitleStyle}>Phone</h3>
                <a href="tel:+916300925313" style={{ ...sectionSubtextStyle, textDecoration: 'none', color: '#aaa', transition: 'color 0.2s' }}
                   onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                   onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}>
                  +91 63009 25313
                </a>
              </div>
            </div>

            {/* E-Mail */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={iconContainerStyle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 style={sectionTitleStyle}>E-Mail</h3>
                <a href="mailto:ajancreativestudio@gmail.com" style={{ ...sectionSubtextStyle, textDecoration: 'none', color: '#aaa', transition: 'color 0.2s' }}
                   onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                   onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}>
                  ajancreativestudio@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </main>
  );
}

// Styles
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  color: '#ccc',
  marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  color: '#000000',
  fontSize: '15px',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const iconContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  background: 'rgba(227, 28, 28, 0.08)',
  borderRadius: '8px',
  flexShrink: 0,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#fff',
  marginBottom: '6px',
};

const sectionSubtextStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#aaa',
  lineHeight: '1.5',
};
