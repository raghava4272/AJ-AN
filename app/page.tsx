'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function Home() {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      title: 'We Create Visual Experiences That Move People.',
      subtitle: "Great brands aren't remembered because they exist—they're remembered because they tell unforgettable stories.",
    },
    {
      title: 'Transform Ideas into Power',
      subtitle: 'Create visual experiences that captivate audiences and elevate businesses.',
    },
    {
      title: 'Crafted with Purpose',
      subtitle: 'Every frame, every design, every animation—crafted to inspire and engage.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  const services = [
    { name: '2D Animation', href: '/2d', icon: '🎨' },
    { name: '3D Animation', href: '/3d', icon: '🎬' },
    { name: 'Visual Effects', href: '/vfx', icon: '✨' },
    { name: 'Graphic Design', href: '/graphic-design', icon: '🖌️' },
    { name: 'Art & Design', href: '/art-design', icon: '🖼️' },
    { name: 'Motion Graphics', href: '/motion-graphics', icon: '▶️' },
  ];

  return (
    <main style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '100vh',
        marginTop: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Subtle background texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(227,28,28,0.06) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(227,28,28,0.04) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Left Arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          style={{
            position: 'absolute', left: '32px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 20, width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e31c1c'; (e.currentTarget as HTMLElement).style.borderColor = '#e31c1c'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
        >
          ←
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          aria-label="Next"
          style={{
            position: 'absolute', right: '32px', top: '50%', transform: 'translateY(-50%)',
            zIndex: 20, width: '52px', height: '52px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '20px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#e31c1c'; (e.currentTarget as HTMLElement).style.borderColor = '#e31c1c'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
        >
          →
        </button>

        {/* Content */}
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', maxWidth: '860px', padding: '0 80px', position: 'relative', zIndex: 10 }}
        >
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-1px',
          }}>
            {slides[current].title}
          </h1>
          <p style={{ fontSize: '18px', color: '#999', marginBottom: '48px', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 48px' }}>
            {slides[current].subtitle}
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button style={{
              padding: '14px 36px', background: '#e31c1c', color: '#fff',
              border: 'none', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
              letterSpacing: '0.3px', transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#c41515'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#e31c1c'}
            >
              Get Started
            </button>
            <button style={{
              padding: '14px 36px', background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)', fontWeight: 600, fontSize: '15px', cursor: 'pointer',
              letterSpacing: '0.3px', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Dots */}
        <div style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '10px', zIndex: 20,
        }}>
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Slide ${idx + 1}`}
              style={{
                height: '3px',
                width: idx === current ? '32px' : '10px',
                background: idx === current ? '#e31c1c' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s', borderRadius: '2px',
                padding: 0,
              }}
            />
          ))}
        </div>
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
          <button
            style={{
              padding: '16px 48px', background: '#e31c1c', color: '#fff',
              border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
              letterSpacing: '0.5px', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#c41515'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#e31c1c'}
          >
            Start Your Project
          </button>
        </motion.div>
      </section>
    </main>
  );
}
