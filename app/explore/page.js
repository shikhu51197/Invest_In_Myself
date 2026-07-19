'use client';
import { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard';

const CATEGORIES = ['All', 'Poetry', 'Shayri', 'Songs', 'Sketches', 'Recipes', 'Blogs', 'Thoughts', 'Advice'];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }, []);

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="container py-8">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="gradient-text font-serif" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Explore EmoWords
        </h1>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`btn ${activeCategory === category ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filtered Posts */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fade-in">
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
            No posts found in this category yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
