'use client';
import { useState, useEffect } from 'react';

export default function ShareButtons({ title, text, url }) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    if (url.startsWith('http')) {
      setFullUrl(url);
    } else {
      setFullUrl(window.location.origin + url);
    }
  }, [url]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: fullUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!fullUrl) return null; // Wait for hydration

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedText = encodeURIComponent(`${title} - ${text}`);

  return (
    <div className="flex gap-2 items-center mt-4">
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Share:</span>
      <button onClick={handleShare} className="btn-outline" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }} title="Native Share">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
      </button>
      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }} title="Share on Twitter">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
      </a>
      <a href={`https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }} title="Share on WhatsApp">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>
      <button onClick={handleCopy} className="btn-outline" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }} title="Copy Link">
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        )}
      </button>
    </div>
  );
}
