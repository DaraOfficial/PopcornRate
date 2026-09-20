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
        <div className="ios-segmented-track self-start sm:self-auto overflow-x-auto hide-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={activeTab === tab.id ? 'ios-segmented-btn-active' : 'ios-segmented-btn-inactive'}
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
