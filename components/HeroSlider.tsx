'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import PopcornRating from './PopcornRating';

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
  10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
};

export default function HeroSlider({ items }: { items: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) return;
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % Math.min(5, items.length));
    }, 6000); // 6 seconds per slide

    return () => clearInterval(interval);
  }, [items, isPaused, currentIndex]);

  if (!items || items.length === 0) return null;

  const displayItems = items.slice(0, 5); // Max 5 items in slider

  return (
    <div 
      className="relative w-full overflow-hidden bg-black h-[75vh] min-h-[500px] md:h-[95vh] xl:h-[100vh] md:min-h-[600px] group shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes sliderProgress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes kenBurns {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
      
      {displayItems.map((item, index) => {
        const isActive = index === currentIndex;
        const title = item.title || item.name;
        const type = item.media_type || (item.name ? 'tv' : 'movie');
        const overview = item.overview;
        
        const rating = item.vote_average ? item.vote_average.toFixed(1) : 'NR';
        const dateStr = item.release_date || item.first_air_date;
        let formattedDate = '';
        if (dateStr) {
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            if (!isNaN(date.getTime())) {
              formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
          } else {
            formattedDate = dateStr;
          }
        }
        
        let itemGenres = [];
        if (item.genre_ids) {
          itemGenres = item.genre_ids.map((id: number) => GENRE_MAP[id]).filter(Boolean).slice(0, 2);
        }
        
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Image with Ken Burns effect */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                animationName: isActive ? 'kenBurns' : 'none',
                animationDuration: '10s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationPlayState: isPaused ? 'paused' : 'running'
              }}
            >
              <Image
                src={getImageUrl(item.backdrop_path, 'original')}
                alt={title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                priority={index === 0}
              />
            </div>

            {/* Top gradient to ensure fixed navbar text is always legible */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />

            {/* Bottom gradient to seamlessly merge with the black page background */}
            <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

            {/* Left gradient for text readability */}
            <div className="absolute inset-0 w-full md:w-2/3 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-end px-4 sm:px-8 md:px-12 lg:px-[max(5%,calc((100vw-1400px)/2+32px))] pb-20 md:pb-24 w-full md:w-3/4 lg:w-2/3 pointer-events-none">
              <div
                className={`transition-all duration-1000 transform pointer-events-auto ${
                  isActive ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-8 opacity-0'
                }`}
              >
                {/* Title or Logo */}
                {item.logo_path ? (
                  <div className="relative w-48 sm:w-64 md:w-80 h-16 sm:h-20 md:h-28 mb-2 sm:mb-3 drop-shadow-lg">
                    <Image
                      src={getImageUrl(item.logo_path, 'original')}
                      alt={title}
                      fill
                      className="object-contain object-left-bottom"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-2 line-clamp-2 drop-shadow-lg leading-tight">
                    {title}
                  </h2>
                )}

                {/* Meta details (Rating • Date • Genres) */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mb-4 sm:mb-6 text-[12px] sm:text-[14px] md:text-[15px] font-medium text-white/90 drop-shadow-md">
                  <PopcornRating rating={item.vote_average} compact className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  {formattedDate && <span className="text-white/60">•</span>}
                  {formattedDate && <span>{formattedDate}</span>}
                  {itemGenres.map((genre: string) => (
                    <span key={genre} className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                      <span className="text-white/60">•</span>
                      <span>{genre}</span>
                    </span>
                  ))}
                </div>

                {/* Overview */}
                <p className="text-white/80 text-[13px] sm:text-sm md:text-lg line-clamp-3 mb-6 sm:mb-8 max-w-xl text-shadow-sm font-medium leading-relaxed">
                  {overview}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 select-none">
                  <Link
                    href={`/${type}/${item.id}`}
                    className="flex items-center justify-center gap-2 bg-white text-black px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3.5 rounded-full font-semibold text-[14px] sm:text-[15px] shadow-[0_4px_16px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-white/95 active:scale-95 transition-all duration-200 ease-out flex-1 sm:flex-none"
                  >
                    <Play className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 fill-current" />
                    Watch Now
                  </Link>
                  <Link
                    href={`/${type}/${item.id}`}
                    className="flex items-center justify-center gap-2 bg-[#161618]/70 text-white backdrop-blur-2xl border border-white/[0.18] shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] px-5 py-2.5 sm:px-6 sm:py-3 md:px-7 md:py-3.5 rounded-full font-medium text-[14px] sm:text-[15px] hover:bg-white/[0.12] hover:border-white/30 active:scale-95 transition-all duration-200 ease-out flex-1 sm:flex-none"
                  >
                    <Info className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Modern Animated Pagination Indicators (Apple TV / Netflix style) */}
      <div className="absolute bottom-6 md:bottom-10 right-4 sm:right-8 md:right-12 lg:right-[max(3rem,calc((100vw-1400px)/2+48px))] z-20 flex justify-end gap-2.5 pointer-events-none">
        {displayItems.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative overflow-hidden transition-all duration-500 rounded-full h-1.5 md:h-2 pointer-events-auto bg-white/20 hover:bg-white/40 backdrop-blur-md ${
                isActive ? 'w-10 sm:w-12 md:w-16' : 'w-2 md:w-2.5'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {isActive && (
                <div 
                  className="absolute inset-0 bg-white origin-left"
                  style={{
                    animationName: 'sliderProgress',
                    animationDuration: '6000ms',
                    animationTimingFunction: 'linear',
                    animationFillMode: 'forwards',
                    animationPlayState: isPaused ? 'paused' : 'running'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
