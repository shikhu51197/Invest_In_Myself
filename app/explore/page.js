import HomeFeed from '../../components/HomeFeed';
import { getPosts } from '../data/postsStore';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function Explore() {
  const posts = await getPosts();

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

      <HomeFeed initialPosts={posts} isExplorePage={true} />
    </div>
  );
}
