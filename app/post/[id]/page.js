import { notFound } from 'next/navigation';
import { getPosts } from '../../data/postsStore';
import ShareButtons from '../../../components/ShareButtons';
import MediaViewer from '../../../components/MediaViewer';
import AdminControls from '../../../components/AdminControls';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const posts = await getPosts();
  const post = posts.find(p => p.id === resolvedParams.id);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  // Generate plain text from HTML content for description
  const plainTextContent = post.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...';

  return {
    title: post.title || `A beautiful ${post.category}`,
    description: plainTextContent,
    openGraph: {
      title: post.title || `A beautiful ${post.category}`,
      description: plainTextContent,
      images: post.mediaUrl ? [{ url: post.mediaUrl }] : [],
    },
  };
}

export default async function PostDetail({ params }) {
  // Await the params before using them as required by Next.js 15+ App Router
  const resolvedParams = await params;
  const posts = await getPosts();
  const post = posts.find(p => p.id === resolvedParams.id);

  if (!post) {
    notFound();
  }

  const postUrl = `/post/${post.id}`;

  return (
    <div className="container py-12">
      <Link href="/" className="btn-outline mb-8 inline-flex items-center gap-2" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', display: 'inline-flex' }}>
        &larr; Back to Home
      </Link>
      
      <article className="glass animate-fade-in" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="flex justify-between items-center mb-6 border-b pb-4" style={{ borderColor: 'var(--border-color)' }}>
          <span style={{ 
            fontSize: '0.875rem', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em',
            color: 'var(--accent-primary)',
            backgroundColor: 'var(--bg-secondary)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)'
          }}>
            {post.category}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {post.title && (
          <h1 className="font-serif mb-6" style={{ fontSize: '2.5rem', lineHeight: 1.2 }}>
            {post.title}
          </h1>
        )}

        {post.mediaUrl && (
          <div className="mb-8">
            <MediaViewer url={post.mediaUrl} type={post.mediaType} alt={post.title} />
          </div>
        )}

        <div 
          className="post-content"
          style={{ 
            fontSize: '1.125rem', 
            lineHeight: 1.8, 
            color: 'var(--text-primary)',
            marginBottom: '3rem'
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="pt-6 flex justify-between items-end" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div>
            <h3 className="font-serif mb-4" style={{ fontSize: '1.25rem' }}>Share this post</h3>
            <ShareButtons title={post.title} text={`Check out this ${post.category} on EmoWords`} url={postUrl} />
          </div>
          <AdminControls postId={post.id} />
        </div>
      </article>
    </div>
  );
}
