import PostCard from '../components/PostCard';
import { getPosts } from './data/postsStore';

export const dynamic = 'force-dynamic'; // Prevent static caching

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container py-8">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="gradient-text font-serif" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Welcome to EmoWords
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          A limitless canvas for my poetry, shayri, songs, sketches, recipes, blogs, and raw thoughts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <div key={post.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
