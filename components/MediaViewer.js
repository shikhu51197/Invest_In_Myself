export default function MediaViewer({ url, type, alt = "Media content" }) {
  if (!url) return null;

  const isVideo = type === 'video' || url.match(/\.(mp4|webm|ogg)$/i);

  if (isVideo) {
    return (
      <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', margin: '1rem 0' }}>
        <video 
          controls 
          style={{ width: '100%', maxHeight: '500px', backgroundColor: '#000', display: 'block' }}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
