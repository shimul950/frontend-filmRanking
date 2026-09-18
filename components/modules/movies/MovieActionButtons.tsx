"use client";

import { IMovie } from "@/src/types/movie.types";
import { useWishlist } from "@/hooks/useWishlist";
import { useMovieLikes } from "@/hooks/useMovieLikes";
import { Bookmark, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MovieActionButtonsProps {
    movie: IMovie;
    variant?: "floating" | "toolbar" | "hero";
    className?: string;
    showLabels?: boolean;
}

export function MovieActionButtons({
    movie,
    variant = "floating",
    className,
    showLabels = false,
}: MovieActionButtonsProps) {
    const { isWishlisted, toggleWishlist, isToggling } = useWishlist();
    const { isLiked, toggleLike } = useMovieLikes();

    const wishlisted = isWishlisted(movie.id);
    const liked = isLiked(movie.id);

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(movie);
    };

    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(movie.id, movie.title);
    };

    if (variant === "hero") {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                {/* Hero Wishlist Button */}
                <Button
                    onClick={handleWishlistClick}
                    variant={wishlisted ? "default" : "outline"}
                    size="sm"
                    disabled={isToggling}
                    className={cn(
                        "h-10 px-4 rounded-xl text-xs font-bold transition-all gap-2",
                        wishlisted
                            ? "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/25 border-amber-400"
                            : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-white/10 hover:border-amber-500/40 hover:text-white"
                    )}
                >
                    {isToggling ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Bookmark
                            className={cn(
                                "h-4 w-4 transition-transform group-hover:scale-110",
                                wishlisted ? "fill-current" : ""
                            )}
                        />
                    )}
                    <span>{wishlisted ? "In Wishlist" : "Add to Wishlist"}</span>
                </Button>

                {/* Hero Like Button */}
                <Button
                    onClick={handleLikeClick}
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-10 px-4 rounded-xl text-xs font-bold transition-all gap-2",
                        liked
                            ? "bg-red-500/20 text-red-400 border-red-500/40 shadow-lg shadow-red-500/20"
                            : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-white/10 hover:border-red-500/40 hover:text-red-400"
                    )}
                >
                    <Heart
                        className={cn(
                            "h-4 w-4 transition-transform active:scale-125",
                            liked ? "fill-red-500 text-red-500" : ""
                        )}
                    />
                    <span>{liked ? "Liked" : "Like Movie"}</span>
                </Button>
            </div>
        );
    }

    if (variant === "toolbar") {
        return (
            <div className={cn("flex items-center gap-1.5", className)}>
                {/* Wishlist button */}
                <button
                    onClick={handleWishlistClick}
                    disabled={isToggling}
                    title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    aria-label="Toggle Wishlist"
                    className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all",
                        wishlisted
                            ? "bg-amber-500/20 text-amber-400 dark:text-amber-300 border border-amber-500/30"
                            : "text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                    )}
                >
                    {isToggling ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Bookmark
                            className={cn("h-3.5 w-3.5", wishlisted ? "fill-current" : "")}
                        />
                    )}
                    {showLabels && <span>{wishlisted ? "Saved" : "Wishlist"}</span>}
                </button>

                {/* Like button */}
                <button
                    onClick={handleLikeClick}
                    title={liked ? "Unlike" : "Like"}
                    aria-label="Toggle Like"
                    className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all",
                        liked
                            ? "bg-red-500/20 text-red-500 border border-red-500/30"
                            : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    )}
                >
                    <Heart className={cn("h-3.5 w-3.5", liked ? "fill-current" : "")} />
                    {showLabels && <span>{liked ? "Liked" : "Like"}</span>}
                </button>
            </div>
        );
    }

    // Default: Floating glassmorphic corner controls
    return (
        <div
            className={cn(
                "flex items-center gap-1.5 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 shadow-lg",
                className
            )}
        >
            {/* Wishlist Button */}
            <button
                onClick={handleWishlistClick}
                disabled={isToggling}
                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-label="Toggle Wishlist"
                className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
                    wishlisted
                        ? "bg-amber-500 text-black shadow-md shadow-amber-500/40 scale-105"
                        : "text-zinc-200 hover:text-amber-300 hover:bg-white/10"
                )}
            >
                {isToggling ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <Bookmark
                        className={cn("h-3.5 w-3.5", wishlisted ? "fill-current" : "")}
                    />
                )}
            </button>

            {/* Like Button */}
            <button
                onClick={handleLikeClick}
                title={liked ? "Unlike movie" : "Like movie"}
                aria-label="Toggle Like"
                className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
                    liked
                        ? "bg-red-600 text-white shadow-md shadow-red-600/40 scale-105"
                        : "text-zinc-200 hover:text-red-400 hover:bg-white/10"
                )}
            >
                <Heart className={cn("h-3.5 w-3.5", liked ? "fill-current" : "")} />
            </button>
        </div>
    );
}
