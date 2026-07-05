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
                style={{ cursor: 'pointer' }}
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
    </main>
  );
}
