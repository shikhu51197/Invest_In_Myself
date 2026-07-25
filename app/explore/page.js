'use client';
import { useState, useEffect } from 'react';
import HomeFeed from '../../components/HomeFeed';

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-8">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="gradient-text font-serif" style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Explore EmoWords
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
          Browse by creative category or search keywords across technical articles, AI soundtracks, poetry, and art.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div style={{ display: 'inline-block', width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-primary)', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
            Loading creative universe...
          </p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <HomeFeed initialPosts={posts} isExplorePage={true} />
      )}
    </div>
  );
}
