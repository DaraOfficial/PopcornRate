import { discoverTV } from '@/lib/tmdb';
import DiscoverGrid from '@/components/DiscoverGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TV Shows - Popcorn Rate',
  description: 'Discover popular TV shows, filter by streaming providers.',
};

export default async function TVShowsPage() {
  const initialData = await discoverTV({
    sort_by: 'popularity.desc',
    watch_region: 'US',
    'vote_count.gte': 100
  });

  return <DiscoverGrid type="tv" initialData={initialData} title="Explore TV Shows" />;
}
