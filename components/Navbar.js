'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const THEMES = [
  { id: '', name: 'Midnight Serenade', icon: '🌙', desc: 'Deep Space Indigo & Rose Gold', colors: ['#6366f1', '#ec4899'] },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '⚡', desc: 'Futuristic Neon Cyan & Magenta', colors: ['#00f0ff', '#ff007f'] },
  { id: 'aurora', name: 'Aurora Emerald', icon: '🌲', desc: 'Mystic Forest Teal & Amber', colors: ['#10b981', '#f59e0b'] },
  { id: 'sunset', name: 'Sunset Lofi', icon: '🌅', desc: 'Warm Evening Rose & Golden Amber', colors: ['#f97316', '#fb7185'] },
  { id: 'luxury', name: 'Classic Luxury', icon: '👑', desc: 'Crisp Slate & Golden Onyx', colors: ['#d97706', '#2563eb'] }
];

export default function Navbar() {
  const [activeTheme, setActiveTheme] = useState('');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('emowords-theme') || '';
    setActiveTheme(saved);
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (themeId) => {
    setActiveTheme(themeId);
    localStorage.setItem('emowords-theme', themeId);
    if (themeId) {
      document.documentElement.setAttribute('data-theme', themeId);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    setIsThemeOpen(false);
  };

  const currentThemeObj = THEMES.find(t => t.id === activeTheme) || THEMES[0];

  return (
    <header style={{ position: 'sticky', top: '16px', zIndex: 9999, width: '100%', pointerEvents: 'none' }}>
      <nav className="navbar animate-fade-in" style={{ 
        maxWidth: '1240px',
        margin: '0 auto',
        width: 'calc(100% - 3rem)',
        pointerEvents: 'auto',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
      }}>
        <div className="flex flex-wrap items-center justify-between" style={{ width: '100%', padding: '0 1.5rem', gap: '1rem' }}>
          
          {/* Pixel-Perfect Brand Logo & Status Pulse */}
          <Link href="/" className="flex items-center" style={{ textDecoration: 'none', gap: '0.85rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
              boxShadow: '0 4px 16px var(--accent-glow)',
              color: 'white',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}>
              E
            </div>
            <div>
              <span className="font-display gradient-text" style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.035em', display: 'block', lineHeight: 1.1 }}>
                EmoWords
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
                Creative Hub 2.0
              </span>
            </div>
          </Link>

          {/* Precision Action Controls with 100% Equalized Text & Icon Baseline Alignment */}
          <div className="flex flex-wrap items-center" style={{ gap: '0.75rem' }}>
            
            {/* Vibe Selector Dropdown Button */}
            <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="btn-outline"
                style={{
                  height: '44px',
                  padding: '0 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  borderColor: isThemeOpen ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: isThemeOpen ? 'var(--glass-bg-hover)' : 'rgba(255, 255, 255, 0.04)',
                  boxShadow: isThemeOpen ? '0 0 16px var(--accent-glow)' : 'none',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
                title="Select Atmospheric Vibe Theme"
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', lineHeight: 1 }}>{currentThemeObj.icon}</span>
                <span className="hidden md:inline" style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>{currentThemeObj.name}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', lineHeight: 1, opacity: 0.7, transform: isThemeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', marginLeft: '0.1rem' }}>▼</span>
              </button>

              {/* Floating Glassmorphism Theme Menu */}
              {isThemeOpen && (
                <div 
                  className="glass animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    right: 0,
                    width: '290px',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-lg)',
                    zIndex: 10001,
                    boxShadow: '0 20px 45px -10px rgba(0,0,0,0.8), 0 0 30px var(--accent-glow)',
                    border: '1px solid var(--border-hover)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '0.35rem 0.6rem 0.6rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.4rem' }}>
                    🎨 Select Site Atmosphere
                  </div>
                  <div className="flex flex-col" style={{ gap: '0.35rem' }}>
                    {THEMES.map((theme) => {
                      const isSelected = activeTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.65rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                            border: isSelected ? '1px solid var(--border-color)' : '1px solid transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s ease',
                            color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div className="flex items-center" style={{ gap: '0.65rem' }}>
                            <span style={{ fontSize: '1.25rem', lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}>{theme.icon}</span>
                            <div>
                              <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.2 }}>{theme.name}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{theme.desc}</div>
                            </div>
                          </div>
                          <div className="flex items-center" style={{ gap: '0.25rem' }}>
                            {theme.colors.map((col, idx) => (
                              <span key={idx} style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: col, boxShadow: `0 0 6px ${col}` }}></span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Explore All Button (Equalized baseline geometry) */}
            <Link 
              href="/explore" 
              className="btn-outline" 
              style={{ 
                height: '44px', 
                padding: '0 1.35rem', 
                borderRadius: 'var(--radius-full)', 
                fontSize: '0.9rem', 
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.5rem',
                userSelect: 'none'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', lineHeight: 1 }}>✨</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Explore All</span>
            </Link>

            {/* New Post Button (Equalized baseline geometry) */}
            <Link 
              href="/upload" 
              className="btn btn-primary" 
              style={{ 
                height: '44px', 
                padding: '0 1.45rem', 
                fontSize: '0.9rem', 
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.5rem',
                userSelect: 'none'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.15rem', lineHeight: 1 }}>✦</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>New Post</span>
            </Link>

          </div>

        </div>
      </nav>
    </header>
  );
}
