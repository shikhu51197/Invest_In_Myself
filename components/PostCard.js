'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ShareButtons from './ShareButtons';
import MediaViewer from './MediaViewer';
import AdminControls from './AdminControls';
import { getCategoryEmoji } from '../utils/emojiMap';

export default function PostCard({ post, onOpenQuickLook, onBookmarkToggle }) {
  const postUrl = `/post/${post.id}`;
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

  useEffect(() => {
    // Load persisted Likes & Bookmarks for tactile client engagement
    const storedLikes = localStorage.getItem(`emowords-like-${post.id}`);
    if (storedLikes) {
      setLikeCount(parseInt(storedLikes, 10) || 0);
      setIsLiked(true);
    } else {
      // Seed a pleasant random starting count based on post.id so metrics look lively & engaging!
      const seed = Math.abs((post.id || '1').split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 45 + 5;
      setLikeCount(seed);
    }

    const storedBookmarks = JSON.parse(localStorage.getItem('emowords-bookmarks') || '[]');
    setIsBookmarked(storedBookmarks.includes(post.id));
  }, [post.id]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newCount = isLiked ? likeCount + 1 : likeCount + 1;
    setLikeCount(newCount);
    setIsLiked(true);
    setAnimateHeart(true);
    localStorage.setItem(`emowords-like-${post.id}`, newCount.toString());
    setTimeout(() => setAnimateHeart(false), 600);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const storedBookmarks = JSON.parse(localStorage.getItem('emowords-bookmarks') || '[]');
    let updated;
    if (isBookmarked) {
      updated = storedBookmarks.filter(id => id !== post.id);
      setIsBookmarked(false);
    } else {
      updated = [...storedBookmarks, post.id];
      setIsBookmarked(true);
    }
    localStorage.setItem('emowords-bookmarks', JSON.stringify(updated));
    if (onBookmarkToggle) {
      onBookmarkToggle(post.id, !isBookmarked);
    }
  };

  const isAudioPost = post.category === 'Songs' || post.mediaType === 'audio' || 
    (post.mediaList && post.mediaList.some(m => m.type === 'audio' || (m.url && m.url.match(/\.(mp3|wav|ogg)$/i))));

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Card Header: Category Badge + Audio Indicator + Date */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span style={{ 
            fontSize: '0.74rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em',
            color: 'var(--text-primary)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            padding: '0.3rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <span>{getCategoryEmoji(post.category)}</span>
            <span>{post.category}</span>
          </span>

          {/* Animated Soundwave indicator for acoustic AI songs & music */}
          {isAudioPost && (
            <div className="soundwave-container" title="Audio Soundtrack Included">
              <span className="soundwave-bar"></span>
              <span className="soundwave-bar"></span>
              <span className="soundwave-bar"></span>
              <span className="soundwave-bar"></span>
            </div>
          )}
        </div>

        <span suppressHydrationWarning style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      
      {/* Title */}
      {post.title && (
        <h3 className="font-display mb-3" style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.3 }}>
          <Link href={`/post/${post.id}`} className="hover:text-primary transition" style={{ textDecoration: 'none' }}>
            {post.title}
          </Link>
        </h3>
      )}

      {/* Media Attachments */}
      {(() => {
        const mediaItems = post.mediaList && post.mediaList.length > 0
          ? post.mediaList
          : post.mediaUrl ? [{ url: post.mediaUrl, type: post.mediaType, name: post.title }] : [];
          
        if (mediaItems.length === 0) return null;

        return (
          <div style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {mediaItems.map((media, idx) => (
              <div key={idx}>
                <MediaViewer url={media.url} type={media.type} alt={media.name || `${post.title || "Post"} media`} isCard={true} />
              </div>
            ))}
          </div>
        );
      })()}

      {/* Truncated Rich Text Preview */}
      {post.content && (
        <div 
          className="post-content-preview"
          style={{ 
            color: 'var(--text-secondary)', 
            marginBottom: '1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.96rem',
            lineHeight: 1.7,
            flexGrow: 1
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Interactive Engagement Tier (Likes, Bookmarks, Quick Look) */}
      <div className="mt-auto pt-4 flex flex-col gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
        
        {/* Row 1: Tactile Reactions & Bookmarking */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Animated Like Reaction Button */}
            <button
              onClick={handleLike}
              className={`btn-outline ${animateHeart ? 'animate-heart' : ''}`}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: isLiked ? 'rgba(236, 72, 153, 0.15)' : 'transparent',
                borderColor: isLiked ? '#ec4899' : 'var(--border-color)',
                color: isLiked ? '#ec4899' : 'var(--text-secondary)',
                fontWeight: 600
              }}
              title="Give Love"
            >
              <span>{isLiked ? '❤️' : '🤍'}</span>
              <span>{likeCount}</span>
            </button>

            {/* Bookmark Toggle Button */}
            <button
              onClick={handleBookmark}
              className="btn-outline"
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: isBookmarked ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                borderColor: isBookmarked ? '#f59e0b' : 'var(--border-color)',
                color: isBookmarked ? '#f59e0b' : 'var(--text-secondary)',
                fontWeight: 600
              }}
              title={isBookmarked ? 'Remove from Bookmarks' : 'Save to Pocket Shelf'}
            >
              <span>{isBookmarked ? '🔖' : '📑'}</span>
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Quick Look Drawer Button */}
          {onOpenQuickLook && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenQuickLook(post); }}
              className="btn-outline"
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                borderColor: 'var(--glass-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              title="Quick preview without leaving page"
            >
              <span>⚡</span>
              <span>Quick Look</span>
            </button>
          )}
        </div>

        {/* Row 2: Read Full Post & Admin Options */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-2" style={{ borderTop: '1px dashed var(--border-color)' }}>
          <Link 
            href={`/post/${post.id}`} 
            className="btn btn-primary text-center" 
            style={{ 
              padding: '0.55rem 1.4rem', 
              borderRadius: 'var(--radius-full)', 
              fontSize: '0.88rem', 
              fontWeight: 600, 
              flexGrow: 1, 
              textDecoration: 'none', 
              textAlign: 'center' 
            }}
          >
            Read Full Post ↗
          </Link>
          
          <div className="flex items-center gap-2">
            <ShareButtons title={post.title || `A beautiful ${post.category}`} text="Check out this post on EmoWords" url={postUrl} />
            <AdminControls postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
