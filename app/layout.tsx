import type { Metadata, Viewport } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
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
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans min-h-screen bg-black text-white selection:bg-white/20 selection:text-white antialiased flex flex-col" suppressHydrationWarning>
        <Navbar />
        
        <div className="flex-1">
          {children}
        </div>

        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
