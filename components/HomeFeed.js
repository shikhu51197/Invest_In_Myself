'use client';
import { useState, useMemo, useEffect } from 'react';
import PostCard from './PostCard';
import MediaViewer from './MediaViewer';
import ShareButtons from './ShareButtons';
import Link from 'next/link';
import { getCategoryEmoji } from '../utils/emojiMap';

const CATEGORY_META = {
  All: { label: 'All Entries', icon: '🌟', desc: 'Explore the complete collection of articles, poetry, artwork, songs, and recipes.' },
  Bookmarks: { label: 'My Bookmarks', icon: '🔖', desc: 'Your personally curated reading shelf of saved poems, AI lyrical songs, architectures, and stories.' },
  Blogs: { label: 'Blogs & Tech', icon: '🚀', desc: 'Software engineering architecture, AI experimentation, real-world project deep-dives, and developer portfolio highlights.' },
  Songs: { label: 'AI & Lyrical Songs', icon: '🎵', desc: 'Original human lyrical poetry harmoniously fused with AI acoustic compositions and playable soundtracks.' },
  Poetry: { label: 'Poetry', icon: '📜', desc: 'Evocative verse capturing fleeting human thoughts, emotions, and philosophical beauty.' },
  Shayri: { label: 'Shayri', icon: '🪶', desc: 'Soulful rhythmic expression of heartbreak, love, and deepest feelings.' },
  Sketches: { label: 'Sketches & Art', icon: '🎨', desc: 'Hand-drawn illustrations, digital art studies, and intuitive creative designs.' },
  Recipes: { label: 'Recipes', icon: '🍳', desc: 'Culinary adventures and secretly treasured homemade flavor formulas.' },
  Thoughts: { label: 'Raw Thoughts', icon: '💭', desc: 'Unfiltered musings, quiet reflections, and grounding observations in nature.' },
  Advice: { label: 'Advice & Mentorship', icon: '💡', desc: 'Practical wisdom, mindful living tips, and career development guidance.' }
};

