export default function MediaViewer({ url, type, alt = "Media content", isCard = false }) {
  if (!url) return null;

  const urlStr = String(url);
  const isVideo = type === 'video' || urlStr.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) || urlStr.startsWith('data:video/');
  const isAudio = type === 'audio' || urlStr.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i) || urlStr.startsWith('data:audio/');
  const isDocument = type === 'document' || urlStr.match(/\.(pdf|doc|docx|txt)$/i);

  if (isVideo) {
    return (
      <div 
        style={{ 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden', 
          margin: '0.5rem 0', 
          width: '100%', 
          aspectRatio: isCard ? '16 / 10' : '16 / 9', 
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)'
        }}
      >
        <video 
          src={urlStr}
          controls 
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: 'var(--bg-tertiary)', display: 'block' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div 
        style={{ 
          borderRadius: 'var(--radius-lg)', 
          overflow: 'hidden', 
          margin: '0.5rem 0', 
          padding: '0.85rem 1.25rem', 
          backgroundColor: 'rgba(255,255,255,0.03)', 
          border: '1px solid var(--border-hover)', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.2), 0 0 15px var(--accent-glow)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🎵</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '0.92rem', color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
              Acoustic AI Soundtrack
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-gradient)', color: 'white', fontWeight: 700, letterSpacing: '0.05em' }}>
            LOSSLESS
          </span>
        </div>
        <audio 
          src={urlStr}
          controls
          preload="metadata"
          style={{ width: '100%', display: 'block', height: '40px', borderRadius: 'var(--radius-sm)' }}
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  if (isDocument) {
    return (
      <div 
        style={{ 
          borderRadius: 'var(--radius-lg)', 
          margin: '0.5rem 0', 
          padding: '1.25rem 1.5rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.03)', 
          border: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '1.75rem' }}>📄</span>
          <div>
            <p style={{ fontWeight: 700, margin: 0, fontSize: '0.96rem', color: 'var(--text-primary)' }}>Attached Executive Document</p>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: '0.1rem 0 0' }}>Ready for secure offline download</p>
          </div>
        </div>
        <a href={urlStr} download target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ height: '38px', padding: '0 1.2rem', fontSize: '0.84rem' }}>
          Download ↗
        </a>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        borderRadius: 'var(--radius-lg)', 
        overflow: 'hidden', 
        margin: '0.25rem 0 0.5rem 0', 
        width: '100%', 
        aspectRatio: isCard ? '16 / 10' : '16 / 10', 
        maxHeight: isCard ? 'none' : '480px',
        backgroundColor: 'var(--bg-tertiary)', 
        border: '1px solid var(--border-color)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)'
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={urlStr} 
        alt={alt} 
        loading="lazy"
        decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </div>
  );
}
