'use client';

import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

export default function PlayTrailerButton({ videos, className }: { videos: any[], className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!videos || !Array.isArray(videos)) return null;

  // Find best trailer
  const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official && v.key) 
               || videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.key)
               || videos.find((v: any) => v.site === 'YouTube' && v.key);

  if (!trailer || !trailer.key) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={className || "ios-btn-glass w-full sm:w-auto"}
      >
        <Play className="w-[18px] h-[18px] md:w-5 md:h-5 fill-current" />
        Play Trailer
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-5xl aspect-video relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/[0.15]"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 ios-btn-circle"
              aria-label="Close trailer modal"
            >
              <X className="w-5 h-5" strokeWidth={2.2} />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

