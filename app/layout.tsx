import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import CookieBanner from '@/components/CookieBanner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Popcorn Rate - Movie Reviews & Ratings',
  description: 'Movie ratings, reviews, and streaming provider information powered by TMDB.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans min-h-screen bg-black text-white selection:bg-white/20 selection:text-white antialiased flex flex-col" suppressHydrationWarning>
        <Navbar />
        
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-black py-8 md:py-12 mt-auto">
          <div className="container mx-auto px-4 md:px-8 max-w-[1400px] flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 font-medium">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p>Copyright © {new Date().getFullYear()} Popcorn Rate. All rights reserved.</p>
              <div className="flex items-center gap-3 mt-1">
                <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" alt="TMDB Logo" className="h-3 md:h-4 opacity-70" />
                <p className="text-gray-500 max-w-xs text-center md:text-left text-[11px] leading-tight">
                  This product uses the TMDB API but is not endorsed or certified by TMDB.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </footer>
        
        <CookieBanner />
      </body>
    </html>
  );
}
