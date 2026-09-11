'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const SharpStar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function VibeRating() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);


  const moodCategories = [
    { name: 'Happy', emojis: ['😀', '🤭', '🥲', '😂', '🤣', '😍'] },
    { name: 'Interested', emojis: ['🥱', '😐', '😵', '🤨', '🤔', '🤯'] },
    { name: 'Surprised', emojis: ['😮', '😳', '🫢', '😨'] },
    { name: 'Sad', emojis: ['☹️', '😔', '😖', '😩', '😢', '😭'] },
    { name: 'Disgusted', emojis: ['😕', '😬', '🤢', '🤮'] },
    { name: 'Afraid', emojis: ['😦', '😰', '🫣', '😱'] },
    { name: 'Angry', emojis: ['😒', '😖', '😡', '🤬'] }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <div 
        className="flex flex-wrap items-center gap-3 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Top Community Vibes (Static aesthetic mimic) */}
        <div className="flex items-center ">
          <span className="text-[28px] z-30 leading-none">😍</span>
          <span className="text-[28px] z-20 -ml-1.5 leading-none">😃</span>
          <span className="text-[28px] z-10 -ml-1.5 leading-none">🥲</span>
        </div>

        {/* Action Pill */}
        <div className="flex items-center bg-[#161618]/70 backdrop-blur-3xl border border-white/[0.18] rounded-full h-[46px] px-5 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)] hover:bg-white/[0.1] active:scale-95 transition-all duration-200 ease-out select-none">
          {selectedVibe ? (
            <>
              <span className="font-bold text-white text-[16px]">
                Your Vibe <span className="text-[#21d07a] font-black ml-1">100<span className="text-[12px]">%</span></span>
              </span>
              <div className="w-[1px] h-[20px] bg-white/20 mx-4"></div>
              <span className="text-[24px] leading-none">{selectedVibe}</span>
            </>
          ) : rating ? (
            <>
              <span className="font-bold text-white text-[16px]">
                Your Rating <span className="text-white font-black ml-1">{rating}%</span>
              </span>
              <div className="w-[1px] h-[20px] bg-white/20 mx-4"></div>
              <SharpStar className="w-5 h-5 text-white drop-shadow-md" />
            </>
          ) : (
            <>
              <span className="font-bold text-white text-[16px]">What&apos;s your Vibe?</span>
              <div className="w-[1px] h-[20px] bg-white/20 mx-4"></div>
              <span className="bg-white/30 w-5 h-5 rounded-full text-[12px] flex items-center justify-center font-bold text-white">i</span>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-4 z-50 w-[420px] bg-[#f8f9fa] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-gray-200 p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#032541] font-extrabold text-[32px] tracking-tight">Rating</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="flex items-center justify-center w-8 h-8 rounded-full text-gray-500 hover:text-black hover:bg-black/5 active:scale-90 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={2.2} />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-8">
              <p className="italic text-[#032541] font-semibold text-[15px]">What did you think of ?</p>
              {rating ? (
                <p className="text-[#032541] text-[15px]"><span className="font-extrabold text-[17px]">{rating}%</span> user score</p>
              ) : (
                <p className="text-[#032541] opacity-50 text-[15px]"><span className="font-extrabold text-[17px]">--</span> user score</p>
              )}
            </div>
            
            <div className="relative h-2 rounded-full bg-gray-200 mb-8">
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#d2d531] to-[#21d07a] rounded-full" style={{ width: `${rating || 0}%` }} />
              <input 
                type="range" 
                min="0" max="100" 
                value={rating || 0} 
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-[#032541] shadow-md pointer-events-none z-10" 
                style={{ left: `calc(${rating || 0}% - 11px)` }} 
              />
              
              <div className="absolute top-full left-0 w-full flex justify-between text-[11px] text-gray-400 mt-2">
                {[0,10,20,30,40,50,60,70,80,90,100].map(val => (
                  <div key={val} className="flex flex-col items-center relative -ml-[10px] w-[20px]">
                    <div className="h-2 w-[1px] bg-gray-300 mb-1"></div>
                    <span className="text-[10px]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end mt-12 border-b border-gray-200 pb-6">
              <button onClick={() => setRating(null)} className="text-[#01b4e4] text-[15px] italic flex items-center gap-1.5 hover:underline">
                Clear my rating
                <span className="bg-black text-white rounded-full w-[18px] h-[18px] flex items-center justify-center font-bold text-[14px] leading-none pb-0.5">-</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-[#032541] font-extrabold text-[32px] tracking-tight mb-2">Mood</h3>
            <p className="italic text-[#032541] font-semibold text-[15px] mb-8">How did make you feel?</p>
            
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar-light pr-2 -mr-2 space-y-6">
              {moodCategories.map((category) => (
                <div key={category.name} className="flex items-center border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                  <p className="text-[#032541] font-bold text-[15px] w-[100px] shrink-0">{category.name}</p>
                  <div className="flex flex-wrap gap-4">
                    {category.emojis.map((emoji) => {
                      const isSelected = selectedVibe === emoji;
                      const isDimmed = selectedVibe && !isSelected;
                      return (
                        <button
                          key={emoji}
                          onClick={() => setSelectedVibe(emoji)}
                          className={`text-[36px] w-[54px] h-[54px] flex items-center justify-center rounded-full transition-all ${
                            isSelected ? 'bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] scale-110 z-10' : 'bg-transparent'
                          } ${isDimmed ? 'opacity-30 grayscale' : 'hover:scale-110'}`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setIsOpen(false)} 
                className="bg-[#032541] text-white font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#05355c] active:scale-95 shadow-md transition-all text-[15px]"
              >
                <span>✓</span> I&apos;m Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
