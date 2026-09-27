'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import ScrollableRow from '@/components/ScrollableRow';

export default function TrendingRow({ today, week }: { today: any[], week: any[] }) {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day');

  const items = timeWindow === 'day' ? today : week;

  if (!today || today.length === 0) return null;

  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
          Trending
        </h2>
        
        {/* iOS Segmented Control Switch */}
        <div className="ios-segmented-track self-start sm:self-auto">
          <button
            onClick={() => setTimeWindow('day')}
            className={timeWindow === 'day' ? 'ios-segmented-btn-active' : 'ios-segmented-btn-inactive'}
          >
            Today
          </button>
          <button
            onClick={() => setTimeWindow('week')}
            className={timeWindow === 'week' ? 'ios-segmented-btn-active' : 'ios-segmented-btn-inactive'}
          >
            This Week
          </button>
        </div>
      </div>
      
      <ScrollableRow>
        {items.map((item: any) => (
          <div key={item.id} className="poster-row-item">
            <MovieCard movie={item} />
          </div>
        ))}
      </ScrollableRow>
    </div>
  );
}
