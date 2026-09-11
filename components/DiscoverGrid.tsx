'use client';

import { useState, useEffect, useRef } from 'react';
import MovieCard from './MovieCard';
import { fetchDiscoverMedia } from '@/app/actions';
import { Filter, ChevronDown, Check, Loader2, Play } from 'lucide-react';

const WATCH_PROVIDERS = [
  { id: 8, name: 'Netflix', color: 'hover:bg-[#E50914] hover:text-white hover:border-[#E50914]' },
  { id: 119, name: 'Prime Video', color: 'hover:bg-[#00A8E1] hover:text-white hover:border-[#00A8E1]' },
  { id: 350, name: 'Apple TV', color: 'hover:bg-white hover:text-black hover:border-white' },
  { id: 337, name: 'Disney+', color: 'hover:bg-[#113CCF] hover:text-white hover:border-[#113CCF]' },
  { id: 15, name: 'Hulu', color: 'hover:bg-[#1CE783] hover:text-black hover:border-[#1CE783]' },
  { id: 1899, name: 'Max', color: 'hover:bg-[#002BE7] hover:text-white hover:border-[#002BE7]' },
  { id: 531, name: 'Paramount+', color: 'hover:bg-[#0064FF] hover:text-white hover:border-[#0064FF]' },
  { id: 386, name: 'Peacock', color: 'hover:bg-[#ffffff] hover:text-black hover:border-white' }
];

const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'Most Popular' },
  { id: 'vote_average.desc', label: 'Highest Rated' },
  { id: 'primary_release_date.desc', label: 'Newest Releases' }
];

export default function DiscoverGrid({ 
  type, 
  initialData, 
  title 
}: { 
  type: 'movie' | 'tv', 
  initialData: any,
  title: string 
}) {
  const [items, setItems] = useState(initialData?.results || []);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialData?.total_pages || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isAutoLoadEnabled, setIsAutoLoadEnabled] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  // Filters
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  
  const isFirstRender = useRef(true);

  const loadData = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      const params: any = {
        page: pageNum,
        sort_by: sortBy,
        watch_region: 'US',
        'vote_count.gte': 100 // To filter out obscure stuff when sorting by rating
      };

      if (selectedProviders.length > 0) {
        params.with_watch_providers = selectedProviders.join('|');
      }

      const data = await fetchDiscoverMedia(type, params);
      
      if (pageNum === 1) {
        setItems(data.results || []);
      } else {
        setItems((prev: any) => [...prev, ...(data.results || [])]);
      }
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const toggleProvider = (id: number) => {
    setSelectedProviders(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    setPage(1);
    setIsAutoLoadEnabled(false);
    loadData(1);
  }, [sortBy, selectedProviders]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && isAutoLoadEnabled && !isLoadingMore && page < totalPages) {
          loadMore();
        }
      },
      { rootMargin: '600px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isAutoLoadEnabled, isLoadingMore, page, totalPages, sortBy, selectedProviders]);

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-[1400px] py-24 md:py-32">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-10">{title}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Sort & Filter
            </h2>
            
            <div className="mb-8">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Sort By</h3>
              <div className="space-y-2">
                {SORT_OPTIONS.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 text-sm active:scale-[0.98] ${
                      sortBy === option.id 
                        ? 'bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.2)]' 
                        : 'bg-[#161618]/70 text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] font-medium'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Streaming Network</h3>
              <div className="flex flex-wrap gap-2">
                {WATCH_PROVIDERS.map(provider => {
                  const isSelected = selectedProviders.includes(provider.id);
                  return (
                    <button
                      key={provider.id}
                      onClick={() => toggleProvider(provider.id)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 active:scale-95 ${
                        isSelected 
                          ? `bg-white text-black shadow-[0_2px_10px_rgba(255,255,255,0.25)] font-semibold` 
                          : `bg-[#161618]/70 text-white/70 border border-white/[0.12] hover:bg-white/[0.08] hover:text-white ${provider.color}`
                      }`}
                    >
                      {provider.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 w-full min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-white/50" />
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {items.map((item: any, i: number) => (
                  <MovieCard key={`${item.id}-${i}`} movie={item} />
                ))}
              </div>
              
              {page < totalPages && (
                <div ref={observerTarget} className="mt-12 flex justify-center pb-8">
                  {!isAutoLoadEnabled ? (
                    <button
                      onClick={() => { setIsAutoLoadEnabled(true); loadMore(); }}
                      disabled={isLoadingMore}
                      className="bg-[#161618]/70 hover:bg-white/[0.12] text-white border border-white/[0.18] shadow-[0_4px_20px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] px-8 py-3 rounded-full font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 flex items-center gap-2 backdrop-blur-2xl select-none"
                    >
                      {isLoadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Load More'}
                    </button>
                  ) : isLoadingMore ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                  ) : <div className="h-12" />}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-xl text-white/70">No results found matching your filters.</p>
              <button 
                onClick={() => { setSortBy('popularity.desc'); setSelectedProviders([]); }}
                className="mt-6 inline-flex items-center px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium active:scale-95 transition-all"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
