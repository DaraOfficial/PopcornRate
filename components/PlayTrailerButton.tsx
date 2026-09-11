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
        className={className || "flex items-center gap-2.5 text-white bg-[#161618]/70 hover:bg-white/[0.12] active:scale-95 border border-white/[0.18] shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] py-2.5 px-5 rounded-full backdrop-blur-2xl transition-all duration-200 ease-out font-semibold text-sm md:text-base select-none"}
      >
        <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
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
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#161618]/80 hover:bg-white/[0.15] border border-white/[0.18] rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-90"
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

