import Image from 'next/image';
import Link from 'next/link';
import PopcornRating from '@/components/PopcornRating';
import { getImageUrl } from '@/lib/tmdb';

interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: 'movie' | 'tv' | 'person';
}

export default function MovieCard({ movie }: { movie: Media }) {
  if (!movie || !movie.id || movie.media_type === 'person') return null;

  const title = movie.title || movie.name || 'Untitled';
  const dateStr = movie.release_date || movie.first_air_date;
  
  let formattedDate = '';
  if (dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(date.getTime())) {
        formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } else {
      formattedDate = dateStr;
    }
  }

  const type = movie.media_type || (movie.name ? 'tv' : 'movie');

  return (
    <Link 
      href={`/${type}/${movie.id}`} 
      className="group flex flex-col gap-2 sm:gap-2.5 md:gap-3 w-full select-none cursor-pointer focus:outline-none"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#161618] border border-white/[0.09] shadow-[0_4px_16px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.12)] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-white/25 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] group-active:scale-[0.97]">
        <Image
          src={getImageUrl(movie.poster_path)}
          alt={title}
          fill
          referrerPolicy="no-referrer"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 480px) 48vw, (max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1536px) 18vw, 14vw"
        />
      </div>
      
      <div className="flex flex-col gap-0.5 sm:gap-1 px-0.5 sm:px-1">
        <h3 className="line-clamp-1 text-[13px] min-[400px]:text-[14px] sm:text-[15px] font-semibold tracking-tight text-white group-hover:text-white/90 transition-colors leading-snug">
          {title}
        </h3>
        <div className="flex items-center justify-between gap-1.5 text-[11.5px] min-[400px]:text-[12.5px] sm:text-[13.5px] text-white/50 font-medium">
          <span className="truncate">{formattedDate}</span>
          <PopcornRating 
            rating={movie.vote_average} 
            compact 
            className="shrink-0 w-3.5 h-3.5 text-[11.5px] min-[400px]:text-[12px] sm:text-[13px] text-white font-semibold" 
          />
        </div>
      </div>
    </Link>
  );
}
