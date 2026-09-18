import { Metadata } from "next";
import { getMovies } from "./movies/_action";
import { IMovie } from "@/src/types/movie.types";
import { HomeHeroBanner } from "@/components/modules/home/HomeHeroBanner";
import { HomeStatsBanner } from "@/components/modules/home/HomeStatsBanner";
import { HomeMovieCarousel } from "@/components/modules/home/HomeMovieCarousel";
import { HomeTopRankedLeaderboard } from "@/components/modules/home/HomeTopRankedLeaderboard";
import { HomeGenreExplorer } from "@/components/modules/home/HomeGenreExplorer";
import { HomeCommunityReviews } from "@/components/modules/home/HomeCommunityReviews";

export const metadata: Metadata = {
    title: "FILMRANK | Modern Movie Rating & Cinema Directory",
    description:
        "Discover top-rated cinematic masterpieces, watch official trailers, read community critic reviews, and track your favorite movies.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
    let movies: IMovie[] = [];

    try {
        const rawRes = await getMovies({ limit: 100 });
        const payload = rawRes?.data;
        if (Array.isArray(payload)) {
            movies = payload;
        } else if (payload && "data" in payload && Array.isArray((payload as { data: IMovie[] }).data)) {
            movies = (payload as { data: IMovie[] }).data;
        }
    } catch {
        movies = [];
    }

    return (
        <main className="min-h-screen space-y-2 pb-12">
            {/* 1. Hero Banner Slider */}
            <HomeHeroBanner databaseMovies={movies} />

            {/* 2. Platform Stats Strip */}
            <HomeStatsBanner movieCount={movies.length} />

            {/* 3. Curated Movie Shelves (Trending / Top-Rated / Recent / Free) */}
            <HomeMovieCarousel movies={movies} />

            {/* 4. Billboard Top 10 Ranked Movies */}
            <HomeTopRankedLeaderboard movies={movies} />

            {/* 5. Mood / Genre Explorer */}
            <HomeGenreExplorer />

            {/* 6. Critic & Community Reviews Showcase */}
            <HomeCommunityReviews />
        </main>
    );
}
