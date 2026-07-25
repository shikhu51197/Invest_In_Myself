export default function MediaViewer({ url, type, alt = "Media content", isCard = false }) {
  if (!url) return null;

  const urlStr = String(url);
  const isVideo = type === 'video' || urlStr.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) || urlStr.startsWith('data:video/');
  const isAudio = type === 'audio' || urlStr.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i) || urlStr.startsWith('data:audio/');
  const isDocument = type === 'document' || urlStr.match(/\.(pdf|doc|docx|txt)$/i);

  if (isVideo) {
    return (
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '0.5rem 0', width: '100%', height: isCard ? '260px' : 'auto', backgroundColor: '#000' }}>
        <video 
          src={urlStr}
          controls 
          playsInline
          style={{ width: '100%', height: isCard ? '100%' : 'auto', maxHeight: '500px', objectFit: 'cover', backgroundColor: '#000', display: 'block' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '0.5rem 0', padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🎵</span>
          <span style={{ fontWeight: 600, fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--text-primary)' }}>Audio Soundtrack</span>
        </div>
        <audio 
          src={urlStr}
          controls 
          style={{ width: '100%', display: 'block', height: '40px' }}
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  if (isDocument) {
    return (
      <div style={{ borderRadius: 'var(--radius-md)', margin: '0.5rem 0', padding: '1.25rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📄</span>
          <div>
            <p style={{ fontWeight: 600, margin: 0 }}>Attached Document</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Click download to view</p>
          </div>
        </div>
        <a href={urlStr} download target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Download
        </a>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '0.5rem 0', width: '100%', height: isCard ? '260px' : '380px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={urlStr} 
        alt={alt} 
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
