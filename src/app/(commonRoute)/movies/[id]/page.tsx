import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSingleMovieAction } from "@/src/app/(dashboardRoute)/admin/dashboard/movie-management/_action/getSingleMovie.action";
import { getMovieReviewsAction } from "../_actions/social.action";
import { MovieDetailsView } from "@/components/modules/movies/MovieDetailsView";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const movie = await getSingleMovieAction(id);

    if (!movie) {
        return {
            title: "Movie Details | Cinema Hub",
            description: "Explore cast, trailer, synopsis, and community reviews.",
        };
    }

    return {
        title: `${movie.title} (${movie.releaseYear}) | Cinema Hub`,
        description: movie.synopsis || `Explore ${movie.title} trailer, ratings, and reviews on FilmRank.`,
    };
}

export default async function MovieDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [movie, reviews] = await Promise.all([
        getSingleMovieAction(id),
        getMovieReviewsAction(id),
    ]);

    if (!movie) {
        notFound();
    }

    return <MovieDetailsView movie={movie} initialReviews={reviews || []} />;
}