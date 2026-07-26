'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MediaViewer from './MediaViewer';
import { getCategoryEmoji } from '../utils/emojiMap';

export default function PostCard({ post, onQuickLook, isBookmarked = false, onToggleBookmark }) {
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isAnimateHeart, setIsAnimateHeart] = useState(false);

  useEffect(() => {
    // Deterministic base like score from post title/id + persistent local increments
    const baseLikes = Math.abs(String(post.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 85 + 12;
    const savedLikes = localStorage.getItem(`emowords-likes-count-${post.id}`);
    const likedStatus = localStorage.getItem(`emowords-liked-${post.id}`) === 'true';
    
    setLikes(savedLikes ? parseInt(savedLikes, 10) : baseLikes);
    setHasLiked(likedStatus);
  }, [post.id]);

  const handleLike = (e) => {
    e.stopPropagation();
    const nextLiked = !hasLiked;
    const nextCount = nextLiked ? likes + 1 : Math.max(0, likes - 1);
    
    setHasLiked(nextLiked);
    setLikes(nextCount);
    setIsAnimateHeart(true);
    setTimeout(() => setIsAnimateHeart(false), 450);

    localStorage.setItem(`emowords-liked-${post.id}`, String(nextLiked));
    localStorage.setItem(`emowords-likes-count-${post.id}`, String(nextCount));
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    if (onToggleBookmark) {
      onToggleBookmark(post);
    }
  };

  const hasAudio = post.category === 'Songs' || post.mediaType === 'audio';
  const displayMedia = post.mediaUrl || (post.mediaList && post.mediaList.length > 0 ? post.mediaList[0].url : null);
  const displayMediaType = post.mediaType || (post.mediaList && post.mediaList.length > 0 ? post.mediaList[0].type : null);

  return (
    <div 
      className="glass-card flex flex-col" 
      style={{ 
        padding: '2rem', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        borderRadius: 'var(--radius-xl)'
      }}
    >
      {/* Upper Card Region */}
      <div>
        {/* Category Header Bar & Engagement Icons */}
        <div className="flex justify-between items-center mb-5" style={{ minHeight: '34px' }}>
          <span style={{ 
            fontSize: '0.78rem', 
            fontWeight: 700, 
            textTransform: 'uppercase', 
            letterSpacing: '0.07em',
            color: 'var(--accent-primary)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            lineHeight: 1
          }}>
            <span style={{ fontSize: '1.15rem' }}>{getCategoryEmoji(post.category)}</span>
            <span>{post.category}</span>
            {hasAudio && (
              <span className="soundwave-container" title="Audio Soundtrack Included" style={{ marginLeft: '0.2rem' }}>
                <span className="soundwave-bar"></span>
                <span className="soundwave-bar"></span>
                <span className="soundwave-bar"></span>
                <span className="soundwave-bar"></span>
              </span>
            )}
          </span>

          {/* Interactive Bookmark Pocket & Date */}
          <div className="flex items-center gap-3">
            <span suppressHydrationWarning style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={handleBookmarkClick}
              style={{
                background: isBookmarked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.04)',
                border: '1px solid',
                borderColor: isBookmarked ? 'var(--accent-primary)' : 'var(--border-color)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: isBookmarked ? 'white' : 'var(--text-secondary)',
                boxShadow: isBookmarked ? '0 0 14px var(--accent-glow)' : 'none'
              }}
              title={isBookmarked ? "Remove from bookmarks" : "Bookmark this post"}
            >
              <span style={{ fontSize: '0.95rem', lineHeight: 1 }}>{isBookmarked ? '🔖' : '📑'}</span>
            </button>
          </div>
        </div>

        {/* Post Title */}
        {post.title && (
          <h2 
            className="font-display mb-4" 
            style={{ 
              fontSize: '1.45rem', 
              fontWeight: 800, 
              letterSpacing: '-0.025em',
              lineHeight: 1.3,
              color: 'var(--text-primary)' 
            }}
          >
            <Link href={`/post/${post.id}`} prefetch={false} style={{ textDecoration: 'none', transition: 'color 0.2s ease' }} className="hover:text-accent-primary">
              {post.title}
            </Link>
          </h2>
        )}

        {/* Visual Aspect Media */}
        {displayMedia && (
          <div className="mb-5">
            <MediaViewer url={displayMedia} type={displayMediaType} alt={post.title} isCard={true} />
          </div>
        )}

        {/* Truncated Preview Text (Cleaned of third-party network blocking iframes) */}
        {post.content && (
          <div 
            className="post-content-preview"
            style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.95rem',
              lineHeight: 1.7
            }}
            dangerouslySetInnerHTML={{ __html: post.content.replace(/<iframe[\s\S]*?<\/iframe>/gi, '') }}
          />
        )}
      </div>

      {/* Footer Controls Alignment Layer (Guaranteed Equal Bottom Baseline) */}
      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Interactive Like Counter with equalized 38px baseline height */}
        <button
          onClick={handleLike}
          style={{
            height: '38px',
            background: hasLiked ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255,255,255,0.04)',
            border: '1px solid',
            borderColor: hasLiked ? 'var(--accent-secondary)' : 'var(--border-color)',
            padding: '0 1rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            color: hasLiked ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.86rem',
            fontFamily: 'var(--font-display)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.45rem',
            userSelect: 'none'
          }}
        >
          <span className={isAnimateHeart ? 'animate-heart' : ''} style={{ fontSize: '1.15rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
            {hasLiked ? '❤️' : '🤍'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>{likes}</span>
        </button>

        {/* Navigation Actions (Quick Look & Full Page) with matched baseline symmetry */}
        <div className="flex items-center" style={{ gap: '0.6rem' }}>
          {onQuickLook && (
            <button
              onClick={() => onQuickLook(post)}
              className="btn-outline"
              style={{ 
                height: '38px', 
                padding: '0 1.15rem', 
                fontSize: '0.84rem', 
                fontWeight: 700, 
                fontFamily: 'var(--font-display)',
                borderRadius: 'var(--radius-full)', 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              title="Quick Look Modal Preview"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem', lineHeight: 1 }}>⚡</span>
              <span className="hidden sm:inline" style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Quick Look</span>
            </button>
          )}
          <Link 
            href={`/post/${post.id}`} 
            prefetch={false}
            className="btn btn-primary" 
            style={{ 
              height: '38px', 
              padding: '0 1.35rem', 
              fontSize: '0.84rem', 
              fontWeight: 700, 
              fontFamily: 'var(--font-display)',
              borderRadius: 'var(--radius-full)', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              userSelect: 'none'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1 }}>Explore</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', lineHeight: 1 }}>↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
