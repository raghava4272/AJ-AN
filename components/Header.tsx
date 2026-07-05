'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/2d', label: '2D' },
    { href: '/3d', label: '3D' },
    { href: '/vfx', label: 'VFX' },
    { href: '/graphic-design', label: 'Graphic Design' },
    { href: '/art-design', label: 'Art & Design' },
    { href: '/motion-graphics', label: 'Motion Graphics' },
    { href: '/about', label: 'About Us' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 50,
          background: '#111',
          borderBottom: '1px solid #222',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '-0.5px', color: '#fff' }}>
                <span style={{ color: '#e31c1c' }}>AJ</span>
                <span style={{ color: '#aaa', fontWeight: 300, fontSize: '20px', margin: '0 4px' }}>+</span>
                <span style={{ color: '#fff' }}>AN</span>
              </span>
              <span style={{ fontSize: '11px', color: '#666', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500 }}>
                Creative Studio
              </span>
            </div>
          </Link>

          {/* Desktop Nav — hidden on small screens */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '28px',
              flexWrap: 'nowrap',
            }}
            className="desktop-nav"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive(link.href) ? '#e31c1c' : '#bbb',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                  letterSpacing: '0.1px',
                }}
                onMouseEnter={e => {
                  if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.color = '#bbb';
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'none' }}
            aria-label="Toggle menu"
          >
            <div style={{ width: '22px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <span style={{ height: '2px', background: '#fff', display: 'block', borderRadius: '1px', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
              <span style={{ height: '2px', background: '#fff', display: 'block', borderRadius: '1px', transition: 'all 0.3s', opacity: mobileMenuOpen ? 0 : 1 }} />
              <span style={{ height: '2px', background: '#fff', display: 'block', borderRadius: '1px', transition: 'all 0.3s', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed', top: '80px', left: 0, right: 0,
            background: '#111', borderBottom: '1px solid #222',
            zIndex: 49, padding: '20px 24px',
            display: 'flex', flexDirection: 'column', gap: '18px',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: '15px', color: isActive(link.href) ? '#e31c1c' : '#ccc', textDecoration: 'none', fontWeight: 500 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (max-width: 1100px) {
          .desktop-nav { gap: 18px !important; }
        }
        @media (max-width: 1000px) {
          .desktop-nav a { font-size: 12px !important; }
          .desktop-nav { gap: 14px !important; }
        }
      `}</style>
    </>
  );
}
