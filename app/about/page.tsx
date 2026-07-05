'use client';

import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function About() {
  const sections = [
    {
      title: 'Our Studio',
      content: [
        'We are a full-service creative studio delivering world-class 2D Animation, 3D Animation, VFX, Motion Graphics, Graphic Design, Branding, Illustration, and Digital Art for ambitious brands, agencies, startups, and creators worldwide.'
      ]
    },
    {
      title: 'Our Mission',
      content: [
        'Our mission is simple: transform ideas into powerful visual experiences that captivate audiences and elevate businesses.',
        'Every frame, every design, every animation, and every detail is crafted with purpose. We blend artistic creativity, strategic thinking, and modern production techniques to create work that is not only visually stunning but also meaningful, engaging, and results-driven.'
      ]
    },
    {
      title: 'What We Do',
      content: [
        'From launching brands and designing visual identities to producing cinematic animations, advertising campaigns, product explainers, social media content, game assets, and high-end visual effects, we deliver creative solutions tailored to each client\'s vision and goals.',
        'We don\'t believe in generic templates or one-size-fits-all designs. Every project is approached with fresh thinking, meticulous craftsmanship, and an uncompromising commitment to quality.',
        'Whether you\'re building a new brand, promoting a product, creating content that stands out, or bringing an imaginative idea to life, we\'re ready to turn your vision into something extraordinary.'
      ]
    },
    {
      title: 'Why Clients Choose Us',
      content: [
        '→ Creative solutions tailored to your goals—not generic templates.',
        '→ End-to-end production from concept to final delivery.',
        '→ Premium-quality visuals with attention to every detail.',
        '→ Reliable communication, efficient workflows, and on-time delivery.',
        '→ A multidisciplinary team capable of handling diverse creative challenges under one roof.'
      ]
    }
  ];

  return (
    <main style={{ background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <Header />

      {/* Page header */}
      <section style={{
        paddingTop: '120px', paddingBottom: '60px',
        paddingLeft: '32px', paddingRight: '32px',
        borderBottom: '1px solid #1e1e1e',
        background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '12px', letterSpacing: '3px', color: '#e31c1c', textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}
          >
            About Us
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ fontSize: 'clamp(40px, 8vw, 80px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}
          >
            About AJ&AN
          </motion.h1>
        </div>
      </section>

      {sections.map((section, sectionIdx) => (
        <section
          key={section.title}
          style={{ padding: '72px 32px', borderBottom: '1px solid #1e1e1e', background: sectionIdx % 2 === 1 ? '#0d0d0d' : '#0a0a0a' }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, marginBottom: '28px', letterSpacing: '-0.5px' }}>
                {section.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {section.content.map((para, idx) => (
                  <p
                    key={idx}
                    style={{ fontSize: '16px', color: '#888', lineHeight: 1.8 }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section style={{ padding: '100px 32px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          style={{ maxWidth: '560px', margin: '0 auto' }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
            Ready to Create?
          </h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', lineHeight: 1.7 }}>
            Let&apos;s work together to transform your vision into something extraordinary.
          </p>
          <button
            style={{
              padding: '14px 44px', background: '#e31c1c', color: '#fff',
              border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
              letterSpacing: '0.3px', transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#c41515'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#e31c1c'}
          >
            Get In Touch
          </button>
        </motion.div>
      </section>
    </main>
  );
}
