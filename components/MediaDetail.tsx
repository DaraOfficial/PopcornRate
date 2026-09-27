'use client';

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/tmdb";
import {
  ChevronLeft,
  User,
  Play,
  Plus,
  Check,
  Download,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  X,
  ExternalLink,
  Tv,
  Film,
  Calendar,
  Clock,
  Globe,
  Quote,
  Star,
  Clapperboard,
  Layers,
  ListVideo,
} from "lucide-react";
import MovieCard from "./MovieCard";
import TVEpisodesSection from "./TVEpisodesSection";
import ScrollableRow from "./ScrollableRow";

export default function MediaDetail({
  media,
  type,
  initialSeasonData,
}: {
  media: any;
  type: "movie" | "tv";
  initialSeasonData?: any;
}) {
  const router = useRouter();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Netflix-style Hero Background Trailer state & refs
  const heroSectionRef = useRef<HTMLDivElement | null>(null);
  const heroIframeRef = useRef<HTMLIFrameElement | null>(null);
  const readyFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [shouldMountHeroTrailer, setShouldMountHeroTrailer] = useState(false);
  const [isHeroTrailerPlaying, setIsHeroTrailerPlaying] = useState(false);
  const [isHeroTrailerEnded, setIsHeroTrailerEnded] = useState(false);
  const [isUserIdle, setIsUserIdle] = useState(false);

  // Best trailer (prioritize Official YouTube Trailer -> YouTube Trailer -> Teaser -> any YouTube video)
  const videosList: any[] = media?.videos?.results || [];
  const trailerVideo =
    videosList.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ||
    videosList.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer"
    ) ||
    videosList.find(
      (v: any) => v.site === "YouTube" && v.type === "Teaser"
    ) ||
    videosList.find((v: any) => v.site === "YouTube");
  const trailerKey: string | null = trailerVideo?.key || null;

  useEffect(() => {
    if (!media?.id) return;
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("popcorn-watchlist");
        if (saved) {
          const list = JSON.parse(saved);
          if (Array.isArray(list) && list.some((item: any) => item.id === media.id)) {
            setIsInWatchlist(true);
          }
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [media?.id]);

  // Mount and autoplay the hero trailer shortly after user visits the detail page (Netflix-style)
  useEffect(() => {
    setShouldMountHeroTrailer(false);
    setIsHeroTrailerPlaying(false);
    setIsHeroTrailerEnded(false);

    if (!trailerKey) return;

    const timer = setTimeout(() => {
      setShouldMountHeroTrailer(true);
    }, 550);

    return () => {
      clearTimeout(timer);
      if (readyFallbackTimerRef.current) {
        clearTimeout(readyFallbackTimerRef.current);
      }
    };
  }, [trailerKey]);

  // Listen to YouTube IFrame Player API state changes for seamless crossfade & replay detection
  useEffect(() => {
    if (!shouldMountHeroTrailer || !trailerKey) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube.com")) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (!data) return;

        const playerState =
          data.event === "onStateChange"
            ? data.info
            : data.event === "infoDelivery" &&
              data.info &&
              typeof data.info.playerState === "number"
            ? data.info.playerState
            : undefined;

        if (playerState === 1) {
          // Video is actively playing
          if (readyFallbackTimerRef.current) {
            clearTimeout(readyFallbackTimerRef.current);
          }
          setIsHeroTrailerPlaying(true);
          setIsHeroTrailerEnded(false);
        } else if (playerState === 0) {
          // Video ended -> smoothly fade back to backdrop image
          setIsHeroTrailerPlaying(false);
          setIsHeroTrailerEnded(true);
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [shouldMountHeroTrailer, trailerKey]);

  // Pause hero background trailer when fullscreen modal opens, resume when closed
  useEffect(() => {
    const iframeWin = heroIframeRef.current?.contentWindow;
    if (!iframeWin || !shouldMountHeroTrailer || isHeroTrailerEnded) return;

    if (isTrailerOpen) {
      iframeWin.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*"
      );
    } else {
      iframeWin.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
    }
  }, [isTrailerOpen, shouldMountHeroTrailer, isHeroTrailerEnded]);

  // Pause hero background trailer when user scrolls past the hero section, resume when scrolling back up
  useEffect(() => {
    const heroEl = heroSectionRef.current;
    if (!heroEl || !shouldMountHeroTrailer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const iframeWin = heroIframeRef.current?.contentWindow;
        if (!iframeWin || isHeroTrailerEnded || isTrailerOpen) return;

        if (entry.isIntersecting) {
          iframeWin.postMessage(
            JSON.stringify({ event: "command", func: "playVideo", args: [] }),
            "*"
          );
        } else {
          iframeWin.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
            "*"
          );
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [shouldMountHeroTrailer, isHeroTrailerEnded, isTrailerOpen]);

  // Hide hero details & drop title logo above buttons after trailer plays if user is not moving the mouse
  useEffect(() => {
    if (!isHeroTrailerPlaying || isHeroTrailerEnded || isTrailerOpen) {
      setIsUserIdle(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      return;
    }

    const startIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(() => {
        setIsUserIdle(true);
      }, 2500);
    };

    const handleUserActivity = () => {
      setIsUserIdle(false);
      startIdleTimer();
    };

    startIdleTimer();

    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("mousedown", handleUserActivity, { passive: true });
    window.addEventListener("touchstart", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, [isHeroTrailerPlaying, isHeroTrailerEnded, isTrailerOpen]);

  const isDetailsCollapsed =
    isHeroTrailerPlaying && !isHeroTrailerEnded && !isTrailerOpen && isUserIdle;

  if (!media) return null;

  const title = (type === "movie" ? media.title : media.name) || "Untitled";
  const releaseDateStr =
    type === "movie" ? media.release_date : media.first_air_date;

  let year = "";
  let fullReleaseDate = "";
  if (releaseDateStr) {
    const parsedDate = new Date(releaseDateStr);
    if (!isNaN(parsedDate.getTime())) {
      year = String(parsedDate.getFullYear());
      fullReleaseDate = parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  // Runtime
  const runtime =
    type === "movie" ? media.runtime : media.episode_run_time?.[0] || 0;
  const runtimeHours = runtime ? Math.floor(runtime / 60) : 0;
  const runtimeMins = runtime ? runtime % 60 : 0;
  const runtimeStr =
    runtime > 0
      ? `${runtimeHours > 0 ? `${runtimeHours}h ` : ""}${runtimeMins}m`
      : type === "tv" && media.number_of_seasons
      ? `${media.number_of_seasons} ${media.number_of_seasons > 1 ? "Seasons" : "Season"}`
      : "";

  const cast = media.credits?.cast?.slice(0, 24) || [];
  const recommendations = media.recommendations?.results || [];

  // Director or Creator
  const director =
    type === "movie"
      ? media.credits?.crew?.find((c: any) => c.job === "Director")?.name
      : null;
  const creator =
    type === "tv" && media.created_by && media.created_by.length > 0
      ? media.created_by.map((c: any) => c.name).join(", ")
      : null;

  // Best logo in English or without language tag
  const logo =
    media.images?.logos?.find(
      (l: any) => l.iso_639_1 === "en" || !l.iso_639_1
    ) || media.images?.logos?.[0];

  const genresList: string[] =
    media.genres?.map((g: any) => g.name).slice(0, 4) || [];

  const ratingValue = media.vote_average || 0;
  const ratingFormatted =
    ratingValue > 0
      ? ratingValue >= 9.95
        ? "10"
        : ratingValue % 1 === 0
        ? String(Math.round(ratingValue))
        : (Math.round(ratingValue * 10) / 10).toString()
      : "NR";

  const voteCountFormatted =
    media.vote_count > 999
      ? `${(media.vote_count / 1000).toFixed(1)}k`
      : media.vote_count
      ? String(media.vote_count)
      : null;

  // Watch Providers (Streaming options)
  const watchProvidersObj = media["watch/providers"]?.results;
  const regionProviders =
    watchProvidersObj?.US ||
    (watchProvidersObj ? Object.values(watchProvidersObj)[0] : null);
  const streamProviders: any[] = regionProviders?.flatrate || [];
  const rentProviders: any[] = regionProviders?.rent || [];
  const buyProviders: any[] = regionProviders?.buy || [];
  const justWatchLink = regionProviders?.link;

  // Reviews
  const reviewsList: any[] = media.reviews?.results || [];
  const featuredReviews = reviewsList.slice(0, 2);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleHeroIframeLoad = () => {
    const iframeWin = heroIframeRef.current?.contentWindow;
    if (iframeWin) {
      iframeWin.postMessage(
        JSON.stringify({ event: "listening", id: "hero-trailer", channel: "widget" }),
        "*"
      );
      iframeWin.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
    }
    if (readyFallbackTimerRef.current) {
      clearTimeout(readyFallbackTimerRef.current);
    }
    readyFallbackTimerRef.current = setTimeout(() => {
      setIsHeroTrailerPlaying(true);
    }, 1100);
  };

  const handleAudioOrReplay = () => {
    if (!trailerKey) {
      setIsMuted((prev) => !prev);
      triggerToast(isMuted ? "Audio enabled" : "Audio muted");
      return;
    }

    const iframeWin = heroIframeRef.current?.contentWindow;

    if (isHeroTrailerEnded) {
      setIsHeroTrailerEnded(false);
      setIsHeroTrailerPlaying(true);
      if (iframeWin) {
        iframeWin.postMessage(
          JSON.stringify({ event: "command", func: "seekTo", args: [0, true] }),
          "*"
        );
        iframeWin.postMessage(
          JSON.stringify({ event: "command", func: "playVideo", args: [] }),
          "*"
        );
      }
      triggerToast("Replaying trailer");
      return;
    }

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (iframeWin) {
      iframeWin.postMessage(
        JSON.stringify({
          event: "command",
          func: nextMuted ? "mute" : "unMute",
          args: [],
        }),
        "*"
      );
      if (!nextMuted) {
        iframeWin.postMessage(
          JSON.stringify({
            event: "command",
            func: "setVolume",
            args: [100],
          }),
          "*"
        );
        iframeWin.postMessage(
          JSON.stringify({
            event: "command",
            func: "playVideo",
            args: [],
          }),
          "*"
        );
      }
    }

    triggerToast(nextMuted ? "Audio muted" : "Audio enabled");
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const toggleWatchlist = () => {
    try {
      const saved = localStorage.getItem("popcorn-watchlist");
      let list: any[] = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(list)) list = [];

      if (isInWatchlist) {
        list = list.filter((item) => item.id !== media.id);
        setIsInWatchlist(false);
        triggerToast("Removed from Watchlist");
      } else {
        list.push({
          id: media.id,
          title,
          poster_path: media.poster_path,
          vote_average: media.vote_average,
          type,
        });
        setIsInWatchlist(true);
        triggerToast("Added to Watchlist");
      }
      localStorage.setItem("popcorn-watchlist", JSON.stringify(list));
    } catch {
      setIsInWatchlist(!isInWatchlist);
    }
  };

  const handleDownload = () => {
    setIsDownloaded((prev) => !prev);
    triggerToast(
      isDownloaded
        ? "Download removed from device"
        : "Ready for offline playback"
    );
  };

  const scrollToSimilar = () => {
    const el = document.getElementById("similar-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      triggerToast("No similar titles available");
    }
  };

  const scrollToEpisodes = () => {
    const el = document.getElementById("episodes-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      triggerToast("Episodes not available for this series");
    }
  };

  const formatCurrency = (amount: number) => {
    if (!amount || amount <= 0) return null;
    if (amount >= 1_000_000_000) {
      return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white/30 pb-24 font-sans">
      {/* Top Floating Action Bar */}
      <div className="absolute top-6 left-6 right-6 md:top-8 md:left-8 md:right-8 z-50 flex items-center justify-between pointer-events-none">
        {/* Navigation Back Button */}
        <button
          onClick={handleBack}
          className="pointer-events-auto ios-btn-circle"
          aria-label="Go back"
        >
          <ChevronLeft className="w-[22px] h-[22px] mr-0.5" strokeWidth={2.2} />
        </button>

        {/* Right Actions: Audio/Replay Control */}
        <div className="pointer-events-auto flex items-center gap-2.5">
          <button
            onClick={handleAudioOrReplay}
            className="ios-btn-circle"
            aria-label={
              isHeroTrailerEnded
                ? "Replay trailer"
                : isMuted
                ? "Unmute trailer"
                : "Mute trailer"
            }
            title={
              isHeroTrailerEnded
                ? "Replay trailer"
                : isMuted
                ? "Unmute trailer"
                : "Mute trailer"
            }
          >
            {isHeroTrailerEnded ? (
              <RotateCcw className="w-[18px] h-[18px]" strokeWidth={2.2} />
            ) : isMuted ? (
              <VolumeX className="w-[18px] h-[18px]" strokeWidth={2.2} />
            ) : (
              <Volume2 className="w-[18px] h-[18px]" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div
        ref={heroSectionRef}
        className="relative w-full min-h-[75vh] md:min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-end overflow-hidden"
      >
        {/* Full-bleed Cinematic Backdrop Image (Base Layer) */}
        {media.backdrop_path ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={getImageUrl(media.backdrop_path, "original")}
              alt={title}
              fill
              className="object-cover object-center md:object-top"
              priority
            />
            {/* Cinematic Gradient Vignettes */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent w-full md:w-4/5" />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1a1c] to-black" />
        )}

        {/* Netflix-Style Auto-Playing Hero Background Trailer */}
        {shouldMountHeroTrailer && trailerKey && (
          <div
            className={`absolute inset-0 z-[1] overflow-hidden pointer-events-none transition-opacity duration-1000 ease-out ${
              isHeroTrailerPlaying && !isHeroTrailerEnded ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
          >
            <div className="absolute inset-x-0 top-0 h-[78%] sm:h-full overflow-hidden">
              <iframe
                ref={heroIframeRef}
                onLoad={handleHeroIframeLoad}
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`}
                title={`${title} Hero Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210vw] sm:w-[177.78vh] min-w-full min-h-full sm:min-h-[56.25vw] aspect-video pointer-events-none scale-[1.18] sm:scale-[1.22] border-0"
                tabIndex={-1}
              />
              {/* Smooth bottom blend on mobile portrait */}
              <div className="sm:hidden absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>
            {/* Cinematic Vignettes over Trailer Video */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
            <div
              className={`absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-transparent w-full md:w-3/4 transition-opacity duration-700 ${
                isDetailsCollapsed ? "opacity-40" : "opacity-100"
              }`}
            />
          </div>
        )}

        {/* Hero Content (Positioned at Lower-Left) */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] pb-12 md:pb-16 pt-32">
          <div className="max-w-xl md:max-w-2xl flex flex-col items-start">
            {/* Title / Movie Logo */}
            {logo?.file_path ? (
              <div
                className={`relative h-16 sm:h-24 md:h-28 lg:h-32 w-56 sm:w-80 md:w-96 origin-bottom-left transition-all duration-700 ease-in-out ${
                  isDetailsCollapsed
                    ? "mb-3.5 sm:mb-4 scale-90 sm:scale-[0.88]"
                    : "mb-4 sm:mb-5 scale-100"
                }`}
              >
                <Image
                  src={getImageUrl(logo.file_path, "original")}
                  alt={title}
                  fill
                  className="object-contain object-left-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
                  priority
                />
              </div>
            ) : (
              <h1
                className={`text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] origin-bottom-left transition-all duration-700 ease-in-out ${
                  isDetailsCollapsed
                    ? "mb-3.5 sm:mb-4 scale-90 sm:scale-[0.88]"
                    : "mb-4 scale-100"
                }`}
              >
                {title}
              </h1>
            )}

            {/* Collapsible Info Block: Tagline, Metadata & Overview (Hides when trailer plays and mouse is idle) */}
            <div
              className={`grid w-full transition-all duration-700 ease-in-out ${
                isDetailsCollapsed
                  ? "grid-rows-[0fr] opacity-0 translate-y-2 pointer-events-none"
                  : "grid-rows-[1fr] opacity-100 translate-y-0"
              }`}
              aria-hidden={isDetailsCollapsed}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-6">
                  {/* Tagline if available */}
                  {media.tagline && (
                    <p className="text-sm md:text-[15px] text-amber-200/90 font-medium italic mb-3.5 max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      &ldquo;{media.tagline}&rdquo;
                    </p>
                  )}

                  {/* Metadata Line: ★ 6.8 (4.2k) · 2026 · 1h 55m · Family · Fantasy · Comedy */}
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13.5px] md:text-[14px] text-white/80 font-medium mb-3.5 select-none">
                    {ratingValue > 0 && (
                      <span className="text-white font-bold flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-md">
                        <span className="text-amber-400">★</span>
                        <span>{ratingFormatted}</span>
                        {voteCountFormatted && (
                          <span className="text-white/50 text-[11.5px] font-normal ml-0.5">
                            ({voteCountFormatted})
                          </span>
                        )}
                      </span>
                    )}
                    {year && (
                      <>
                        <span className="text-white/40">·</span>
                        <span>{year}</span>
                      </>
                    )}
                    {runtimeStr && (
                      <>
                        <span className="text-white/40">·</span>
                        <span>{runtimeStr}</span>
                      </>
                    )}
                    {media.status && (
                      <>
                        <span className="text-white/40">·</span>
                        <span className="text-white/70 uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-white/5 border border-white/10 font-semibold">
                          {media.status}
                        </span>
                      </>
                    )}
                    {genresList.length > 0 && (
                      <>
                        <span className="text-white/40">·</span>
                        <span className="text-white/75">{genresList.join("  ·  ")}</span>
                      </>
                    )}
                  </div>

                  {/* Synopsis / Overview */}
                  {media.overview && (
                    <p className="text-[13.5px] sm:text-[14.5px] md:text-[15.5px] text-white/85 leading-relaxed font-normal line-clamp-3 md:line-clamp-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] max-w-xl md:max-w-2xl">
                      {media.overview}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto select-none">
              {/* 1. Play Button */}
              <button
                onClick={() => {
                  if (trailerVideo) {
                    setIsTrailerOpen(true);
                  } else {
                    triggerToast("No trailer video preview found");
                  }
                }}
                className="ios-btn-primary flex-1 sm:flex-none"
                title="Play"
                aria-label="Play"
              >
                <Play className="w-[18px] h-[18px] fill-current" />
                <span>Play</span>
              </button>

              {/* 2. Add to Watchlist (+) Button */}
              <button
                onClick={toggleWatchlist}
                className="ios-btn-circle"
                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                aria-label="Add to Watchlist"
              >
                {isInWatchlist ? (
                  <Check className="w-[18px] h-[18px] text-emerald-400" strokeWidth={2.5} />
                ) : (
                  <Plus className="w-[18px] h-[18px]" strokeWidth={2.2} />
                )}
              </button>

              {/* 3. Episodes Button for TV Shows, Download Button for Movies */}
              {type === "tv" ? (
                <button
                  onClick={scrollToEpisodes}
                  className="ios-btn-circle-responsive"
                  title="Episodes"
                  aria-label="Episodes"
                >
                  <ListVideo className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />
                  <span className="hidden sm:inline">Episodes</span>
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="ios-btn-circle-responsive"
                  title={isDownloaded ? "Downloaded" : "Download"}
                  aria-label={isDownloaded ? "Downloaded" : "Download"}
                >
                  {isDownloaded ? (
                    <Check className="w-[18px] h-[18px] text-emerald-400" strokeWidth={2.5} />
                  ) : (
                    <Download className="w-[18px] h-[18px]" strokeWidth={2.2} />
                  )}
                  <span className="hidden sm:inline">{isDownloaded ? "Downloaded" : "Download"}</span>
                </button>
              )}

              {/* 4. Similars Button */}
              {recommendations.length > 0 && (
                <button
                  onClick={scrollToSimilar}
                  className="ios-btn-circle-responsive"
                  title="Similars"
                  aria-label="Similars"
                >
                  <Sparkles className="w-[18px] h-[18px] text-amber-300" strokeWidth={2.2} />
                  <span className="hidden sm:inline">Similars</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Toast */}
      {toastMsg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[120] bg-[#161618]/90 text-white border border-white/20 backdrop-blur-3xl px-5 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Trailer Video Player Modal */}
      {isTrailerOpen && trailerVideo && (
        <div
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setIsTrailerOpen(false)}
        >
          <div
            className="w-full max-w-5xl aspect-video relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/[0.15]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsTrailerOpen(false)}
              className="absolute top-4 right-4 z-10 ios-btn-circle"
              aria-label="Close trailer modal"
            >
              <X className="w-5 h-5" strokeWidth={2.2} />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
              title="Video Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="border-0"
            />
          </div>
        </div>
      )}

      {/* Main Content Details */}
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] mt-10 md:mt-14">
        {/* Where to Watch / Streaming Options Card */}
        {(streamProviders.length > 0 || rentProviders.length > 0 || buyProviders.length > 0) && (
          <div className="mb-14 p-5 sm:p-6 rounded-3xl bg-[#161618]/80 border border-white/[0.12] backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                  <Tv className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Where to Watch</h3>
                  <p className="text-xs text-white/50">Streaming, rent and purchase options</p>
                </div>
              </div>

              {justWatchLink && (
                <a
                  href={justWatchLink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full self-start sm:self-auto"
                >
                  <span>Powered by JustWatch</span>
                  <ExternalLink className="w-3 h-3 text-white/50" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-5">
              {/* Stream With Subscription */}
              {streamProviders.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Stream
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {streamProviders.map((prov: any) => (
                      <div
                        key={prov.provider_id}
                        className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3 py-1.5 rounded-2xl transition-all"
                        title={prov.provider_name}
                      >
                        {prov.logo_path && (
                          <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={getImageUrl(prov.logo_path, "w500")}
                              alt={prov.provider_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-xs font-medium text-white/90">{prov.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rent Options */}
              {rentProviders.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 block mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Rent
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {rentProviders.slice(0, 6).map((prov: any) => (
                      <div
                        key={prov.provider_id}
                        className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3 py-1.5 rounded-2xl transition-all"
                        title={prov.provider_name}
                      >
                        {prov.logo_path && (
                          <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={getImageUrl(prov.logo_path, "w500")}
                              alt={prov.provider_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-xs font-medium text-white/90">{prov.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Buy Options */}
              {buyProviders.length > 0 && (
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-blue-400 block mb-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Buy
                  </span>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {buyProviders.slice(0, 6).map((prov: any) => (
                      <div
                        key={prov.provider_id}
                        className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-3 py-1.5 rounded-2xl transition-all"
                        title={prov.provider_name}
                      >
                        {prov.logo_path && (
                          <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={getImageUrl(prov.logo_path, "w500")}
                              alt={prov.provider_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-xs font-medium text-white/90">{prov.provider_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TV Episodes Section (matching reference image) */}
        {type === "tv" && media.seasons && (
          <div id="episodes-section" className="mb-16 md:mb-20 scroll-mt-28">
            <TVEpisodesSection
              tvId={media.id}
              seasons={media.seasons}
              initialSeasonData={initialSeasonData}
              onPlayEpisode={(ep) => {
                if (trailerVideo) {
                  setIsTrailerOpen(true);
                } else {
                  triggerToast(`Playing ${ep.name || `Episode ${ep.episode_number}`}`);
                }
              }}
              onToast={triggerToast}
            />
          </div>
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <section className="mb-16 md:mb-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                Cast &amp; Crew
              </h2>
            </div>
            <ScrollableRow className="flex gap-3 min-[390px]:gap-3.5 sm:gap-4 md:gap-[18px] overflow-x-auto snap-x snap-mandatory pb-6 pt-2 custom-scrollbar">
              {cast.map((person: any) => (
                <div
                  key={person.id}
                  className="w-[120px] min-[390px]:w-[132px] sm:w-[145px] md:w-[156px] lg:w-[166px] shrink-0 snap-start rounded-xl sm:rounded-2xl overflow-hidden bg-[#161618]/80 border border-white/10 shadow-md flex flex-col select-none"
                >
                  <div className="relative w-full aspect-[2/3] bg-white/5">
                    {person.profile_path ? (
                      <Image
                        src={getImageUrl(person.profile_path, "w500")}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-white/20">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-start">
                    <p className="font-bold text-[13px] sm:text-sm text-white line-clamp-2 leading-snug mb-1">
                      {person.name}
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/60 line-clamp-2 leading-snug">
                      {person.character}
                    </p>
                  </div>
                </div>
              ))}
            </ScrollableRow>
          </section>
        )}

        {/* Media Details & Specifications Grid */}
        <section className="mb-16 md:mb-20 p-6 md:p-8 rounded-3xl bg-[#161618]/60 border border-white/[0.08] backdrop-blur-xl">
          <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Story &amp; Production Details</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
            {director && (
              <div>
                <span className="text-xs text-white/45 block mb-1">Director</span>
                <span className="font-semibold text-white/90">{director}</span>
              </div>
            )}
            {creator && (
              <div>
                <span className="text-xs text-white/45 block mb-1">Created By</span>
                <span className="font-semibold text-white/90">{creator}</span>
              </div>
            )}
            {fullReleaseDate && (
              <div>
                <span className="text-xs text-white/45 block mb-1">Release Date</span>
                <span className="font-semibold text-white/90">{fullReleaseDate}</span>
              </div>
            )}
            {media.original_language && (
              <div>
                <span className="text-xs text-white/45 block mb-1">Original Language</span>
                <span className="font-semibold text-white/90 uppercase">{media.original_language}</span>
              </div>
            )}
            {type === "movie" && formatCurrency(media.budget) && (
              <div>
                <span className="text-xs text-white/45 block mb-1">Budget</span>
                <span className="font-semibold text-white/90">{formatCurrency(media.budget)}</span>
              </div>
            )}
            {type === "movie" && formatCurrency(media.revenue) && (
              <div>
                <span className="text-xs text-white/45 block mb-1">Box Office Revenue</span>
                <span className="font-semibold text-white/90">{formatCurrency(media.revenue)}</span>
              </div>
            )}
            {type === "tv" && media.number_of_episodes && (
              <div>
                <span className="text-xs text-white/45 block mb-1">Total Episodes</span>
                <span className="font-semibold text-white/90">{media.number_of_episodes} Episodes</span>
              </div>
            )}
            {media.production_companies && media.production_companies.length > 0 && (
              <div className="col-span-2">
                <span className="text-xs text-white/45 block mb-1">Production</span>
                <span className="font-semibold text-white/90">
                  {media.production_companies.slice(0, 3).map((c: any) => c.name).join(" · ")}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Featured Audience Reviews */}
        {featuredReviews.length > 0 && (
          <section className="mb-16 md:mb-20">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-2.5">
              <Quote className="w-5 h-5 text-amber-400" />
              <span>Reviews &amp; Thoughts</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {featuredReviews.map((rev: any) => {
                const authorRating = rev.author_details?.rating;
                return (
                  <div
                    key={rev.id}
                    className="p-5 md:p-6 rounded-2xl bg-[#161618]/70 border border-white/[0.08] backdrop-blur-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-bold text-xs uppercase">
                            {rev.author?.[0] || "U"}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">{rev.author}</span>
                            <span className="text-[11px] text-white/45">
                              {rev.created_at ? new Date(rev.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Verified Reviewer"}
                            </span>
                          </div>
                        </div>

                        {authorRating && (
                          <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full text-xs font-bold text-amber-300">
                            <Star className="w-3 h-3 fill-current" />
                            <span>{authorRating}/10</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[13.5px] text-white/75 leading-relaxed line-clamp-4">
                        {rev.content}
                      </p>
                    </div>

                    {rev.url && (
                      <a
                        href={rev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 mt-4 transition-colors font-medium self-start"
                      >
                        <span>Read full review</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommendations / Similar Titles Section */}
        {recommendations.length > 0 && (
          <div id="similar-section" className="mb-16 scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-8 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>More Like This</span>
            </h2>
            <div className="poster-grid">
              {recommendations.slice(0, 12).map((item: any) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
