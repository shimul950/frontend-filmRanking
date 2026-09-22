import { Metadata } from "next";
import { getMovies } from "./movies/_action";
import { getPublicReviewsAction } from "./reviews/_action/getPublicReviews.action";
import { IMovie, IReview } from "@/src/types/movie.types";
import { HomeHeroBanner } from "@/components/modules/home/HomeHeroBanner";
import { HomeStatsBanner } from "@/components/modules/home/HomeStatsBanner";
import { HomeMovieCarousel } from "@/components/modules/home/HomeMovieCarousel";
import { HomeTopRankedLeaderboard } from "@/components/modules/home/HomeTopRankedLeaderboard";
import { HomeGenreExplorer } from "@/components/modules/home/HomeGenreExplorer";
import { HomeCommunityReviews } from "@/components/modules/home/HomeCommunityReviews";
import { HomeWebSeriesSection } from "@/components/modules/home/HomeWebSeriesSection";
import { getWebSeries } from "./web-series/_action/getWebSeries.action";
import { IWebSeries } from "@/src/types/webSeries.types";
import { getAllBannersAction } from "../(dashboardRoute)/admin/dashboard/banner-management/_action/getAllBanners.action";
import { IBanner } from "@/src/types/banner.types";

export const metadata: Metadata = {
    title: "FILMRANK | Modern Movie Rating & Cinema Directory",
    description:
        "Discover top-rated cinematic masterpieces, watch official trailers, read community critic reviews, and track your favorite movies.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
    let movies: IMovie[] = [];
    let reviews: IReview[] = [];
    let webSeries: IWebSeries[] = [];
    let banners: IBanner[] = [];

    try {
        const [rawRes, reviewsRes, seriesRes, bannersRes] = await Promise.all([
            getMovies({ limit: 100 }),
            getPublicReviewsAction({ limit: 6, sortBy: "createdAt", sortOrder: "desc" }),
            getWebSeries({ limit: 10 }),
            getAllBannersAction({ isActive: true }),
        ]);

        const payload = rawRes?.data;
        if (Array.isArray(payload)) {
            movies = payload;
        } else if (payload && "data" in payload && Array.isArray((payload as { data: IMovie[] }).data)) {
            movies = (payload as { data: IMovie[] }).data;
        }

        reviews = reviewsRes?.data || [];
        webSeries = seriesRes?.data || [];
        banners = bannersRes || [];
    } catch {
        movies = [];
        reviews = [];
        webSeries = [];
        banners = [];
    }

    return (
        <main className="min-h-screen space-y-2 pb-12">
            {/* 1. Hero Banner Slider */}
            <HomeHeroBanner databaseMovies={movies} initialBanners={banners} />

            {/* 2. Platform Stats Strip */}
            <HomeStatsBanner movieCount={movies.length} />

            {/* 3. Curated Movie Shelves (Trending / Top-Rated / Recent / Free) */}
            <HomeMovieCarousel movies={movies} />

            {/* 4. Original Web Series Shelf */}
            <HomeWebSeriesSection series={webSeries} />

            {/* 5. Billboard Top 10 Ranked Movies */}
            <HomeTopRankedLeaderboard movies={movies} />

            {/* 6. Mood / Genre Explorer */}
            <HomeGenreExplorer />

            {/* 7. Critic & Community Reviews Showcase */}
            <HomeCommunityReviews reviews={reviews} />
        </main>
    );
}
