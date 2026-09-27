'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ScrollableRow from '@/components/ScrollableRow';
import { Play, X } from 'lucide-react';
import { getImageUrl } from '@/lib/tmdb';
import { fetchTrailerVideo } from '@/app/actions';
import { setAmbientBackdrop } from './AmbientBackground';

export default function LatestTrailersRow({ popular, inTheaters }: { popular: any[], inTheaters: any[] }) {
  type TabType = 'popular' | 'inTheaters';
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // State for the video player modal
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Close modal on Escape key & lock body scroll
  useEffect(() => {
    if (!playingVideoId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPlayingVideoId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [playingVideoId]);

  const getActiveItems = () => {
    switch (activeTab) {
      case 'popular': return popular;
      case 'inTheaters': return inTheaters;
      default: return popular;
    }
  };

  const activeItems = getActiveItems();
  const trailerItems = activeItems?.filter(item => item && item.backdrop_path).slice(0, 15) || [];

  const handlePlayTrailer = async (item: any) => {
    if (!item || !item.id) return;
    try {
      setLoadingItemId(item.id);
      setVideoError(null);
      const type = item.media_type || (item.name ? 'tv' : 'movie');
      const data = await fetchTrailerVideo(item.id, type);
      
      const videos = data?.results || [];
      // Prefer official trailers on YouTube
      const trailer = videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.official && v.key) 
                   || videos.find((v: any) => v.site === 'YouTube' && v.type === 'Trailer' && v.key)
                   || videos.find((v: any) => v.site === 'YouTube' && v.key);
                   
      if (trailer && trailer.key) {
        setPlayingVideoId(trailer.key);
      } else {
        setVideoError('No trailer available for this title.');
        setTimeout(() => setVideoError(null), 3500);
      }
    } catch {
      setVideoError('Failed to load trailer.');
      setTimeout(() => setVideoError(null), 3500);
    } finally {
      setLoadingItemId(null);
    }
  };

  if (trailerItems.length === 0) return null;

  return (
    <div className="relative -mx-4 md:-mx-8 px-4 md:px-8 py-8 transition-colors duration-500 overflow-hidden rounded-3xl">
      {/* Dynamic Hovered Backdrop Glow (only renders active hovered item for web performance, no opaque black box) */}
      <div className="absolute inset-0 z-0 pointer-events-none [mask-image:radial-gradient(ellipse_85%_80%_at_50%_50%,black_35%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_85%_80%_at_50%_50%,black_35%,transparent_100%)]">
        {hoveredIndex !== null && trailerItems[hoveredIndex] && (
          <div className="absolute inset-0 transition-opacity duration-500 ease-out opacity-100">
            <Image 
              src={getImageUrl(trailerItems[hoveredIndex].backdrop_path, 'w780')}
              alt={trailerItems[hoveredIndex].title || trailerItems[hoveredIndex].name || 'Trailer Background'}
              fill
              sizes="(max-width: 1024px) 100vw, 1200px"
              className="object-cover opacity-35 blur-md saturate-150 scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            Latest Trailers
          </h2>
          
          {/* iOS Segmented Control Switch */}
          <div className="ios-segmented-track self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
            {[
              { id: 'popular', label: 'Popular' },
              { id: 'inTheaters', label: 'In Theaters' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as TabType); setHoveredIndex(null); }}
                className={activeTab === tab.id ? 'ios-segmented-btn-active' : 'ios-segmented-btn-inactive'}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <ScrollableRow className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 custom-scrollbar">
          {trailerItems.map((item: any, index: number) => (
            <div 
              key={item.id} 
              className="snap-start shrink-0 w-[240px] min-[380px]:w-[280px] sm:w-[320px] md:w-[350px] lg:w-[380px] group cursor-pointer select-none"
              onMouseEnter={() => {
                setHoveredIndex(index);
                if (item.backdrop_path) setAmbientBackdrop(item.backdrop_path);
              }}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handlePlayTrailer(item)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 shadow-[0_8px_20px_rgba(0,0,0,0.4)] group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={getImageUrl(item.backdrop_path, 'w500')}
                  alt={item.title || item.name || 'Movie Trailer'}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/[0.14] bg-gradient-to-br from-white/[0.26] to-white/[0.06] border border-white/30 rounded-full flex items-center justify-center backdrop-blur-xl backdrop-saturate-[1.9] shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.5)] group-hover:scale-110 group-hover:bg-white/[0.22] transition-all">
                    {loadingItemId === item.id ? (
                      <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center px-2">
                <h3 className="text-white font-bold text-base md:text-lg line-clamp-1 drop-shadow-md">
                  {item.title || item.name}
                </h3>
                <p className="text-white/70 text-sm drop-shadow-sm">Official Trailer</p>
              </div>
            </div>
          ))}
        </ScrollableRow>
      </div>
      {/* Video Error Message overlay */}
      {videoError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-5 py-2.5 rounded-full shadow-2xl z-[110] backdrop-blur-md text-sm font-medium border border-red-500/30 animate-in fade-in slide-in-from-bottom-4">
          {videoError}
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideoId && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setPlayingVideoId(null)}
        >
          <div 
            className="w-full max-w-5xl aspect-video relative bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setPlayingVideoId(null)}
              className="absolute top-4 right-4 z-10 ios-btn-circle"
              aria-label="Close trailer modal"
            >
              <X className="w-5 h-5" strokeWidth={2.2} />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1&rel=0&showinfo=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

