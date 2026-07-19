export default function Footer() {
  return (
    <footer className="footer py-8 mt-16">
      <div className="container text-center">
        <h3 className="font-serif gradient-text mb-4">EmoWords</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          A personal space for poetry, shayri, thoughts, and everything in between.
        </p>
        <div className="mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} EmoWords. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
