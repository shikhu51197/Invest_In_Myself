import Link from 'next/link';
import ShareButtons from './ShareButtons';
import MediaViewer from './MediaViewer';
import AdminControls from './AdminControls';
import { getCategoryEmoji } from '../utils/emojiMap';

export default function PostCard({ post }) {
  const postUrl = `/post/${post.id}`;

  return (
    <div className="glass animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="flex justify-between items-center mb-4">
        <span style={{ 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          color: 'var(--accent-primary)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <span>{getCategoryEmoji(post.category)}</span>
          <span>{post.category}</span>
        </span>
        <span suppressHydrationWarning style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {new Date(post.date).toLocaleDateString()}
        </span>
      </div>
      
      {post.title && (
        <h3 className="font-serif mb-2" style={{ fontSize: '1.25rem' }}>
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h3>
      )}

      {/* Render text content (truncated for card) */}
      {post.content && (
        <div 
          className="post-content-preview"
          style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Render all attached media items (e.g. image + audio soundtrack) directly on card */}
      {(() => {
        const mediaItems = post.mediaList && post.mediaList.length > 0
          ? post.mediaList
          : post.mediaUrl ? [{ url: post.mediaUrl, type: post.mediaType, name: post.title }] : [];
          
        if (mediaItems.length === 0) return null;

        return (
          <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mediaItems.map((media, idx) => (
              <div key={idx}>
                <MediaViewer url={media.url} type={media.type} alt={media.name || `${post.title || "Post"} media`} isCard={true} />
              </div>
            ))}
          </div>
        );
      })()}

      <div className="mt-auto pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border-color)' }}>
        <Link href={`/post/${post.id}`} className="btn-primary text-center" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', fontWeight: 500, width: '100%' }}>
          Read Full Post
        </Link>
        <div className="flex flex-wrap justify-between items-center gap-2">
          <ShareButtons title={post.title || `A beautiful ${post.category}`} text="Check out this post on EmoWords" url={postUrl} />
          <AdminControls postId={post.id} />
        </div>
      </div>
    </div>
  );
}
