'use client';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ScrollableRow({ 
  children,
  className = "flex gap-3 min-[390px]:gap-3.5 sm:gap-4 md:gap-[18px] lg:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 sm:pb-8 pt-2 custom-scrollbar px-0.5"
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
        className={`absolute left-2 top-2 bottom-8 z-40 transition-all duration-300 hidden md:flex items-center justify-center ${
          showLeft
            ? 'opacity-0 group-hover/row:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => scroll('left')}
          className="ios-btn-circle w-11 h-11 md:w-12 md:h-12 hover:scale-105 active:scale-95"
          aria-label="Scroll left"
        >
          <ChevronLeft
            className="w-6 h-6 text-white pr-0.5"
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
        className={`absolute right-2 top-2 bottom-8 z-40 transition-all duration-300 hidden md:flex items-center justify-center ${
          showRight
            ? 'opacity-0 group-hover/row:opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => scroll('right')}
          className="ios-btn-circle w-11 h-11 md:w-12 md:h-12 hover:scale-105 active:scale-95"
          aria-label="Scroll right"
        >
          <ChevronRight
            className="w-6 h-6 text-white pl-0.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}
