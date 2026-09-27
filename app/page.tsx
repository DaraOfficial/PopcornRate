import { getPopularMovies, searchMedia, getNowPlayingMovies, getPopularTVShows, getMediaImages, TMDBError, getTrending, getOnTheAirTVShows, getStreamingMovies, getForRentMovies, getFreeMovies, getFreeTVShows } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import HeroSlider from '@/components/HeroSlider';
import TrendingRow from '@/components/TrendingRow';
import LatestTrailersRow from '@/components/LatestTrailersRow';
import WhatsPopularRow from '@/components/WhatsPopularRow';
import FreeToWatchRow from '@/components/FreeToWatchRow';
import { AlertCircle, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q;
  
  let searchResults = [];
  let popularMovies = [];
  let nowPlaying = [];
  let popularTVShows = [];
  let trendingToday = [];
  let trendingWeek = [];
  let onTheAir = [];
  let streaming = [];
  let forRent = [];
  let freeMovies = [];
  let freeTv = [];
  let errorMsg = null;

  try {
    if (query) {
      const data = await searchMedia(query);
      searchResults = data?.results || [];
    } else {
      const settled = await Promise.allSettled([
        getPopularMovies(),
        getNowPlayingMovies(),
        getPopularTVShows(),
        getTrending('day'),
        getTrending('week'),
        getOnTheAirTVShows(),
        getStreamingMovies(),
        getForRentMovies(),
        getFreeMovies(),
        getFreeTVShows()
      ]);

      const getResults = (res: PromiseSettledResult<any>) => (res.status === 'fulfilled' ? res.value?.results || [] : []);

      popularMovies = getResults(settled[0]);
      nowPlaying = getResults(settled[1]);
      popularTVShows = getResults(settled[2]);
      trendingToday = getResults(settled[3]);
      trendingWeek = getResults(settled[4]);
      onTheAir = getResults(settled[5]);
      streaming = getResults(settled[6]);
      forRent = getResults(settled[7]);
      freeMovies = getResults(settled[8]);
      freeTv = getResults(settled[9]);

      const allFailed = settled.every((r) => r.status === 'rejected');
      if (allFailed) {
        const firstErr: any = settled[0].status === 'rejected' ? settled[0].reason : null;
        errorMsg = firstErr instanceof TMDBError ? firstErr.message : "Failed to fetch media from TMDB.";
      }

      // Fetch logos for top 5 nowPlaying items for the Hero Slider
      const top5NowPlaying = nowPlaying.filter((m: any) => m.backdrop_path).slice(0, 5);
      await Promise.all(top5NowPlaying.map(async (item: any) => {
        try {
          const type = item.media_type || (item.name ? 'tv' : 'movie');
          const images = await getMediaImages(item.id, type);
          if (images.logos && images.logos.length > 0) {
            // Find English logo or the first available one
            const enLogo = images.logos.find((l: any) => l.iso_639_1 === 'en');
            item.logo_path = (enLogo || images.logos[0]).file_path;
          }
        } catch {
          // Ignore if logo fetch fails
        }
      }));
    }
  } catch (err: any) {
    errorMsg = err instanceof TMDBError ? err.message : "Failed to fetch media.";
  }

  return (
    <>
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        
        {/* Apple TV+ Style Hero Slider (Edge-to-edge, only show when not searching) */}
        {!query && nowPlaying.length > 0 && (
          <div className="w-full">
            <HeroSlider items={nowPlaying.filter((m: any) => m.backdrop_path)} />
          </div>
        )}

        <div className={`container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1440px] relative z-20 ${!query ? '-mt-6 md:-mt-10 pt-2' : 'pt-24 mt-8 md:mt-12'}`}>
          {errorMsg ? (
            <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20 max-w-2xl mx-auto flex gap-4 items-start text-red-400 backdrop-blur-xl mb-12">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-red-300">Configuration Required</h3>
                <p className="text-sm">{errorMsg}</p>
                <p className="text-sm mt-2">
                  To fix this, go to your project settings and add a valid <strong>TMDB_API_KEY</strong> secret.
                </p>
              </div>
            </div>
          ) : query ? (
            <div className="space-y-8 mb-24">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                  Search Results for &ldquo;{query}&rdquo;
                </h2>
              </div>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-24 text-white/50">
                  No movies or shows found matching &quot;{query}&quot;. Try a different search term.
                </div>
              ) : (
                <div className="poster-grid">
                  {searchResults.map((item: any) => (
                    <MovieCard key={item.id} movie={item} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12 md:space-y-16 mb-24">
              <TrendingRow today={trendingToday} week={trendingWeek} />
              <LatestTrailersRow 
                popular={popularMovies}
                inTheaters={nowPlaying} 
              />
              <WhatsPopularRow 
                streaming={streaming}
                inTheaters={nowPlaying} 
              />
              <FreeToWatchRow 
                movies={freeMovies} 
                tv={freeTv} 
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
