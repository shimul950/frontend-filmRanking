import { IMovie, IMovieStats } from "@/src/types/movie.types";

/**
 * Parses YouTube video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=YoHD9XEInc0
 * - https://youtu.be/YoHD9XEInc0
 * - https://www.youtube.com/embed/YoHD9XEInc0
 * - https://youtube.com/shorts/YoHD9XEInc0
 */
export function getYouTubeVideoId(url?: string | null): string | null {
    if (!url) return null;

    const trimmed = url.trim();

    // Standard watch URL: youtube.com/watch?v=ID
    const watchMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
        return watchMatch[1];
    }

    return null;
}

/**
 * Returns an embeddable YouTube URL with clean playback parameters.
 */
export function getYouTubeEmbedUrl(url?: string | null, autoplay = true): string | null {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    const autoplayParam = autoplay ? "1" : "0";
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplayParam}&rel=0&modestbranding=1&enablejsapi=1`;
}

/**
 * Formats duration in minutes to hours and minutes (e.g. 148 -> "2h 28m")
 */
export function formatDuration(minutes?: number | null): string {
    if (!minutes || minutes <= 0) return "N/A";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
}

/**
 * Formats average rating to 1 decimal place or "N/A"
 */
export function formatRating(rating?: number | null): string {
    if (typeof rating !== "number" || isNaN(rating) || rating <= 0) {
        return "Unrated";
    }
    return rating.toFixed(1);
}

/**
 * Computes aggregate movie stats for the dashboard summary banner
 */
export function calculateMovieStats(movies: IMovie[]): IMovieStats {
    if (!movies || movies.length === 0) {
        return {
            totalMovies: 0,
            averageRating: 0,
            totalReviews: 0,
            freeCount: 0,
            premiumCount: 0,
        };
    }

    let totalRatingSum = 0;
    let ratedMoviesCount = 0;
    let totalReviews = 0;
    let freeCount = 0;
    let premiumCount = 0;

    for (const movie of movies) {
        if (movie.averageRating && movie.averageRating > 0) {
            totalRatingSum += movie.averageRating;
            ratedMoviesCount++;
        }
        totalReviews += movie.reviewCount || 0;
        if (movie.pricing === "PREMIUM") {
            premiumCount++;
        } else {
            freeCount++;
        }
    }

    const avgRating = ratedMoviesCount > 0 ? totalRatingSum / ratedMoviesCount : 0;

    return {
        totalMovies: movies.length,
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalReviews,
        freeCount,
        premiumCount,
    };
}
