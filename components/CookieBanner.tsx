'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('popcorn-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('popcorn-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-black/95 backdrop-blur-md border-t border-white/10 p-4 md:p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
      <div className="container mx-auto max-w-[1400px] flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8">
        <div className="flex-1 text-sm text-gray-300 text-center sm:text-left leading-relaxed">
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
          By clicking &quot;Accept All&quot;, you consent to our use of cookies as described in our{' '}
          <Link href="/privacy" className="text-white underline hover:text-white/80 font-medium">Privacy Policy</Link>.
        </div>
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button 
            onClick={acceptCookies} 
            className="w-full sm:w-auto bg-white text-black px-8 py-2.5 rounded-full font-semibold text-[14px] hover:bg-white/90 active:scale-95 shadow-[0_4px_16px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200 select-none"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
