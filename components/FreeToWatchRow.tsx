'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import ScrollableRow from '@/components/ScrollableRow';

export default function FreeToWatchRow({ 
  movies, 
  tv 
}: { 
  movies: any[], 
  tv: any[] 
}) {
  type TabType = 'movies' | 'tv';
  const [activeTab, setActiveTab] = useState<TabType>('movies');

  const items = activeTab === 'movies' ? movies : tv;

  if (!items || (movies.length === 0 && tv.length === 0)) return null;

  const tabs = [
    { id: 'movies', label: 'Movies' },
    { id: 'tv', label: 'TV' }
  ];

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
          Free To Watch
        </h2>
        
        {/* iOS Segmented Control Switch */}
        <div className="inline-flex items-center rounded-full border border-white/[0.15] p-1 bg-[#161618]/70 backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full gap-0.5 select-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 sm:px-5 py-1.5 text-[13px] sm:text-[13.5px] -tracking-[0.01em] rounded-full transition-all duration-200 ease-out whitespace-nowrap active:scale-95 ${
                activeTab === tab.id 
                  ? 'bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)]'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.06] font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <ScrollableRow>
        {items.map((item: any) => (
          <div key={item.id} className="snap-start shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[220px]">
            <MovieCard movie={item} />
          </div>
        ))}
      </ScrollableRow>
    </div>
  );
}
