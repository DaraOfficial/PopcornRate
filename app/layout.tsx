import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import AmbientBackground from '@/components/AmbientBackground';
import './globals.css';

export const metadata: Metadata = {
  title: 'Popcorn Rate - Movie Reviews & Ratings',
  description: 'Movie ratings, reviews, and streaming provider information powered by TMDB.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark w-full overflow-x-hidden">
      <body className="font-sans min-h-screen w-full max-w-full bg-[#07070b] text-white selection:bg-white/20 selection:text-white antialiased flex flex-col relative overflow-x-hidden" suppressHydrationWarning>
        <AmbientBackground />
        <Navbar />
        
        <div className="flex-1 relative z-10 w-full min-w-0 max-w-full">
          {children}
        </div>

        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
