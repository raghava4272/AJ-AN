'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    // Simulate submission
    setSubmitted(true);
    setName('');
    setEmail('');
    setDescription('');
    setTimeout(() => setSubmitted(false), 5000);
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

              {/* Success message */}
              {submitted && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  background: '#16a34a18',
                  border: '1px solid #16a34a44',
                  color: '#4ade80',
                  fontSize: '14px',
                }}>
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 36px',
                  background: '#e31c1c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#c41515')}
                onMouseLeave={e => (e.currentTarget.style.background = '#e31c1c')}
              >
                Submit
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

            {/* Address */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={iconContainerStyle}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e31c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h3 style={sectionTitleStyle}>Address</h3>
                <p style={sectionSubtextStyle}>Freelancers</p>
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
