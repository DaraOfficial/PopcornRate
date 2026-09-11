import { discoverMovies } from '@/lib/tmdb';
import DiscoverGrid from '@/components/DiscoverGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Movies - Popcorn Rate',
  description: 'Discover popular movies, filter by streaming providers.',
};

export default async function MoviesPage() {
  const initialData = await discoverMovies({
    sort_by: 'popularity.desc',
    watch_region: 'US',
    'vote_count.gte': 100
  });

  return <DiscoverGrid type="movie" initialData={initialData} title="Explore Movies" />;
}
