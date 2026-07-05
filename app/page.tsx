'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase';
import type { Portfolio } from '@/lib/supabase';

const fallbackSlides: Portfolio[] = [
  {
    id: 'default-1',
    title: 'AJ&AN Creative Studio',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
    description: "AJ&AN Creative Studio is a premier creative studio delivering world-class visual experiences, design, and motion graphics.",
    category: 'Featured',
    created_at: '',
  },
  {
    id: 'default-2',
    title: 'Transform Ideas into Power',
    image_url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&q=80',
    description: 'Create visual experiences that captivate audiences and elevate businesses.',
    category: 'Featured',
    created_at: '',
  },
  {
    id: 'default-3',
    title: 'Crafted with Purpose',
    image_url: 'https://images.unsplash.com/photo-1618005198143-e528346d9a59?w=1200&q=80',
    description: 'Every frame, every design, every animation—crafted to inspire and engage.',
    category: 'Featured',
    created_at: '',
  }
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [dbSlides, setDbSlides] = useState<Portfolio[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await supabase
          .from('portfolio')
          .select('*')
          .or('is_featured.eq.true,category.eq.Slideshow')
          .order('created_at', { ascending: false });
        if (data && data.length > 0) {
          setDbSlides(data);
        }
      } catch (err) {
        console.error('Error fetching featured:', err);
      }
    };
    fetchFeatured();
  }, []);

  const activeSlides = dbSlides.length > 0 ? dbSlides : fallbackSlides;

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides]);

  const prev = () => setCurrent((c) => (c - 1 + activeSlides.length) % activeSlides.length);
  const next = () => setCurrent((c) => (c + 1) % activeSlides.length);

  const prevIdx = (current - 1 + activeSlides.length) % activeSlides.length;
  const nextIdx = (current + 1) % activeSlides.length;

  const services = [
    { name: '2D', href: '/2d', icon: '🎨' },
    { name: '3D', href: '/3d', icon: '🎬' },
    { name: 'Visual Effects', href: '/vfx', icon: '✨' },
    { name: 'Graphic Design', href: '/graphic-design', icon: '🖌️' },
    { name: 'Art & Design', href: '/art-design', icon: '🖼️' },
    { name: 'Motion Graphics', href: '/motion-graphics', icon: '▶️' },
  ];

  return (
    <main style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <Header />

      {/* Hero Section — 3D Poster Slider matching Reference Screenshot 1 */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '60px',
        overflow: 'hidden',
        background: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Immersive Blurred Background of the current poster */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${activeSlides[current].image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px) brightness(0.25)',
          transform: 'scale(1.1)',
          transition: 'background-image 0.8s ease-in-out',
          zIndex: 1,
        }} />

        {/* Ambient Dark Gradients */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, rgba(10,10,10,0.95) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Circular Left Arrow */}
        {activeSlides.length > 1 && (
          <button
            onClick={prev}
            aria-label="Previous"
            style={{
              position: 'absolute', left: '40px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, width: '48px', height: '48px', borderRadius: '50%',
              background: '#ffffff', border: 'none',
              color: '#000000', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          >
            ←
          </button>
        )}

        {/* Circular Right Arrow */}
        {activeSlides.length > 1 && (
          <button
            onClick={next}
            aria-label="Next"
            style={{
              position: 'absolute', right: '40px', top: '50%', transform: 'translateY(-50%)',
              zIndex: 20, width: '48px', height: '48px', borderRadius: '50%',
              background: '#ffffff', border: 'none',
              color: '#000000', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
          >
            →
          </button>
        )}

        {/* 3D Poster Slider Container */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1200px',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          
          <div className="slideshow-carousel" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            width: '100%',
            marginBottom: '40px',
          }}>
            {/* Left Poster (Flanking) */}
            {activeSlides.length > 1 && (
              <div 
                onClick={prev}
                style={{
                  width: '220px',
                  height: '300px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  opacity: 0.3,
                  transform: 'scale(0.85)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  flexShrink: 0,
                }}
                className="flanking-poster"
              >
                <img src={activeSlides[prevIdx].image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            {/* Center Poster (Active) */}
            <div 
              style={{
                width: '320px',
                height: '440px',
                borderRadius: '16px',
                overflow: 'hidden',
                opacity: 1,
                transform: 'scale(1)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.12)',
                flexShrink: 0,
              }}
              className="active-poster"
            >
              <img src={activeSlides[current].image_url} alt={activeSlides[current].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Right Poster (Flanking) */}
            {activeSlides.length > 1 && (
              <div 
                onClick={next}
                style={{
                  width: '220px',
                  height: '300px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  opacity: 0.3,
                  transform: 'scale(0.85)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  flexShrink: 0,
                }}
                className="flanking-poster"
              >
                <img src={activeSlides[nextIdx].image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          {/* Centered Poster Info below */}
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', maxWidth: '800px', padding: '0 40px' }}
          >
            <h1 style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              marginBottom: '16px',
              letterSpacing: '-1px',
              lineHeight: 1.1,
            }}>
              {activeSlides[current].title}
            </h1>
            
            <p style={{
              fontSize: '15px',
              color: '#aaa',
              marginBottom: '32px',
              lineHeight: 1.7,
              maxWidth: '640px',
              margin: '0 auto 32px',
            }}>
              {activeSlides[current].description || "Visual masterpiece crafted by AJ&AN Creative Studio."}
            </p>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/contact" style={{
                padding: '12px 32px', background: '#e31c1c', color: '#fff',
                border: 'none', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                letterSpacing: '0.3px', transition: 'background 0.2s',
                textDecoration: 'none', display: 'inline-block', borderRadius: '4px',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#c41515'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#e31c1c'}
              >
                Get Started
              </Link>
            </div>
          </motion.div>

        </div>

        {/* Indicator dots */}
        {activeSlides.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '8px', zIndex: 20,
          }}>
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Slide ${idx + 1}`}
                style={{
                  height: '6px',
                  width: idx === current ? '24px' : '6px',
                  background: idx === current ? '#e31c1c' : 'rgba(255,255,255,0.25)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s', borderRadius: '3px',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section style={{ padding: '100px 32px', borderTop: '1px solid #1e1e1e' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p style={{ fontSize: '12px', letterSpacing: '3px', color: '#e31c1c', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>
              About Us
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: '28px', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
              Who We Are
            </h2>
            <p style={{ fontSize: '16px', color: '#888', marginBottom: '20px', lineHeight: 1.8 }}>
              We are a full-service creative studio delivering world-class <strong style={{ color: '#ccc' }}>2D Animation, 3D Animation, VFX, Motion Graphics, Graphic Design, Branding, Illustration, and Digital Art</strong> for ambitious brands, agencies, startups, and creators worldwide.
            </p>
            <p style={{ fontSize: '16px', color: '#888', marginBottom: '20px', lineHeight: 1.8 }}>
              Our mission is simple: <strong style={{ color: '#ccc' }}>transform ideas into powerful visual experiences that captivate audiences and elevate businesses.</strong>
            </p>
            <p style={{ fontSize: '16px', color: '#888', lineHeight: 1.8 }}>
              Every frame, every design, every animation, and every detail is crafted with purpose. We blend artistic creativity, strategic thinking, and modern production techniques to create work that is not only visually stunning but also meaningful, engaging, and results-driven.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '100px 32px', borderTop: '1px solid #1e1e1e', background: '#0d0d0d' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', letterSpacing: '3px', color: '#e31c1c', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px', textAlign: 'center' }}>
            What We Do
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: '64px', textAlign: 'center', letterSpacing: '-0.5px' }}>
            Our Expertise
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2px', background: '#1e1e1e' }}>
            {services.map((service, idx) => (
              <motion.a
                key={service.name}
                href={service.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                style={{
                  display: 'block', padding: '48px 40px',
                  background: '#0d0d0d', textDecoration: 'none',
                  color: '#fff', transition: 'background 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#141414'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#0d0d0d'}
              >
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{service.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{service.name}</h3>
                <div style={{ width: '24px', height: '2px', background: '#e31c1c', marginTop: '12px', transition: 'width 0.3s' }} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '100px 32px', borderTop: '1px solid #1e1e1e' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '12px', letterSpacing: '3px', color: '#e31c1c', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>
            Our Advantage
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: '56px', letterSpacing: '-0.5px' }}>
            Why Clients Choose Us
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {[
              'Creative solutions tailored to your goals—not generic templates.',
              'End-to-end production from concept to final delivery.',
              'Premium-quality visuals with attention to every detail.',
              'Reliable communication, efficient workflows, and on-time delivery.',
              'A multidisciplinary team capable of handling diverse creative challenges under one roof.',
            ].map((point, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}
              >
                <span style={{ color: '#e31c1c', fontSize: '20px', lineHeight: 1.4, flexShrink: 0 }}>→</span>
                <p style={{ color: '#888', fontSize: '15px', lineHeight: 1.8 }}>{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '120px 32px',
        borderTop: '1px solid #1e1e1e',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ maxWidth: '640px', margin: '0 auto' }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1, letterSpacing: '-1px' }}>
            The strongest ideas deserve exceptional execution.
          </h2>
          <p style={{ fontSize: '17px', color: '#666', marginBottom: '48px', lineHeight: 1.7 }}>
            Let&apos;s create work that inspires, engages, and leaves a lasting impression.
          </p>
          <Link
            href="/contact"
            style={{
              padding: '16px 48px', background: '#e31c1c', color: '#fff',
              border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
              letterSpacing: '0.5px', transition: 'background 0.2s',
              textDecoration: 'none', display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#c41515'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#e31c1c'}
          >
            Start Your Project
          </Link>
        </motion.div>
      </section>
      
      <style>{`
        @media (max-width: 768px) {
          .slideshow-carousel {
            gap: 16px !important;
          }
          .flanking-poster {
            display: none !important;
          }
          .active-poster {
            width: 260px !important;
            height: 360px !important;
          }
        }
      `}</style>
    </main>
  );
}
