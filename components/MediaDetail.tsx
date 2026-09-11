'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  X,
} from "lucide-react";
import MovieCard from "./MovieCard";
import TVEpisodesSection from "./TVEpisodesSection";

export default function MediaDetail({
  media,
  type,
  initialSeasonData,
}: {
  media: any;
  type: "movie" | "tv";
  initialSeasonData?: any;
}) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  if (!media) return null;

  const title = (type === "movie" ? media.title : media.name) || "Untitled";
  const releaseDateStr =
    type === "movie" ? media.release_date : media.first_air_date;

  let year = "";
  if (releaseDateStr) {
    const parsedDate = new Date(releaseDateStr);
    if (!isNaN(parsedDate.getTime())) {
      year = String(parsedDate.getFullYear());
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

  const cast = media.credits?.cast?.slice(0, 10) || [];
  const recommendations = media.recommendations?.results || [];

  // Best logo in English or without language tag
  const logo =
    media.images?.logos?.find(
      (l: any) => l.iso_639_1 === "en" || !l.iso_639_1
    ) || media.images?.logos?.[0];

  // Best trailer
  const trailerVideo =
    media.videos?.results?.find(
      (v: any) =>
        (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
    ) || media.videos?.results?.find((v: any) => v.site === "YouTube");

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

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
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

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-white/30 pb-32 font-sans">
      {/* Navigation (Top Left) */}
      <Link
        href="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#161618]/70 backdrop-blur-3xl border border-white/[0.18] text-white/80 hover:text-white hover:bg-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)] active:scale-90 transition-all duration-200 ease-out"
        aria-label="Go back"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 mr-0.5" strokeWidth={2.2} />
      </Link>

      {/* Audio / Mute Control (Top Right) */}
      <button
        onClick={() => {
          setIsMuted(!isMuted);
          triggerToast(isMuted ? "Audio enabled" : "Audio muted");
        }}
        className="absolute top-6 right-6 md:top-8 md:right-8 z-50 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#161618]/70 backdrop-blur-3xl border border-white/[0.18] text-white/80 hover:text-white hover:bg-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.22)] active:scale-90 transition-all duration-200 ease-out cursor-pointer"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.2} />
        ) : (
          <Volume2 className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.2} />
        )}
      </button>

      {/* Hero Section (Exact Match to User Reference) */}
      <div className="relative w-full min-h-[75vh] md:min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-end overflow-hidden">
        {/* Full-bleed Cinematic Backdrop */}
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent w-full md:w-4/5" />
            <div className="absolute inset-0 bg-black/15" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#1a1a1c] to-black" />
        )}

        {/* Hero Content (Positioned at Lower-Left) */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px] pb-12 md:pb-16 pt-32">
          <div className="max-w-xl md:max-w-2xl flex flex-col items-start">
            {/* Title / Movie Logo */}
            {logo?.file_path ? (
              <div className="relative h-20 sm:h-24 md:h-28 lg:h-32 w-64 sm:w-80 md:w-96 mb-5">
                <Image
                  src={getImageUrl(logo.file_path, "original")}
                  alt={title}
                  fill
                  className="object-contain object-left-bottom drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)]"
                  priority
                />
              </div>
            ) : (
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.9)] mb-4">
                {title}
              </h1>
            )}

            {/* Metadata Line: ★ 6 · 2026 · 1h 55m · Family · Fantasy · Comedy */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13.5px] md:text-[14px] text-white/80 font-medium mb-3.5 select-none">
              {ratingValue > 0 && (
                <span className="text-white font-bold flex items-center gap-1">
                  <span className="text-amber-400">★</span>
                  <span>{ratingFormatted}</span>
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
              {genresList.length > 0 && (
                <>
                  <span className="text-white/40">·</span>
                  <span className="text-white/75">{genresList.join("  ·  ")}</span>
                </>
              )}
            </div>

            {/* Synopsis / Overview */}
            {media.overview && (
              <p className="text-[13.5px] sm:text-[14.5px] md:text-[15.5px] text-white/85 leading-relaxed font-normal line-clamp-3 md:line-clamp-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-6 max-w-xl md:max-w-2xl">
                {media.overview}
              </p>
            )}

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 select-none">
              {/* 1. Play Button */}
              <button
                onClick={() => {
                  if (trailerVideo) {
                    setIsTrailerOpen(true);
                  } else {
                    triggerToast("No trailer video preview found");
                  }
                }}
                className="flex items-center gap-2 bg-white text-black font-semibold text-[14px] sm:text-[15px] px-6 sm:px-7 py-2.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.1)] hover:bg-white/95 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </button>

              {/* 2. Add to Watchlist (+) Button */}
              <button
                onClick={toggleWatchlist}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#161618]/70 hover:bg-white/[0.15] border border-white/[0.18] shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] text-white active:scale-90 transition-all duration-200 backdrop-blur-2xl cursor-pointer"
                title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                aria-label="Add to Watchlist"
              >
                {isInWatchlist ? (
                  <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={2.2} />
                )}
              </button>

              {/* 3. Download Button */}
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#161618]/70 hover:bg-white/[0.15] border border-white/[0.18] shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] text-white text-[13.5px] sm:text-[14px] font-medium active:scale-95 transition-all duration-200 backdrop-blur-2xl cursor-pointer"
              >
                {isDownloaded ? (
                  <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.2} />
                ) : (
                  <Download className="w-4 h-4" strokeWidth={2.2} />
                )}
                <span>{isDownloaded ? "Downloaded" : "Download"}</span>
              </button>

              {/* 4. Similars Button */}
              <button
                onClick={scrollToSimilar}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#161618]/70 hover:bg-white/[0.15] border border-white/[0.18] shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] text-white text-[13.5px] sm:text-[14px] font-medium active:scale-95 transition-all duration-200 backdrop-blur-2xl cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={2.2} />
                <span>Similars</span>
              </button>
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
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#161618]/80 hover:bg-white/[0.15] border border-white/[0.18] rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all backdrop-blur-2xl shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-90"
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
      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px] mt-10 md:mt-14">
        {/* TV Episodes Section (matching user's reference image) */}
        {type === "tv" && media.seasons && (
          <div className="mb-16 md:mb-20">
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
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                Cast
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.slice(0, 6).map((person: any) => (
                <div
                  key={person.id}
                  className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-white/5 border border-white/5"
                >
                  {person.profile_path ? (
                    <Image
                      src={getImageUrl(person.profile_path, "w500")}
                      alt={person.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/20">
                      <User className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-3.5">
                    <p className="font-bold text-sm text-white line-clamp-1">
                      {person.name}
                    </p>
                    <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                      {person.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations / Similar Titles Section */}
        {recommendations.length > 0 && (
          <div id="similar-section" className="mb-24 scroll-mt-24">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-8 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>More Like This</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
