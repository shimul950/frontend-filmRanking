
import { Suspense } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getMovies, getPublicGenresAction } from "./_action";
import MoviesList from "@/components/modules/movies/moviesList";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

function MoviesLoadingFallback() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-7xl flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-red-600 dark:text-red-500" />
            <span className="text-xs font-semibold">Loading movie catalog...</span>
        </div>
    );
}

export default async function moviesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["movies"],
        queryFn: () => getMovies({ limit: 100 }),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MoviesLoadingFallback />}>
                <MoviesList />
            </Suspense>
        </HydrationBoundary>
    );
}

