'use client';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ScrollableRow({ 
  children,
  className = "flex gap-2.5 min-[380px]:gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 sm:pb-8 pt-2 custom-scrollbar px-0.5"
}: { 
  children: React.ReactNode,
  className?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2); // 2px buffer
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/row">
      {/* Left Arrow */}
      <div
        className={`absolute left-0 top-2 bottom-8 z-40 w-12 sm:w-14 md:w-16 transition-all duration-300 hidden md:flex items-center justify-start rounded-l-2xl overflow-hidden ${
          showLeft
            ? 'opacity-0 group-hover/row:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => scroll('left')}
          className="group/arrow w-full h-full flex items-center justify-center bg-gradient-to-r from-black/85 via-black/35 to-transparent text-white/75 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none select-none"
          aria-label="Scroll left"
        >
          <ChevronLeft
            className="w-9 h-9 md:w-11 md:h-11 transition-all duration-200 transform group-hover/arrow:scale-125 group-hover/arrow:-translate-x-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* Scrollable Container */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className={className}
      >
        {children}
      </div>

      {/* Right Arrow */}
      <div
        className={`absolute right-0 top-2 bottom-8 z-40 w-12 sm:w-14 md:w-16 transition-all duration-300 hidden md:flex items-center justify-end rounded-r-2xl overflow-hidden ${
          showRight
            ? 'opacity-0 group-hover/row:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => scroll('right')}
          className="group/arrow w-full h-full flex items-center justify-center bg-gradient-to-l from-black/85 via-black/35 to-transparent text-white/75 hover:text-white active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none select-none"
          aria-label="Scroll right"
        >
          <ChevronRight
            className="w-9 h-9 md:w-11 md:h-11 transition-all duration-200 transform group-hover/arrow:scale-125 group-hover/arrow:translate-x-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}
