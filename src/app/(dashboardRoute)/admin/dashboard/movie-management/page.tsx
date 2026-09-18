import { Metadata } from "next";
import { getAllMoviesAction } from "./_action/getAllMovies.action";
import { getAllGenresAction } from "../genre-management/_action/getAllGenres.action";
import { getAllPlatformsAction } from "../platform-management/_action/getAllPlatforms.action";
import { MovieManagementView } from "@/components/modules/dashboard/movie/MovieManagementView";

export const metadata: Metadata = {
    title: "Movie Management | Cinema Hub Admin",
    description: "Manage movies, official trailers, community reviews, ratings, and streaming platforms.",
};

export const dynamic = "force-dynamic";

export default async function MovieManagementPage() {
    const [moviesResult, genres, platforms] = await Promise.all([
        getAllMoviesAction({ limit: 50 }),
        getAllGenresAction(),
        getAllPlatformsAction(),
    ]);

    const initialMovies = moviesResult?.data || [];

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            <MovieManagementView
                initialMovies={initialMovies}
                genres={genres || []}
                platforms={platforms || []}
            />
        </div>
    );
}
