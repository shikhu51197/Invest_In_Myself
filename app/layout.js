import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'EmoWords | Personal Expressions',
  description: 'A beautiful space for my poetry, shayri, songs, sketches, recipes, and thoughts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="ambient-background">
          <div className="ambient-orb orb-1"></div>
          <div className="ambient-orb orb-2"></div>
          <div className="ambient-orb orb-3"></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
