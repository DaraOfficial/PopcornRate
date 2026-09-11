import { getTVDetails, getSeasonDetails, TMDBError } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import MediaDetail from '@/components/MediaDetail';

export default async function TVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let show;
  let errorMsg = null;

  try {
    show = await getTVDetails(id);
  } catch (err: any) {
    if (err instanceof TMDBError && (err.status === 404 || err.message.includes('404'))) {
      notFound();
    }
    errorMsg = err instanceof TMDBError ? err.message : "Failed to load TV show details.";
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="rounded-2xl bg-red-500/10 p-6 border border-red-500/20 max-w-xl flex flex-col gap-4 items-center text-red-400 backdrop-blur-xl">
          <AlertCircle className="h-8 w-8 text-red-400" />
          <p className="text-white/80">{errorMsg}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white bg-[#161618]/70 hover:bg-white/[0.12] border border-white/[0.18] shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] px-5 py-2.5 rounded-full backdrop-blur-2xl transition-all duration-200 active:scale-95 font-medium select-none">
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  if (!show) {
    notFound();
  }

  let initialSeasonData = null;
  if (show && show.seasons && Array.isArray(show.seasons)) {
    const firstSeason = show.seasons.find((s: any) => s.season_number > 0)?.season_number || 1;
    try {
      initialSeasonData = await getSeasonDetails(id, firstSeason);
    } catch {
      // Non-blocking fallback to client fetch
    }
  }

  return <MediaDetail media={show} type="tv" initialSeasonData={initialSeasonData} />;
}


