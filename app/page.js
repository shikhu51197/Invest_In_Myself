import HomeFeed from '../components/HomeFeed';
import { getPosts } from './data/postsStore';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // Prevent static caching

export default async function Home() {
  const posts = await getPosts();

  // Calculate high-end collection analytics
  const totalPosts = posts.length;
  const techPosts = posts.filter(p => ['Blogs', 'Advice'].includes(p.category)).length;
  const songPosts = posts.filter(p => p.category === 'Songs').length;
  const creativePosts = posts.filter(p => ['Poetry', 'Shayri', 'Sketches', 'Recipes', 'Thoughts'].includes(p.category)).length;

  return (
    <div className="container py-8">
      {/* Executive Hero Showcase Suite */}
      <div className="text-center mb-14 animate-fade-in" style={{ position: 'relative' }}>
        
        {/* Animated Floating Pill Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div 
            className="animate-pulse-glow"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.6rem',
              padding: '0.45rem 1.25rem', 
              borderRadius: 'var(--radius-full)', 
              backgroundColor: 'rgba(255, 255, 255, 0.04)', 
              border: '1px solid var(--border-hover)',
              boxShadow: '0 0 20px var(--accent-glow)',
              fontSize: '0.88rem', 
              fontWeight: 600, 
              color: 'var(--text-primary)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>⚡</span>
            <span>Architectural Engineering & Soulful AI Compositions</span>
            <span style={{ 
              padding: '0.15rem 0.55rem', 
              borderRadius: 'var(--radius-full)', 
              backgroundColor: 'var(--accent-gradient)', 
              color: 'white', 
              fontSize: '0.72rem', 
              fontWeight: 700, 
              letterSpacing: '0.05em' 
            }}>
              V2.0 LIVE
            </span>
          </div>
        </div>

        {/* Spectacular Hero Title */}
        <h1 
          className="font-display gradient-text" 
          style={{ 
            fontSize: 'clamp(2.8rem, 6.5vw, 4.8rem)', 
            fontWeight: 800, 
            marginBottom: '1.4rem', 
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            maxWidth: '940px',
            margin: '0 auto 1.4rem auto',
            textShadow: '0 10px 40px var(--accent-glow)'
          }}
        >
          Where Code Craftsmanship Meets Soulful Artistry.
        </h1>

        {/* Executive Subtitle Narrative */}
        <p style={{ 
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', 
          color: 'var(--text-secondary)', 
          maxWidth: '740px', 
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Explore a limitless digital canvas featuring <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>full-stack architecture</span> deep dives, acoustic <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>AI musical soundtracks</span>, and expressive human poetry.
        </p>

        {/* Live Collection Analytics Dashboard (Glassmorphism Tier) */}
        <div 
          className="glass"
          style={{
            maxWidth: '860px',
            margin: '0 auto 2rem auto',
            padding: '1.5rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 30px var(--accent-glow)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Ambient top highlight */}
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: 'var(--accent-gradient)' }}></div>

          {/* Metric 1: Total Collection */}
          <div className="text-center" style={{ borderRight: '1px dashed var(--border-color)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {totalPosts} <span style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>✦</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.4rem' }}>
              Total Creations
            </div>
          </div>

          {/* Metric 2: AI Songs & Audio */}
          <div className="text-center" style={{ borderRight: '1px dashed var(--border-color)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {songPosts} <span style={{ fontSize: '1.2rem', color: '#ec4899' }}>🎵</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.4rem' }}>
              AI & Lyrical Songs
            </div>
          </div>

          {/* Metric 3: Tech Blogs */}
          <div className="text-center" style={{ borderRight: '1px dashed var(--border-color)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {techPosts} <span style={{ fontSize: '1.2rem', color: '#10b981' }}>🚀</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.4rem' }}>
              Tech & Architecture
            </div>
          </div>

          {/* Metric 4: Poetry & Art */}
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
              {creativePosts} <span style={{ fontSize: '1.2rem', color: '#f59e0b' }}>📜</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.4rem' }}>
              Poetry & Art
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div style={{ width: '80px', height: '4px', borderRadius: 'var(--radius-full)', background: 'var(--accent-gradient)', margin: '0 auto 1rem auto', opacity: 0.8 }}></div>
      </div>

      {/* Interactive Feed Suite with Bookmarks, Random Exploration & Quick Preview Modals */}
      <HomeFeed initialPosts={posts} />
    </div>
  );
}
