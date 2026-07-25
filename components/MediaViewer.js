export default function MediaViewer({ url, type, alt = "Media content" }) {
  if (!url) return null;

  const isVideo = type === 'video' || url.match(/\.(mp4|webm|ogg)$/i);
  const isAudio = type === 'audio' || url.match(/\.(mp3|wav|ogg)$/i);
  const isDocument = type === 'document' || url.match(/\.(pdf|doc|docx|txt)$/i);

  if (isVideo) {
    return (
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '1rem 0' }}>
        <video 
          src={url}
          controls 
          playsInline
          style={{ width: '100%', maxHeight: '500px', backgroundColor: '#000', display: 'block' }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '1rem 0', padding: '1rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
        <h4 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>Audio Track</h4>
        <audio 
          src={url}
          controls 
          style={{ width: '100%', display: 'block' }}
        >
          Your browser does not support the audio tag.
        </audio>
      </div>
    );
  }

  if (isDocument) {
    return (
      <div style={{ borderRadius: 'var(--radius-md)', margin: '1rem 0', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📄</span>
          <div>
            <p style={{ fontWeight: 600, margin: 0 }}>Attached Document</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Click download to view</p>
          </div>
        </div>
        <a href={url} download target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Download
        </a>
      </div>
    );
  }

  return (
    <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '1rem 0' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={url} 
        alt={alt} 
        style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}
