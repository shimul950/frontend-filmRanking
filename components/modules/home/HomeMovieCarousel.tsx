"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMovie } from "@/src/types/movie.types";
import { formatDuration, formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import { MovieTrailerModal } from "@/components/modules/dashboard/movie/MovieTrailerModal";
import { MovieActionButtons } from "@/components/modules/movies/MovieActionButtons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Star,
    Play,
    ChevronLeft,
    ChevronRight,
    Film,
    Flame,
    TrendingUp,
    Sparkles,
    Gift,
} from "lucide-react";

interface HomeMovieCarouselProps {
    movies: IMovie[];
}

export function HomeMovieCarousel({ movies = [] }: HomeMovieCarouselProps) {
    const [activeTab, setActiveTab] = useState<"trending" | "top-rated" | "latest" | "free">("trending");
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<IMovie | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Derive tabbed collections
    const filteredMovies = (() => {
        if (!movies.length) return [];
        switch (activeTab) {
            case "top-rated":
                return [...movies].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
            case "latest":
                return [...movies].sort((a, b) => (b.releaseYear || 0) - (a.releaseYear || 0));
            case "free":
                return movies.filter((m) => m.pricing === "FREE");
            case "trending":
            default:
                return [...movies].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        }
    })();

    const handleScroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -400 : 400;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    const tabs = [
        { id: "trending", label: "Trending This Week", icon: Flame },
        { id: "top-rated", label: "Highest Rated", icon: Star },
        { id: "latest", label: "New & Recent", icon: TrendingUp },
        { id: "free", label: "Free to Watch", icon: Gift },
    ] as const;

    return (
        <section className="container mx-auto px-4 py-12 max-w-7xl space-y-6">
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500 mb-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Curated Selections</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        Featured Cinema Shelves
                    </h2>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-muted/60 border border-border">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    isActive
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-red-500" : ""}`} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative group/carousel">
                {/* Left Arrow */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScroll("left")}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border-border bg-background/90 hover:bg-background shadow-xl text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                {/* Movies Grid / Horizontal Scroll */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {filteredMovies.slice(0, 15).map((movie) => {
                        const genreName = movie.genres?.[0]?.genre?.name || "Cinema";
                        return (
                            <div
                                key={movie.id}
                                className="snap-start shrink-0 w-[240px] sm:w-[260px] group flex flex-col rounded-2xl border border-border/80 dark:border-white/10 bg-card dark:bg-zinc-900/60 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-red-950/25 hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1.5"
                            >
                                {/* Poster Image */}
                                <div className="relative aspect-[2/3] w-full bg-muted dark:bg-zinc-950 overflow-hidden">
                                    {movie.posterUrl ? (
                                        <Image
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="260px"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-muted-foreground font-bold">
                                            <Film className="h-10 w-10 mb-2 text-muted-foreground/60" />
                                            <span className="text-xs line-clamp-1">{movie.title}</span>
                                        </div>
                                    )}

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/60" />

                                    {/* Badges on Poster */}
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                        <Badge
                                            variant="outline"
                                            className="bg-black/75 border-amber-500/40 text-amber-300 font-bold text-xs px-2 py-0.5 backdrop-blur-sm"
                                        >
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                                            {formatRating(movie.averageRating)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className={
                                                movie.pricing === "PREMIUM"
                                                    ? "bg-amber-500/25 border-amber-500/40 text-amber-300 text-[10px] backdrop-blur-sm"
                                                    : "bg-emerald-500/25 border-emerald-500/40 text-emerald-300 text-[10px] backdrop-blur-sm"
                                            }
                                        >
                                            {movie.pricing}
                                        </Badge>
                                    </div>

                                    {/* Wishlist & Like Floating Action Buttons */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <MovieActionButtons movie={movie} variant="floating" />
                                    </div>

                                    {/* Play Trailer Button on Hover */}
                                    {movie.youtubeLink && (
                                        <button
                                            onClick={() => setSelectedTrailerMovie(movie)}
                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                                            aria-label="Play Trailer"
                                        >
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50">
                                                <Play className="h-5 w-5 fill-current ml-0.5" />
                                            </div>
                                        </button>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="p-4 flex flex-1 flex-col justify-between gap-3">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground font-medium mb-1">
                                            <span>{movie.releaseYear}</span>
                                            <span>{formatDuration(movie.duration)}</span>
                                        </div>

                                        <Link href={`/movies/${movie.id}`}>
                                            <h3 className="font-bold text-card-foreground tracking-tight line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                {movie.title}
                                            </h3>
                                        </Link>

                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                                            {movie.synopsis}
                                        </p>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/60 dark:border-white/5">
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px] px-2 py-0.5 bg-secondary text-secondary-foreground"
                                        >
                                            {genreName}
                                        </Badge>

                                        <div className="flex items-center gap-1.5">
                                            {movie.youtubeLink && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedTrailerMovie(movie)}
                                                    className="h-7 px-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-600/20"
                                                >
                                                    <Play className="h-3 w-3 fill-current mr-1" />
                                                    Trailer
                                                </Button>
                                            )}

                                            <Button
                                                asChild
                                                size="sm"
                                                className="h-7 px-2.5 bg-zinc-900 text-zinc-50 hover:bg-red-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-red-600 text-xs rounded-lg transition-colors"
                                            >
                                                <Link href={`/movies/${movie.id}`}>Details</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Arrow */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleScroll("right")}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full border-border bg-background/90 hover:bg-background shadow-xl text-foreground opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:flex"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
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
