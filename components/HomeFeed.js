'use client';
import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import MediaViewer from './MediaViewer';
import ShareButtons from './ShareButtons';
import Link from 'next/link';
import { getCategoryEmoji } from '../utils/emojiMap';

const CATEGORIES = ['All', 'Bookmarks ⭐', 'Blogs', 'Songs', 'Poetry', 'Sketches', 'Recipes', 'Shayri', 'Thoughts'];

export default function HomeFeed({ initialPosts = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [quickLookPost, setQuickLookPost] = useState(null);

  // Load Bookmarks persistently from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('emowords-bookmarks');
    if (saved) {
      try {
        setBookmarkedIds(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved bookmarks:', e);
      }
    }
  }, []);

  const handleToggleBookmark = (post) => {
    const isBookmarked = bookmarkedIds.includes(post.id);
    const nextIds = isBookmarked 
      ? bookmarkedIds.filter(id => id !== post.id)
      : [...bookmarkedIds, post.id];
      
    setBookmarkedIds(nextIds);
    localStorage.setItem('emowords-bookmarks', JSON.stringify(nextIds));
  };

  // Filter Logic
  const filteredPosts = initialPosts.filter(post => {
    if (selectedCategory === 'Bookmarks ⭐') {
      if (!bookmarkedIds.includes(post.id)) return false;
    } else if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = (post.title || '').toLowerCase().includes(q);
      const matchContent = (post.content || '').toLowerCase().includes(q);
      const matchCat = (post.category || '').toLowerCase().includes(q);
      return matchTitle || matchContent || matchCat;
    }
    return true;
  });

  // Surprise Me: Pick a Random Post
  const handleSurpriseMe = () => {
    const pool = filteredPosts.length > 0 ? filteredPosts : initialPosts;
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setQuickLookPost(pool[randomIndex]);
  };

  return (
    <div style={{ padding: '0.5rem 0 4rem' }}>
      
      {/* Pixel-Perfect Interactive Toolbar: Full Grid-Boundary Alignment */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8" style={{ width: '100%' }}>
        
        {/* Precision Full-Span Search Input */}
        <div style={{ position: 'relative', flexGrow: 1, minWidth: '280px' }}>
          <span style={{ position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.15rem', color: 'var(--text-muted)', pointerEvents: 'none' }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search articles, AI lyrics, poetry, architecture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              height: '52px',
              padding: '0 2.5rem 0 3.5rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.96rem',
              fontWeight: 500,
              outline: 'none',
              boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.15)',
              transition: 'all 0.25s ease'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)';
              e.currentTarget.style.backgroundColor = 'var(--glass-bg)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.15)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem' }}
              title="Clear Search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Surprise Me Button (Aligned to far-right card boundary with equalized typography baseline) */}
        <button
          onClick={handleSurpriseMe}
          className="btn-outline"
          style={{
            height: '52px',
            padding: '0 1.8rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: '0.96rem',
            fontFamily: 'var(--font-display)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            borderColor: 'var(--accent-secondary)',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12), rgba(168, 85, 247, 0.12))',
            boxShadow: '0 4px 20px rgba(236, 72, 153, 0.15)',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            cursor: 'pointer',
            userSelect: 'none'
          }}
          title="Pick a random creation to experience"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', lineHeight: 1 }}>🎲</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Surprise Me</span>
        </button>
      </div>

      {/* 100% Pixel-Perfect Category Navigation Pills with equalized text and icon baselines */}
      <div className="flex flex-wrap justify-center mb-12" style={{ gap: '0.65rem', width: '100%' }}>
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const isBookmarkTab = cat === 'Bookmarks ⭐';
          const count = isBookmarkTab ? bookmarkedIds.length : (cat === 'All' ? initialPosts.length : initialPosts.filter(p => p.category === cat).length);
          
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                height: '42px',
                padding: '0 1.35rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: isSelected ? 800 : 700,
                fontSize: '0.9rem',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.015em',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: isSelected ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                border: isSelected ? '1px solid transparent' : '1px solid var(--border-color)',
                boxShadow: isSelected ? '0 6px 20px var(--accent-glow)' : 'none',
                transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
                whiteSpace: 'nowrap',
                userSelect: 'none'
              }}
            >
              {isBookmarkTab ? null : <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.12rem', lineHeight: 1 }}>{getCategoryEmoji(cat === 'All' ? '' : cat)}</span>}
              <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>{cat}</span>
              <span style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.74rem', 
                lineHeight: 1,
                backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.09)', 
                padding: '0.25rem 0.6rem', 
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                marginLeft: '0.15rem'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Responsive Cards Grid */}
      {filteredPosts.length === 0 ? (
        <div className="glass text-center py-16 px-6 mb-12 animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto', borderStyle: 'dashed' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>No creations found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '420px', margin: '0 auto 2rem' }}>
            {selectedCategory === 'Bookmarks ⭐' 
              ? 'Your reading shelf is currently empty. Click the 📑 bookmark button on any card to save articles or poetry here!'
              : `We couldn't find any creations matching "${searchQuery}".`}
          </p>
          {selectedCategory !== 'All' || searchQuery ? (
            <button 
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="btn btn-primary"
            >
              Reset All Filters
            </button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="animate-fade-in" style={{ height: '100%' }}>
              <PostCard 
                post={post} 
                onQuickLook={setQuickLookPost}
                isBookmarked={bookmarkedIds.includes(post.id)}
                onToggleBookmark={handleToggleBookmark}
              />
            </div>
          ))}
        </div>
      )}

      {/* ⚡ Executive Quick Look Modal Drawer (Zero layout shifts, high performance glass) */}
      {quickLookPost && (
        <div className="modal-overlay" onClick={() => setQuickLookPost(null)}>
          <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setQuickLookPost(null)} title="Close Preview">
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-primary)', backgroundColor: 'rgba(99, 102, 241, 0.12)', padding: '0.35rem 0.9rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', border: '1px solid rgba(99,102,241,0.25)' }}>
                <span>{getCategoryEmoji(quickLookPost.category)}</span>
                <span>{quickLookPost.category}</span>
              </span>
              <span suppressHydrationWarning style={{ color: 'var(--text-muted)', fontSize: '0.86rem', fontWeight: 600 }}>
                {new Date(quickLookPost.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className="font-display mb-6" style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--text-primary)' }}>
              {quickLookPost.title}
            </h2>

            {quickLookPost.mediaUrl && (
              <div className="mb-8">
                <MediaViewer url={quickLookPost.mediaUrl} type={quickLookPost.mediaType} alt={quickLookPost.title} />
              </div>
            )}

            <div 
              className="post-content-full mb-10" 
              style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}
              dangerouslySetInnerHTML={{ __html: quickLookPost.content }}
            />

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <ShareButtons title={quickLookPost.title} text={`Check out this creation on EmoWords`} url={`/post/${quickLookPost.id}`} />
              </div>
              <Link
                href={`/post/${quickLookPost.id}`}
                prefetch={false}
                className="btn btn-primary"
                style={{ padding: '0 1.8rem', height: '46px', fontSize: '0.94rem' }}
                onClick={() => setQuickLookPost(null)}
              >
                Open Complete View ↗
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
