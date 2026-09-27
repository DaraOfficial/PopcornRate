"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Settings,
  Clapperboard,
  Tv,
  Bookmark,
  X,
  Check,
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setIsHidden(true);
            setIsSettingsOpen(false);
          } else if (currentScrollY < lastScrollY) {
            setIsHidden(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cmd+K or Ctrl+K shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close settings dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDetailPage =
    pathname?.startsWith("/movie/") || pathname?.startsWith("/tv/");
  if (isDetailPage) return null;

  const Logo = (
    <Link
      href="/"
      className="pointer-events-auto flex items-center gap-2 sm:gap-3 group active:scale-95 transition-all duration-200"
      aria-label="Popcorn Rate Home"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 transition-all duration-300 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        <BrandLogo className="w-full h-full" />
      </div>
      <span className="font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight text-white flex items-center drop-shadow-md">
        Popcorn<span className="text-amber-400 ml-0.5">Rate</span>
      </span>
    </Link>
  );

  return (
    <>
      {/* Mobile Logo (Top Left) */}
      <div
        className={`fixed top-5 left-5 sm:hidden z-[100] pointer-events-none transition-transform duration-300 ease-out select-none ${
          isHidden ? "-translate-y-28" : "translate-y-0"
        }`}
      >
        {Logo}
      </div>

      <header
        className={`fixed bottom-6 sm:bottom-auto sm:top-5 inset-x-0 z-[100] pointer-events-none transition-transform duration-300 ease-out select-none flex justify-center sm:block ${
          isHidden ? "translate-y-32 sm:-translate-y-28" : "translate-y-0"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-8 md:px-12 max-w-[1440px] flex items-center justify-center sm:justify-between">
          {/* Desktop Logo at Left */}
          <div className="hidden sm:block">
            {Logo}
          </div>

        {/* Navigation Capsule Pill moved to Right */}
        <div className="pointer-events-auto relative w-[92vw] sm:w-auto" ref={settingsRef}>
          <div className="flex items-center justify-between gap-1 bg-white/[0.08] bg-gradient-to-br from-white/[0.18] to-white/[0.05] backdrop-blur-2xl backdrop-saturate-[1.9] border border-white/[0.25] rounded-full shadow-[0_12px_36px_-6px_rgba(0,0,0,0.35),inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_-1px_1px_0_rgba(255,255,255,0.1)] p-2 sm:p-1.5 w-full">
            {/* iOS Segmented Navigation Items */}
            <div className="flex items-center justify-around flex-1 sm:flex-none sm:gap-1">
              <Link
                href="/"
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/" || pathname?.startsWith("/?q=")
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)] w-16 sm:w-auto"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium w-12 sm:w-auto"
                }`}
              >
                <Home
                  className={`w-[22px] h-[22px] sm:w-[17px] sm:h-[17px] ${
                    pathname === "/" || pathname?.startsWith("/?q=")
                      ? "block"
                      : "block sm:hidden"
                  }`}
                  strokeWidth={2.2}
                />
                <span className="hidden sm:block text-[13.5px] -tracking-[0.01em] whitespace-nowrap">
                  Home
                </span>
              </Link>

              <Link
                href="/movies"
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/movies"
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)] w-16 sm:w-auto"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium w-12 sm:w-auto"
                }`}
              >
                <Clapperboard
                  className={`w-[22px] h-[22px] sm:w-[17px] sm:h-[17px] ${
                    pathname === "/movies" ? "block" : "block sm:hidden"
                  }`}
                  strokeWidth={2.2}
                />
                <span className="hidden sm:block text-[13.5px] -tracking-[0.01em] whitespace-nowrap">
                  Movies
                </span>
              </Link>

              <Link
                href="/tv"
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/tv"
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)] w-16 sm:w-auto"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium w-12 sm:w-auto"
                }`}
              >
                <Tv
                  className={`w-[22px] h-[22px] sm:w-[17px] sm:h-[17px] ${
                    pathname === "/tv" ? "block" : "block sm:hidden"
                  }`}
                  strokeWidth={2.2}
                />
                <span className="hidden sm:block text-[13.5px] -tracking-[0.01em] whitespace-nowrap">
                  Shows
                </span>
              </Link>

              <Link
                href="/list"
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/list"
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)] w-16 sm:w-auto"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium w-12 sm:w-auto"
                }`}
              >
                <Bookmark
                  className={`w-[22px] h-[22px] sm:w-[17px] sm:h-[17px] ${
                    pathname === "/list" ? "block" : "block sm:hidden"
                  }`}
                  strokeWidth={2.2}
                />
                <span className="hidden sm:block text-[13.5px] -tracking-[0.01em] whitespace-nowrap">
                  My List
                </span>
              </Link>
            </div>

            {/* Subtle iOS Hairline Divider */}
            <div className="w-[1px] h-5 sm:h-4 bg-white/[0.15] mx-1"></div>

            {/* iOS Quick Actions */}
            <div className="flex items-center gap-1 sm:gap-0.5 pr-1 sm:pr-0">
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 rounded-full transition-all duration-150 cursor-pointer ${
                  isSearchOpen
                    ? "text-white bg-white/20 scale-105"
                    : "text-white/70 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.15] active:scale-90"
                }`}
                aria-label="Search"
                title="Search (Cmd+K)"
              >
                <Search className="w-5 h-5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 rounded-full transition-all duration-150 cursor-pointer ${
                  isSettingsOpen
                    ? "text-white bg-white/20 scale-105"
                    : "text-white/70 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.15] active:scale-90"
                }`}
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="w-5 h-5 sm:w-[18px] sm:h-[18px]" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Settings Popover */}
          {isSettingsOpen && (
            <div className="absolute right-0 bottom-full mb-4 sm:bottom-auto sm:top-full sm:mt-3 w-72 sm:w-80 bg-white/[0.12] bg-gradient-to-br from-white/[0.22] to-white/[0.07] backdrop-blur-3xl backdrop-saturate-[1.9] border border-white/[0.26] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_0_rgba(255,255,255,0.45)] animate-in fade-in slide-in-from-bottom-2 sm:slide-in-from-top-2 duration-150 z-50 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm tracking-wide">Settings</h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                  aria-label="Close settings"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-white/50 block mb-1 font-medium">
                    Data Provider
                  </label>
                  <p className="text-white/90 font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> TMDB
                    Official API Connected
                  </p>
                </div>

                <div>
                  <label className="text-white/50 block mb-1 font-medium">
                    Region & Streaming
                  </label>
                  <p className="text-white/80">
                    United States (US) &middot; Global Providers
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-white/50">App Version</span>
                  <span className="text-white/70 font-mono text-[11px]">
                    v1.0.0
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>

    {/* Centered Search Bar with Backdrop Blur */}
    <SearchModal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
    />
    </>
  );
}
