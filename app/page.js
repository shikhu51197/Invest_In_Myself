import HomeFeed from '../components/HomeFeed';
import { getPosts } from './data/postsStore';
import Link from 'next/link';

export const revalidate = 0; // Enable real-time instant feed refresh
export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getPosts();

  // Calculate Real-time Collection Metrics
  const totalCreations = posts.length;
  const songCount = posts.filter(p => p.category === 'Songs' || p.mediaType === 'audio').length;
  const blogCount = posts.filter(p => p.category === 'Blogs' || p.category === 'Tech').length;
  const poetryCount = posts.filter(p => p.category === 'Poetry' || p.category === 'Shayri').length;

  return (
    <div className="container py-8">
      
      {/* 100% Pixel-Perfect Executive Hero Section */}
      <section className="text-center py-16 mb-12 animate-fade-in relative" style={{ position: 'relative', zIndex: 2 }}>
        
        {/* Animated V2.0 Glow Chip */}
        <div style={{ display: 'inline-block', marginBottom: '1.5rem' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            padding: '0.45rem 1.15rem', 
            borderRadius: 'var(--radius-full)', 
            backgroundColor: 'rgba(99, 102, 241, 0.12)', 
            border: '1px solid rgba(236, 72, 153, 0.35)', 
            fontSize: '0.82rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            color: 'var(--text-primary)',
            boxShadow: '0 0 25px var(--accent-glow)'
          }}>
            <span className="animate-pulse-glow" style={{ color: 'var(--accent-secondary)', fontSize: '1.1rem' }}>✦</span>
            <span>Next-Gen Interactive Canvas & Architecture Hub</span>
          </span>
        </div>

        {/* Headline with Modular Fluid Styling */}
        <h1 className="font-display mb-6" style={{ fontSize: 'clamp(2.6rem, 5vw, 4.5rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, maxWidth: '920px', margin: '0 auto 1.5rem' }}>
          Where Logical Software Engineering Meets <span className="gradient-text">Lyrical Art</span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 2.75rem', lineHeight: 1.7, fontWeight: 400 }}>
          Explore my complete developer ecosystem—featuring deep dive technical architectures, AI-composed musical soundtracks, expressive poetry, and real-time interactive engineering.
        </p>

        {/* Precision Hero Buttons with explicit generous vertical spacing and equalized baseline alignments */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-16" style={{ marginBottom: '3.5rem', marginTop: '0.5rem' }}>
          <Link 
            href="/explore" 
            className="btn btn-primary" 
            style={{ 
              height: '52px', 
              padding: '0 2.2rem', 
              fontSize: '1.02rem', 
              fontWeight: 700, 
              fontFamily: 'var(--font-display)',
              borderRadius: 'var(--radius-full)', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', lineHeight: 1 }}>⚡</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Explore All Creations</span>
          </Link>
          <a 
            href="https://shikhu51197.github.io/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-outline" 
            style={{ 
              height: '52px', 
              padding: '0 2.1rem', 
              fontSize: '1.02rem', 
              fontWeight: 700, 
              fontFamily: 'var(--font-display)',
              borderRadius: 'var(--radius-full)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '0.65rem', 
              textDecoration: 'none' 
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', lineHeight: 1 }}>🌐</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>View Live Developer Portfolio</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', lineHeight: 1, marginLeft: '0.1rem' }}>↗</span>
          </a>
        </div>

        {/* 100% Pixel-Perfect Real-Time Collection Analytics Dashboard (Aligned to exact grid edge) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ width: '100%' }}>
          <div className="glass-card text-center" style={{ padding: '1.75rem 1.25rem' }}>
            <div className="gradient-text font-display" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {totalCreations}+
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Total Creations
            </div>
          </div>

          <div className="glass-card text-center" style={{ padding: '1.75rem 1.25rem' }}>
            <div className="gradient-text font-display" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {songCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <span>🎵 AI Songs</span>
            </div>
          </div>

          <div className="glass-card text-center" style={{ padding: '1.75rem 1.25rem' }}>
            <div className="gradient-text font-display" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {blogCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              💻 Tech Architectures
            </div>
          </div>

          <div className="glass-card text-center" style={{ padding: '1.75rem 1.25rem' }}>
            <div className="gradient-text font-display" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {poetryCount}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ✍️ Soulful Poetry
            </div>
          </div>
        </div>

      </section>

      {/* Main Interactive Discovery Feed */}
      <HomeFeed initialPosts={posts} />

    </div>
  );
}
