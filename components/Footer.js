import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer mt-16 py-12" style={{ borderTop: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10" style={{ borderBottom: '1px dashed var(--border-color)' }}>
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '1.1rem' }}>E</div>
              <h3 className="font-display gradient-text m-0" style={{ fontSize: '1.6rem', fontWeight: 800 }}>EmoWords</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '320px', lineHeight: 1.6 }}>
              A limitless digital sanctuary fusing full-stack software architecture, generative AI soundtracks, soulful poetry, and intuitive creative arts.
            </p>
          </div>

          {/* Quick Links & Engagement */}
          <div className="md:text-center">
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '0.8rem', fontWeight: 700 }}>Explore Pillars</h4>
            <div className="flex flex-col gap-2" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              <Link href="/explore" className="hover:text-primary transition" style={{ transition: 'color 0.2s ease' }}>🚀 Tech Architectures & AI</Link>
              <Link href="/explore" className="hover:text-primary transition" style={{ transition: 'color 0.2s ease' }}>🎵 AI Lyrical Compositions</Link>
              <Link href="/explore" className="hover:text-primary transition" style={{ transition: 'color 0.2s ease' }}>📜 Evocative Poetry & Shayri</Link>
              <Link href="/upload" className="hover:text-primary transition" style={{ transition: 'color 0.2s ease', color: 'var(--accent-primary)', fontWeight: 600 }}>✦ Create New Entry</Link>
            </div>
          </div>

          {/* Senior Tech Attribution */}
          <div className="md:text-right">
            <h4 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '0.8rem', fontWeight: 700 }}>Engineered Excellence</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0, lineHeight: 1.7 }}>
              Built with <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Next.js 16</span>, Dynamic Ambient Glassmorphism & High-Performance Keyframes.
            </p>
            <div className="mt-4">
              <a 
                href="https://shikhu51197.github.io/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 1rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)', textDecoration: 'none' }}
              >
                <span>🌐 Developer Portfolio</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            &copy; {new Date().getFullYear()} EmoWords. All rights reserved. Crafted with precision & passion.
          </div>
          <div className="flex gap-6">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              All Systems Responsive
            </span>
            <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>Back to Top ↑</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
