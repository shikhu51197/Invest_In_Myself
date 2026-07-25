'use client';
import { useState, useMemo } from 'react';
import PostCard from './PostCard';

const CATEGORY_META = {
  All: { label: 'All Entries', icon: '🌟', desc: 'Explore the complete collection of articles, poetry, artwork, songs, and recipes.' },
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

  const categories = Object.keys(CATEGORY_META);

  const filteredPosts = useMemo(() => {
    return (initialPosts || []).filter(post => {
      const matchesCat = activeCategory === 'All' || post.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCat;

      const titleMatch = (post.title || '').toLowerCase().includes(query);
      const catMatch = (post.category || '').toLowerCase().includes(query);
      const contentMatch = (post.content || '').toLowerCase().includes(query);

      return matchesCat && (titleMatch || catMatch || contentMatch);
    });
  }, [initialPosts, activeCategory, searchQuery]);

  const currentMeta = CATEGORY_META[activeCategory] || CATEGORY_META.All;

  return (
    <div>
      {/* Search & Navigation Control Center */}
      <div className="mb-10 animate-fade-in">
        <div style={{ maxWidth: '640px', margin: '0 auto 2rem auto', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem', pointerEvents: 'none', opacity: 0.6 }}>
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blogs, lyrics, tech stacks, or recipes..."
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem 0.85rem 3.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 'bold' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Intuitive Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: isActive ? '0 0 16px rgba(168, 85, 247, 0.4)' : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{meta.icon}</span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Category Context Banner */}
        <div 
          style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            maxWidth: '760px',
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <span>{currentMeta.icon}</span>
            <span>{currentMeta.label}</span>
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontWeight: 600 }}>
              {filteredPosts.length} {filteredPosts.length === 1 ? 'entry' : 'entries'}
            </span>
          </h3>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            {currentMeta.desc}
          </p>
          {activeCategory === 'Blogs' && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.875rem' }}>
              🌐 Want to see live interactive demos? Visit my developer portfolio at <a href="https://shikhu51197.github.io/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-primary)', fontWeight: 'bold', textDecoration: 'underline' }}>shikhu51197.github.io</a>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${(index % 6) * 0.08}s` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)', maxWidth: '600px', margin: '2rem auto' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📭</span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No posts match your filters
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
            We couldn't find any items matching your current category selection or keyword search.
          </p>
          <button
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className="btn btn-primary"
            style={{ padding: '0.6rem 1.25rem', borderRadius: 'var(--radius-full)' }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
