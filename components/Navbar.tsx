"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");
    if (query) {
      router.push(`/?q=${encodeURIComponent(query as string)}`);
      setIsOpen(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setTimeout(() => inputRef.current?.focus(), 10);
        }}
        className="flex items-center justify-center w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.15] active:scale-90 transition-all duration-150"
        aria-label="Search"
      >
        <Search className="w-[18px] h-[18px]" strokeWidth={2.2} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? "w-32 sm:w-44 opacity-100 ml-1.5" : "w-0 opacity-0 ml-0"
        }`}
      >
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            name="q"
            defaultValue={searchParams?.get("q") || ""}
            placeholder="Search..."
            className="w-full bg-white/[0.1] border border-white/[0.12] rounded-full px-3 py-1 text-[13px] text-white placeholder:text-white/45 outline-none focus:border-white/30 transition-colors"
            onBlur={() => {
              if (!searchParams?.get("q")) setIsOpen(false);
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  return (
    <header
      className={`fixed top-4 sm:top-5 inset-x-0 z-50 pointer-events-none transition-transform duration-300 ease-out select-none ${
        isHidden ? "-translate-y-28" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-8 md:px-12 max-w-[1440px] flex items-center justify-between">
        {/* Website Logo at Left */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 group active:scale-95 transition-all duration-200"
          aria-label="Popcorn Rate Home"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#161618]/70 hover:bg-white/[0.12] backdrop-blur-3xl border border-white/[0.18] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)] p-1.5 sm:p-2 transition-all duration-200 group-hover:border-white/30 group-hover:scale-105 shrink-0">
            <BrandLogo className="w-full h-full" />
          </div>
          <span className="hidden min-[480px]:flex font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-white items-center drop-shadow-md">
            Popcorn<span className="text-amber-400 ml-0.5">Rate</span>
          </span>
        </Link>

        {/* Navigation Capsule Pill moved to Right */}
        <div className="pointer-events-auto relative" ref={settingsRef}>
          <div className="flex items-center justify-between gap-1 bg-[#161618]/70 backdrop-blur-3xl border border-white/[0.18] rounded-full shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.22)] p-1 sm:p-1.5">
            {/* iOS Segmented Navigation Items */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Link
                href="/"
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/" || pathname?.startsWith("/?q=")
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium"
                }`}
              >
                <Home
                  className={`w-[19px] h-[19px] sm:w-[17px] sm:h-[17px] ${
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
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/movies"
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium"
                }`}
              >
                <Clapperboard
                  className={`w-[19px] h-[19px] sm:w-[17px] sm:h-[17px] ${
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
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/tv"
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium"
                }`}
              >
                <Tv
                  className={`w-[19px] h-[19px] sm:w-[17px] sm:h-[17px] ${
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
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-1.5 rounded-full transition-all duration-200 ease-out active:scale-95 ${
                  pathname === "/list"
                    ? "bg-white text-black font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.1)]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.07] active:bg-white/[0.12] font-medium"
                }`}
              >
                <Bookmark
                  className={`w-[19px] h-[19px] sm:w-[17px] sm:h-[17px] ${
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
            <div className="w-[1px] h-4 bg-white/[0.15] mx-1"></div>

            {/* iOS Quick Actions */}
            <div className="flex items-center gap-0.5">
              <Suspense
                fallback={
                  <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                }
              >
                <SearchInput />
              </Suspense>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 cursor-pointer ${
                  isSettingsOpen
                    ? "text-white bg-white/20 scale-105"
                    : "text-white/70 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.15] active:scale-90"
                }`}
                aria-label="Settings"
                title="Settings"
              >
                <Settings className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* Settings Popover */}
          {isSettingsOpen && (
            <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 bg-[#161618]/95 backdrop-blur-3xl border border-white/[0.18] rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.2)] animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-white">
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
  );
}
