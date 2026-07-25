import HomeFeed from '../components/HomeFeed';
import { getPosts } from './data/postsStore';

export const dynamic = 'force-dynamic'; // Prevent static caching

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container py-8">
      <div className="text-center mb-10 animate-fade-in">
        <div style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
          ✨ Tech, Art & Personal Expression Hub
        </div>
        <h1 className="gradient-text font-serif" style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Welcome to EmoWords
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          A limitless canvas where full-stack software engineering, generative AI exploration, and soulful creative arts converge.
        </p>
      </div>

      <HomeFeed initialPosts={posts} />
    </div>
  );
}
