import './globals.css';
import { Inter, Playfair_Display, Outfit } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Optimize fonts at build time for zero external network requests and instant rendering
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata = {
  title: 'EmoWords | Personal Expressions & Tech Architecture',
  description: 'A beautiful digital space for full-stack software architecture, generative AI soundtracks, poetry, and creative expression.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${outfit.variable}`}>
      <body>
        <div className="ambient-background">
          <div className="ambient-orb orb-1"></div>
          <div className="ambient-orb orb-2"></div>
          <div className="ambient-orb orb-3"></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
