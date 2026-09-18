import { MovieGridSkeleton } from "@/components/modules/movies/MovieGridSkeleton";

export default function MoviesLoading() {
  return <MovieGridSkeleton cardCount={12} showFilters={true} />;
}
