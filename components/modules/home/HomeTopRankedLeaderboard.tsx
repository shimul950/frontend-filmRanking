"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMovie } from "@/src/types/movie.types";
import { formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import { MovieTrailerModal } from "@/components/modules/dashboard/movie/MovieTrailerModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Play, Film, ArrowRight } from "lucide-react";

interface HomeTopRankedLeaderboardProps {
    movies: IMovie[];
}

export function HomeTopRankedLeaderboard({ movies = [] }: HomeTopRankedLeaderboardProps) {
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<IMovie | null>(null);

    // Sort by rating or fallback
    const top10 = [...movies]
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0) || b.releaseYear - a.releaseYear)
        .slice(0, 10);

    if (top10.length === 0) return null;

    return (
        <section className="bg-muted/30 border-y border-border py-14">
            <div className="container mx-auto px-4 max-w-7xl space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
                            <Trophy className="h-4 w-4" />
                            <span>Hall of Fame</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                            Top 10 Ranked Movies
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            The highest rated cinematic masterworks voted by our verified film critic community.
                        </p>
                    </div>

                    <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                        <Link href="/movies" className="flex items-center gap-1.5">
                            <span>View Full Leaderboard</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </Button>
                </div>

                {/* Top 10 Billboard Grid / Scroll */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {top10.map((movie, index) => {
                        const rank = index + 1;
                        return (
                            <div
                                key={movie.id}
                                className="group relative flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1.5"
                            >
                                {/* Poster with Rank Badge */}
                                <div className="relative aspect-[2/3] w-full bg-muted overflow-hidden">
                                    {movie.posterUrl ? (
                                        <Image
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="220px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                            <Film className="h-8 w-8" />
                                        </div>
                                    )}

                                    {/* Dark Vignette */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                                    {/* Stylized Rank Number Overlaid */}
                                    <div className="absolute bottom-1 left-2 font-black text-5xl sm:text-6xl text-white/90 drop-shadow-lg tracking-tighter select-none font-mono">
                                        #{rank}
                                    </div>

                                    {/* Rating badge */}
                                    <div className="absolute top-2.5 right-2.5">
                                        <Badge
                                            variant="outline"
                                            className="bg-black/75 border-amber-500/50 text-amber-300 font-bold text-xs px-2 py-0.5 backdrop-blur-md"
                                        >
                                            <Star className="h-3 w-3 fill-amber-400 mr-1 text-amber-400" />
                                            {formatRating(movie.averageRating)}
                                        </Badge>
                                    </div>

                                    {/* Hover Trailer Button */}
                                    {movie.youtubeLink && (
                                        <button
                                            onClick={() => setSelectedTrailerMovie(movie)}
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                                            aria-label="Play Trailer"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50">
                                                <Play className="h-4 w-4 fill-current ml-0.5" />
                                            </div>
                                        </button>
                                    )}
                                </div>

                                {/* Text Info */}
                                <div className="p-3.5 flex flex-1 flex-col justify-between gap-2">
                                    <div>
                                        <Link href={`/movies/${movie.id}`}>
                                            <h3 className="font-bold text-card-foreground text-sm tracking-tight line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                {movie.title}
                                            </h3>
                                        </Link>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">
                                            {movie.releaseYear} • Dir. {movie.director}
                                        </p>
                                    </div>

                                    <Button
                                        asChild
                                        size="sm"
                                        variant="secondary"
                                        className="w-full text-xs h-7 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors"
                                    >
                                        <Link href={`/movies/${movie.id}`}>Explore Film</Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Trailer Modal */}
            <MovieTrailerModal
                isOpen={!!selectedTrailerMovie}
                onClose={() => setSelectedTrailerMovie(null)}
                title={selectedTrailerMovie?.title || ""}
                trailerUrl={selectedTrailerMovie?.youtubeLink}
            />
        </section>
    );
}