export default function HomeFeed({ initialPosts, isExplorePage = false }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // For Quick Look Modal
  const [copyNotice, setCopyNotice] = useState(false);

  // Load user bookmarks from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('emowords-bookmarks') || '[]');
    setBookmarkedIds(stored);
  }, []);

  const handleBookmarkToggle = (postId, isNowBookmarked) => {
    setBookmarkedIds(prev => 
      isNowBookmarked ? [...prev, postId] : prev.filter(id => id !== postId)
    );
  };

  const categories = Object.keys(CATEGORY_META);

  const filteredPosts = useMemo(() => {
    return (initialPosts || []).filter(post => {
      let matchesCat = true;
      if (activeCategory === 'Bookmarks') {
        matchesCat = bookmarkedIds.includes(post.id);
      } else if (activeCategory !== 'All') {
        matchesCat = post.category === activeCategory;
      }

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCat;

      const titleMatch = (post.title || '').toLowerCase().includes(query);
      const catMatch = (post.category || '').toLowerCase().includes(query);
      const contentMatch = (post.content || '').toLowerCase().includes(query);

      return matchesCat && (titleMatch || catMatch || contentMatch);
    });
  }, [initialPosts, activeCategory, searchQuery, bookmarkedIds]);

  const currentMeta = CATEGORY_META[activeCategory] || CATEGORY_META.All;

  // Serendipitous Discovery: Random Post selection
  const handleSurpriseMe = () => {
    const pool = filteredPosts.length > 0 ? filteredPosts : initialPosts || [];
    if (pool.length === 0) return;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setSelectedPost(pool[randomIndex]);
  };

  const handleCopyLink = (id) => {
    const url = `${window.location.origin}/post/${id}`;
    navigator.clipboard.writeText(url);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 2000);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Search & Discovery Control Center */}
      <div className="mb-12 animate-fade-in">
        
        {/* Search Input + Surprise Me Button Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto mb-8" style={{ maxWidth: '720px', margin: '0 auto 2rem auto' }}>
          <div style={{ flexGrow: 1, position: 'relative', minWidth: '280px' }}>
            <span style={{ position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', pointerEvents: 'none', opacity: 0.7 }}>
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI songs, code stacks, shayri, or lyrics..."
              style={{
                width: '100%',
                padding: '0.9rem 1.4rem 0.9rem 3.6rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'var(--glass-bg)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-md)',
                backdropFilter: 'blur(12px)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '1.4rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 700 }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Surprise Me Button */}
          <button
            onClick={handleSurpriseMe}
            className="btn btn-primary flex items-center gap-2"
            style={{ 
              padding: '0.9rem 1.5rem', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.95rem', 
              fontWeight: 700,
              boxShadow: '0 8px 25px var(--accent-glow)' 
            }}
            title="Discover a random entry from the collection!"
          >
            <span style={{ fontSize: '1.2rem' }}>🎲</span>
            <span>Surprise Me</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isActive = activeCategory === cat;
            const count = cat === 'Bookmarks' 
              ? bookmarkedIds.length 
              : cat === 'All' 
                ? (initialPosts || []).length 
                : (initialPosts || []).filter(p => p.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '0.55rem 1.2rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 700 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: isActive ? '0 4px 20px var(--accent-glow)' : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'none'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{meta.icon}</span>
                <span>{cat}</span>
                <span style={{ 
                  fontSize: '0.72rem', 
                  padding: '0.12rem 0.5rem', 
                  borderRadius: 'var(--radius-full)', 
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', 
                  color: isActive ? 'white' : 'var(--text-secondary)',
                  marginLeft: '0.15rem'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Context Banner */}
        <div 
          className="glass"
          style={{
            padding: '1.4rem 2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--glass-border)',
            maxWidth: '780px',
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem' }}>
            <span>{currentMeta.icon}</span>
            <span>{currentMeta.label}</span>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.7rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontWeight: 700 }}>
              {filteredPosts.length} {filteredPosts.length === 1 ? 'entry' : 'entries'}
            </span>
          </h3>
          <p style={{ margin: 0, fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {currentMeta.desc}
          </p>
          {activeCategory === 'Blogs' && (
            <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              🌐 Want to examine live deployed code demos? Visit my executive portfolio at <a href="https://shikhu51197.github.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', textDecoration: 'underline' }}>shikhu51197.github.io</a>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${(index % 6) * 0.07}s` }}>
              <PostCard 
                post={post} 
                onOpenQuickLook={(p) => setSelectedPost(p)} 
                onBookmarkToggle={handleBookmarkToggle} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="glass text-center py-16 animate-fade-in" style={{ maxWidth: '600px', margin: '3rem auto', padding: '3rem 2rem' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.2rem' }}>
            {activeCategory === 'Bookmarks' ? '📑' : '📭'}
          </span>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
            {activeCategory === 'Bookmarks' ? 'Your reading shelf is empty' : 'No posts match your current filter'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', margin: '0 auto 1.8rem auto', maxWidth: '420px', lineHeight: 1.6 }}>
            {activeCategory === 'Bookmarks'
              ? 'Bookmark any poem, AI song, or tech architecture while exploring to build your personal offline reading list!'
              : "We couldn't find any creative works matching your category filtering or keyword search."}
          </p>
          <button
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className="btn btn-primary"
            style={{ padding: '0.7rem 1.6rem', borderRadius: 'var(--radius-full)' }}
          >
            Explore Complete Collection
          </button>
        </div>
      )}

      {/* ⚡ Quick Look Glassmorphism Modal Drawer */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div 
            className="modal-content animate-fade-in" 
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-hover)' }}
          >
            <button 
              className="modal-close-btn" 
              onClick={() => setSelectedPost(null)}
              title="Close Preview"
            >
              ✕
            </button>

            {/* Modal Header Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em',
                color: 'var(--accent-primary)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span>{getCategoryEmoji(selectedPost.category)}</span>
                <span>{selectedPost.category}</span>
              </span>
              
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {new Date(selectedPost.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className="font-display gradient-text" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.2rem', lineHeight: 1.25 }}>
              {selectedPost.title}
            </h2>

            {/* Media (Playable Soundtrack / Image) */}
            {(() => {
              const mediaItems = selectedPost.mediaList && selectedPost.mediaList.length > 0
                ? selectedPost.mediaList
                : selectedPost.mediaUrl ? [{ url: selectedPost.mediaUrl, type: selectedPost.mediaType, name: selectedPost.title }] : [];
                
              if (mediaItems.length === 0) return null;

              return (
                <div style={{ marginBottom: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {mediaItems.map((media, idx) => (
                    <div key={idx}>
                      <MediaViewer url={media.url} type={media.type} alt={media.name || `${selectedPost.title} media`} isCard={false} />
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Full Post Content with Drop Cap */}
            <div 
              className="post-content-full"
              style={{ marginBottom: '2.5rem' }}
              dangerouslySetInnerHTML={{ __html: selectedPost.content || '<em>No additional text provided for this entry.</em>' }}
            />

            {/* Modal Interactive Action Foot bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopyLink(selectedPost.id)}
                  className="btn-outline"
                  style={{ padding: '0.55rem 1.2rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <span>🔗</span>
                  <span>{copyNotice ? 'Link Copied to Clipboard! ✨' : 'Copy Direct Link'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="btn-outline"
                  style={{ padding: '0.55rem 1.2rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem' }}
                >
                  Close
                </button>

                <Link 
                  href={`/post/${selectedPost.id}`} 
                  className="btn btn-primary"
                  onClick={() => setSelectedPost(null)}
                  style={{ padding: '0.6rem 1.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.9rem' }}
                >
                  Open Dedicated Page ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
