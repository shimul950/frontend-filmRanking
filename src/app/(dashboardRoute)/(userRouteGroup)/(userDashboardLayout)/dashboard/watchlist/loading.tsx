import { MovieGridSkeleton } from "@/components/modules/movies/MovieGridSkeleton";

export default function UserWatchlistLoading() {
  return <MovieGridSkeleton cardCount={8} showFilters={false} />;
}
