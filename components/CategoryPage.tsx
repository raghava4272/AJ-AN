'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Portfolio } from '@/lib/supabase';
import Header from '@/components/Header';

interface CategoryPageProps {
  category: string;
  title: string;
}

export default function CategoryPage({ category, title }: CategoryPageProps) {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await supabase
          .from('portfolio')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });
        setItems(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  return (
    <main style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Header />

      {/* Page Header — matches reference dark textured banner */}
      <section style={{
        paddingTop: '120px',
        paddingBottom: '60px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #1e1e1e',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle grid texture overlay like reference */}
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
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 800,
            letterSpacing: '-2px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {title}
        </motion.h1>
      </section>

      {/* Grid Gallery */}
      <section style={{ padding: '60px 32px 100px', maxWidth: '1400px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '3/4',
                  background: '#1a1a1a',
                  borderRadius: '4px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                viewport={{ once: true }}
                style={{ cursor: item.video_url ? 'pointer' : 'default' }}
                onClick={() => item.video_url && setActiveVideoUrl(item.video_url)}
              >
                {/* Poster Image */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    background: '#1a1a1a',
                    overflow: 'hidden',
                    borderRadius: '4px',
                    marginBottom: '14px',
                  }}
                  className="portfolio-card"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        transition: 'transform 0.5s ease',
                      }}
                      className="portfolio-img"
                    />
                  )}

                  {/* Play Button Overlay on Hover if video is attached */}
                  {item.video_url && (
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: 0, transition: 'opacity 0.3s ease',
                      }}
                      className="play-overlay"
                    >
                      <div
                        style={{
                          width: '56px', height: '56px', borderRadius: '50%',
                          background: '#e31c1c', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 8px 24px rgba(227, 28, 28, 0.4)',
                          transform: 'scale(0.9)', transition: 'transform 0.3s ease',
                        }}
                        className="play-button"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                {/* Title below image — matches reference */}
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  textAlign: 'center',
                  color: '#fff',
                  letterSpacing: '0.2px',
                }}>
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center', padding: '120px 0',
            color: '#444', fontSize: '16px',
          }}>
            <p style={{ marginBottom: '8px', fontSize: '40px' }}>🎬</p>
            <p>No items yet. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Video Lightbox Modal */}
      {activeVideoUrl && (
        <div
          onClick={() => setActiveVideoUrl(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)', zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative', width: '100%', maxWidth: '960px',
              aspectRatio: '16/9', background: '#000', borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoUrl(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#e31c1c'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
            >
              ✕
            </button>
            <video
              src={activeVideoUrl}
              controls
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      {/* CSS Styles for play overlays */}
      <style>{`
        .portfolio-card:hover .play-overlay {
          opacity: 1 !important;
        }
        .portfolio-card:hover .play-button {
          transform: scale(1) !important;
        }
      `}</style>
    </main>
  );
}
