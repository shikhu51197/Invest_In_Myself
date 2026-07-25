'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const THEMES = [
  { id: '', name: 'Midnight Serenade', icon: '🌙', desc: 'Deep Space Indigo & Rose Gold', colors: ['#6366f1', '#ec4899'] },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '⚡', desc: 'Futuristic Neon Cyan & Magenta', colors: ['#00f0ff', '#ff007f'] },
  { id: 'aurora', name: 'Aurora Emerald', icon: '🌲', desc: 'Mystic Forest Teal & Amber', colors: ['#10b981', '#f59e0b'] },
  { id: 'sunset', name: 'Sunset Lofi', icon: '🌅', desc: 'Warm Evening Rose & Golden Amber', colors: ['#f97316', '#fb7185'] },
  { id: 'luxury', name: 'Classic Luxury', icon: '👑', desc: 'Crisp Slate & Golden Onyx', colors: ['#d97706', '#3b82f6'] }
];

export default function Navbar() {
  const [activeTheme, setActiveTheme] = useState('');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check localStorage or default to empty string (Midnight Serenade)
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
    <nav className="navbar animate-fade-in" style={{ transition: 'all 0.3s ease' }}>
      <div className="container flex flex-wrap items-center justify-between py-3 gap-4">
        {/* Brand Logo with Live Status */}
        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 15px var(--accent-glow)',
            color: 'white',
            fontWeight: 'bold',
            flexShrink: 0
          }}>
            E
          </div>
          <div>
            <span className="font-display gradient-text" style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.03em', display: 'block', lineHeight: 1.1 }}>
              EmoWords
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'inline-block', boxShadow: '0 0 8px var(--accent-primary)' }}></span>
              Creative Hub 2.0
            </span>
          </div>
        </Link>

        {/* Action Controls & Mood Switcher */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Mood Vibe Switcher Dropdown */}
          <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="btn-outline flex items-center gap-2"
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                borderColor: isThemeOpen ? 'var(--accent-primary)' : 'var(--glass-border)',
                background: isThemeOpen ? 'var(--glass-bg-hover)' : 'rgba(255, 255, 255, 0.04)',
                boxShadow: isThemeOpen ? '0 0 16px var(--accent-glow)' : 'none'
              }}
              title="Change Atmosphere & Mood Theme"
            >
              <span style={{ fontSize: '1.1rem' }}>{currentThemeObj.icon}</span>
              <span className="hidden md:inline" style={{ display: 'inline-block' }}>{currentThemeObj.name}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.7, transform: isThemeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▼</span>
            </button>

            {/* Floating Glassmorphism Mood Selection Menu */}
            {isThemeOpen && (
              <div 
                className="glass animate-fade-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '280px',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  zIndex: 10001,
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.7), 0 0 25px var(--accent-glow)',
                  border: '1px solid var(--border-hover)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', padding: '0.25rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                  🎨 Select Site Atmosphere
                </div>
                <div className="flex flex-col gap-1">
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
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--bg-tertiary)' : 'transparent',
                          border: isSelected ? '1px solid var(--border-color)' : '1px solid transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease',
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span style={{ fontSize: '1.25rem' }}>{theme.icon}</span>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{theme.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{theme.desc}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
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

          <Link href="/explore" className="btn-outline" style={{ padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-full)', fontSize: '0.88rem', fontWeight: 600 }}>
            ✨ Explore All
          </Link>

          <Link href="/upload" className="btn btn-primary" style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}>
            <span style={{ marginRight: '0.4rem', fontSize: '1rem' }}>✦</span> New Post
          </Link>
        </div>
      </div>
    </nav>
  );
}
