'use client';

import { useState, useEffect, useRef } from 'react';
import MovieCard from './MovieCard';
import { fetchDiscoverMedia } from '@/app/actions';
import { ChevronDown, Check, Loader2, Dices } from 'lucide-react';

const WATCH_PROVIDERS = [
  { id: 8, name: 'Netflix' },
  { id: 119, name: 'Prime Video' },
  { id: 350, name: 'Apple TV' },
  { id: 337, name: 'Disney+' },
  { id: 15, name: 'Hulu' },
  { id: 1899, name: 'Max' },
  { id: 531, name: 'Paramount+' },
  { id: 386, name: 'Peacock' }
];

const SORT_OPTIONS = [
  { id: 'popularity.desc', label: 'Popular' },
  { id: 'vote_average.desc', label: 'Highest Rated' },
  { id: 'primary_release_date.desc', label: 'Newest Releases' }
];

const MOVIE_GENRES = [
  { id: '', label: 'All Genres' },
  { id: '28', label: 'Action' },
  { id: '12', label: 'Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '10751', label: 'Family' },
  { id: '14', label: 'Fantasy' },
  { id: '36', label: 'History' },
  { id: '27', label: 'Horror' },
  { id: '10402', label: 'Music' },
  { id: '9648', label: 'Mystery' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Sci-Fi' },
  { id: '53', label: 'Thriller' },
  { id: '10752', label: 'War' },
  { id: '37', label: 'Western' }
];

const TV_GENRES = [
  { id: '', label: 'All Genres' },
  { id: '10759', label: 'Action & Adv' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '10751', label: 'Family' },
  { id: '10762', label: 'Kids' },
  { id: '9648', label: 'Mystery' },
  { id: '10763', label: 'News' },
  { id: '10764', label: 'Reality' },
  { id: '10765', label: 'Sci-Fi' },
  { id: '10766', label: 'Soap' },
  { id: '10767', label: 'Talk' },
  { id: '10768', label: 'Politics' },
  { id: '37', label: 'Western' }
];

const YEARS = [
  { id: '', label: 'All Years' },
  ...Array.from({ length: 30 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { id: year.toString(), label: year.toString() };
  })
];

const COUNTRIES = [
  { id: '', label: 'All Countries' },
  { id: 'US', label: 'United States' },
  { id: 'KR', label: 'South Korea' },
  { id: 'JP', label: 'Japan' },
  { id: 'GB', label: 'United Kingdom' },
  { id: 'FR', label: 'France' },
  { id: 'IN', label: 'India' },
  { id: 'ES', label: 'Spain' },
  { id: 'IT', label: 'Italy' },
  { id: 'DE', label: 'Germany' },
  { id: 'CA', label: 'Canada' },
  { id: 'AU', label: 'Australia' }
];

function FilterDropdown({ 
  label, 
  options, 
  selectedId, 
  onChange, 
  activeDot = false 
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && listRef.current && selectedId) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [isOpen, selectedId]);

  const activeOption = options.find((o: any) => o.id === selectedId);
  const displayLabel = activeOption ? activeOption.label || activeOption.name : label;

  return (
    <div className="relative pointer-events-auto shrink-0" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#161618]/70 backdrop-blur-3xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)] hover:bg-white/[0.12] hover:border-white/30 active:scale-95 transition-all duration-200 text-[13px] font-medium text-white/90"
      >
        {activeDot && <div className="w-1.5 h-1.5 rounded-full bg-white mr-0.5 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
        {displayLabel}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-white/60'}`} />
      </button>

      {isOpen && (
        <div 
          ref={listRef}
          className="absolute left-0 top-full mt-2 min-w-[170px] bg-[#161618]/95 backdrop-blur-3xl border border-white/[0.18] rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.2)] animate-in fade-in slide-in-from-top-2 duration-150 z-50 max-h-72 overflow-y-auto filter-scrollbar overscroll-contain pr-1 scroll-smooth"
        >
          {options.map((opt: any) => (
             <button
               key={opt.id}
               data-selected={selectedId === opt.id ? "true" : undefined}
               onClick={() => { onChange(opt.id); setIsOpen(false); }}
               className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all flex items-center justify-between ${selectedId === opt.id ? 'bg-white text-black font-semibold' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
             >
                <span className="truncate pr-2">{opt.label || opt.name}</span>
                {selectedId === opt.id && <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={3} />}
             </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MultiSelectDropdown({ 
  label, 
  options, 
  selectedIds, 
  toggleOption, 
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="relative pointer-events-auto shrink-0" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#161618]/70 backdrop-blur-3xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)] hover:bg-white/[0.12] hover:border-white/30 active:scale-95 transition-all duration-200 text-[13px] font-medium text-white/90"
      >
        {hasSelection && <div className="w-1.5 h-1.5 rounded-full bg-white mr-0.5 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />}
        {label} {hasSelection && <span className="opacity-70 ml-0.5">({selectedIds.length})</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : 'text-white/60'}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 min-w-[170px] bg-[#161618]/95 backdrop-blur-3xl border border-white/[0.18] rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.2)] animate-in fade-in slide-in-from-top-2 duration-150 z-50 max-h-72 overflow-y-auto filter-scrollbar overscroll-contain pr-1 scroll-smooth">
          {options.map((opt: any) => {
             const isSelected = selectedIds.includes(opt.id);
             return (
               <button
                 key={opt.id}
                 onClick={() => toggleOption(opt.id)}
                 className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all flex items-center justify-between ${isSelected ? 'bg-white/10 text-white font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
               >
                  <span className="truncate pr-2">{opt.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={3} />}
               </button>
             );
          })}
        </div>
      )}
    </div>
  );
}

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
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
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
      
      if (selectedGenre) {
        params.with_genres = selectedGenre;
      }
      
      if (selectedYear) {
        if (type === 'movie') {
          params.primary_release_year = selectedYear;
        } else {
          params.first_air_date_year = selectedYear;
        }
      }
      
      if (selectedCountry) {
        params.with_origin_country = selectedCountry;
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

  const clearAllFilters = () => {
    setSortBy('popularity.desc');
    setSelectedProviders([]);
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedCountry('');
  };

  const randomize = () => {
    // Basic randomizer: jump to a random page among popular items
    const randomPage = Math.floor(Math.random() * 50) + 1;
    setPage(randomPage);
    loadData(randomPage);
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
  }, [sortBy, selectedProviders, selectedGenre, selectedYear, selectedCountry]);

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
  }, [isAutoLoadEnabled, isLoadingMore, page, totalPages]);

  return (
    <div className="container mx-auto px-4 md:px-8 max-w-[1400px] py-24 md:py-28">
      {/* Header & Filter Controls Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-2">{title}</h1>
          <p className="text-white/60 text-base md:text-lg">Discover new {type === 'movie' ? 'movies' : 'shows'} to watch</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 z-40 relative">
          {/* Random / Dice Button */}
          <button 
            onClick={randomize}
            className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[#161618]/70 backdrop-blur-3xl border border-white/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)] hover:bg-white/[0.12] hover:border-white/30 active:scale-95 transition-all shrink-0 text-white/80 hover:text-white"
            title="Randomize"
          >
            <Dices className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          
          <FilterDropdown 
            label="Genre" 
            options={type === 'movie' ? MOVIE_GENRES : TV_GENRES} 
            selectedId={selectedGenre} 
            onChange={setSelectedGenre}
            activeDot={!!selectedGenre}
          />
          
          <FilterDropdown 
            label="Year" 
            options={YEARS} 
            selectedId={selectedYear} 
            onChange={setSelectedYear} 
            activeDot={!!selectedYear}
          />

          <FilterDropdown 
            label="Sort"
            options={SORT_OPTIONS}
            selectedId={sortBy}
            onChange={setSortBy}
            activeDot={true}
          />

          <MultiSelectDropdown 
            label="Provider"
            options={WATCH_PROVIDERS}
            selectedIds={selectedProviders}
            toggleOption={toggleProvider}
          />
          
          <FilterDropdown 
            label="Country" 
            options={COUNTRIES} 
            selectedId={selectedCountry} 
            onChange={setSelectedCountry} 
            activeDot={!!selectedCountry}
          />
        </div>
      </div>

      {/* Results Grid */}
      <div className="w-full min-w-0">
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
              onClick={clearAllFilters}
              className="mt-6 inline-flex items-center px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-medium active:scale-95 transition-all"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

