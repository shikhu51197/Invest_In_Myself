import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar glass">
      <div className="container flex flex-wrap items-center justify-between py-4 gap-4">
        <Link href="/" className="font-serif gradient-text" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          EmoWords
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/explore" className="btn-outline" style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
            Explore
          </Link>
          <Link href="/upload" className="btn btn-primary">
            + New Post
          </Link>
        </div>
      </div>
    </nav>
  );
}
