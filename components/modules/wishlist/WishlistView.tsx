"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMovie, IWatchlistItem } from "@/src/types/movie.types";
import { useWishlist } from "@/hooks/useWishlist";
import { useMovieLikes } from "@/hooks/useMovieLikes";
import { formatDuration, formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import { MovieTrailerModal } from "@/components/modules/dashboard/movie/MovieTrailerModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Bookmark,
    Heart,
    Star,
    Play,
    Trash2,
    Search,
    Film,
    Clock,
    Sparkles,
    LayoutGrid,
    List,
    ArrowRight,
    Tag as TagIcon,
    Tv,
    TrendingUp,
    ShieldCheck,
} from "lucide-react";

interface WishlistViewProps {
    initialItems: IWatchlistItem[];
}

export function WishlistView({ initialItems }: WishlistViewProps) {
    const { wishlist, toggleWishlist, isToggling } = useWishlist();
    const { isLiked, toggleLike } = useMovieLikes();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPricing, setSelectedPricing] = useState<"ALL" | "FREE" | "PREMIUM">("ALL");
    const [sortBy, setSortBy] = useState<"recent" | "rating" | "duration" | "year">("recent");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<IMovie | null>(null);

    // Prefer live cache from useWishlist if available, falling back to server-provided items
    const rawItems = wishlist && wishlist.length > 0 ? wishlist : initialItems;

    // Filter and sort items
    const filteredItems = useMemo(() => {
        let items = rawItems.filter((item) => !!item.media);

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            items = items.filter(
                (item) =>
                    item.media.title?.toLowerCase().includes(q) ||
                    item.media.director?.toLowerCase().includes(q) ||
                    item.media.genres?.some((g) => g.genre?.name.toLowerCase().includes(q))
            );
        }

        if (selectedPricing !== "ALL") {
            items = items.filter((item) => item.media.pricing === selectedPricing);
        }

        return [...items].sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return (b.media.averageRating || 0) - (a.media.averageRating || 0);
                case "duration":
                    return (b.media.duration || 0) - (a.media.duration || 0);
                case "year":
                    return (b.media.releaseYear || 0) - (a.media.releaseYear || 0);
                case "recent":
                default:
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
        });
    }, [rawItems, searchTerm, selectedPricing, sortBy]);

    // Derived statistics for the header
    const stats = useMemo(() => {
        const total = rawItems.length;
        const totalDurationMinutes = rawItems.reduce((acc, item) => acc + (item.media?.duration || 0), 0);
        const hours = Math.floor(totalDurationMinutes / 60);
        const mins = totalDurationMinutes % 60;
        const avgRating =
            total > 0
                ? rawItems.reduce((acc, item) => acc + (item.media?.averageRating || 0), 0) / total
                : 0;
        const freeCount = rawItems.filter((item) => item.media?.pricing === "FREE").length;
        const premiumCount = rawItems.filter((item) => item.media?.pricing === "PREMIUM").length;

        return {
            total,
            durationString: total > 0 ? `${hours}h ${mins}m` : "0h",
            avgRating: formatRating(avgRating),
            freeCount,
            premiumCount,
        };
    }, [rawItems]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 dark:bg-zinc-950/70 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                            <Bookmark className="h-3.5 w-3.5 fill-current" />
                            <span>Personal Cinema Queue</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            My Cinema Wishlist
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                            Your saved collection of cinematic masterworks. Track watch time, stream trailers, and prepare for your next movie night.
                        </p>
                    </div>

                    {/* Action button */}
                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-red-600/25 transition-all"
                        >
                            <Link href="/movies" className="flex items-center gap-1.5">
                                <Film className="h-4 w-4" />
                                <span>Browse More Movies</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/60">
                    <div className="p-4 rounded-2xl bg-muted/40 dark:bg-zinc-900/50 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <Film className="h-3.5 w-3.5 text-red-500" />
                            <span>Saved Movies</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{stats.total}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/40 dark:bg-zinc-900/50 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <Clock className="h-3.5 w-3.5 text-amber-500" />
                            <span>Total Watch Time</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{stats.durationString}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/40 dark:bg-zinc-900/50 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>Average Rating</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{stats.avgRating} / 5.0</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/40 dark:bg-zinc-900/50 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            <span>Access Breakdown</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                            <span className="text-emerald-500">{stats.freeCount} Free</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-amber-400">{stats.premiumCount} Prem</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Controls Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search saved movies, genres, directors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-background text-xs h-10 rounded-xl"
                    />
                </div>

                {/* Filters, Sorters & View Switcher */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Pricing filter */}
                    <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-xs font-semibold">
                        <button
                            onClick={() => setSelectedPricing("ALL")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                                selectedPricing === "ALL"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            All ({rawItems.length})
                        </button>
                        <button
                            onClick={() => setSelectedPricing("FREE")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                                selectedPricing === "FREE"
                                    ? "bg-background text-emerald-500 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Free ({stats.freeCount})
                        </button>
                        <button
                            onClick={() => setSelectedPricing("PREMIUM")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                                selectedPricing === "PREMIUM"
                                    ? "bg-background text-amber-500 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Premium ({stats.premiumCount})
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        aria-label="Sort movies"
                        className="h-9 px-3 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground outline-none cursor-pointer"
                    >
                        <option value="recent">Recently Added</option>
                        <option value="rating">Highest Rated</option>
                        <option value="duration">Longest Duration</option>
                        <option value="year">Release Year</option>
                    </select>

                    {/* View Switcher */}
                    <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-muted-foreground">
                        <button
                            onClick={() => setViewMode("grid")}
                            title="Grid View"
                            aria-label="Grid View"
                            className={`p-1.5 rounded-lg transition-all ${
                                viewMode === "grid"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "hover:text-foreground"
                            }`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            title="List View"
                            aria-label="List View"
                            className={`p-1.5 rounded-lg transition-all ${
                                viewMode === "list"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "hover:text-foreground"
                            }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Movie Collection Container */}
            {filteredItems.length === 0 ? (
                <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 dark:bg-zinc-900/30 space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
                        <Bookmark className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">
                            {rawItems.length === 0
                                ? "Your Wishlist is Empty"
                                : "No Matching Saved Movies"}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                            {rawItems.length === 0
                                ? "You haven't added any movies to your queue yet. Explore the cinema catalog and click the bookmark button on any movie!"
                                : "No saved movies match your current search and filter settings. Try clearing the filters."}
                        </p>
                    </div>

                    <div className="pt-2">
                        {rawItems.length === 0 ? (
                            <Button
                                asChild
                                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-lg shadow-red-600/25"
                            >
                                <Link href="/movies" className="inline-flex items-center gap-2">
                                    <span>Explore Movies Catalog</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedPricing("ALL");
                                }}
                                className="text-xs h-9 rounded-xl"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            ) : viewMode === "grid" ? (
                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredItems.map((item) => {
                        const movie = item.media;
                        const liked = isLiked(movie.id);
                        const genresList = movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];
                        const platformsList = movie.platforms?.map((p) => p.platform?.name || "").filter(Boolean) || [];

                        return (
                            <div
                                key={item.id || movie.id}
                                className="group flex flex-col rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl dark:hover:shadow-red-950/25 overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/40"
                            >
                                {/* Poster Area */}
                                <div className="relative aspect-[2/3] w-full bg-muted dark:bg-zinc-950 overflow-hidden">
                                    {movie.posterUrl ? (
                                        <Image
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-muted-foreground font-bold">
                                            <Film className="h-10 w-10 mb-2 opacity-40" />
                                            <span className="text-xs line-clamp-1">{movie.title}</span>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/60" />

                                    {/* Badges on poster */}
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

                                    {/* Remove button & Like button floating */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                                        {/* Like toggle */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleLike(movie.id, movie.title);
                                            }}
                                            title={liked ? "Unlike" : "Like movie"}
                                            aria-label="Toggle Like"
                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-zinc-200 hover:text-red-400 transition"
                                        >
                                            <Heart
                                                className={`h-3.5 w-3.5 ${
                                                    liked ? "fill-red-600 text-red-600" : ""
                                                }`}
                                            />
                                        </button>

                                        {/* Quick Remove from Wishlist */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleWishlist(movie);
                                            }}
                                            disabled={isToggling}
                                            title="Remove from wishlist"
                                            aria-label="Remove from Wishlist"
                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/80 hover:bg-red-600 backdrop-blur-md text-white transition shadow-md"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>

                                    {/* Trailer button */}
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

                                {/* Content Details */}
                                <div className="flex flex-1 flex-col justify-between p-4 gap-3">
                                    <div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-1">
                                            <span>{movie.releaseYear}</span>
                                            <span>•</span>
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

                                    {/* Genres & Platforms */}
                                    <div className="space-y-1.5">
                                        {genresList.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {genresList.slice(0, 2).map((g) => (
                                                    <Badge
                                                        key={g}
                                                        variant="secondary"
                                                        className="text-[10px] px-1.5 py-0"
                                                    >
                                                        <TagIcon className="h-2 w-2 mr-1 text-red-500" />
                                                        {g}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {platformsList.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {platformsList.slice(0, 2).map((p) => (
                                                    <Badge
                                                        key={p}
                                                        variant="outline"
                                                        className="border-cyan-500/30 text-cyan-500 text-[10px] px-1.5 py-0"
                                                    >
                                                        <Tv className="h-2 w-2 mr-1" />
                                                        {p}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action footer */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                                        {movie.youtubeLink ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedTrailerMovie(movie)}
                                                className="h-7 px-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-600/20"
                                            >
                                                <Play className="h-3 w-3 fill-current mr-1" />
                                                Trailer
                                            </Button>
                                        ) : (
                                            <span className="text-[11px] text-muted-foreground">In Watchlist</span>
                                        )}

                                        <Button
                                            asChild
                                            size="sm"
                                            className="h-7 px-3 bg-zinc-900 text-zinc-50 hover:bg-red-600 hover:text-white dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-red-600 text-xs rounded-lg transition-colors"
                                        >
                                            <Link href={`/movies/${movie.id}`}>Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* LIST VIEW */
                <div className="space-y-3">
                    {filteredItems.map((item) => {
                        const movie = item.media;
                        const liked = isLiked(movie.id);
                        const genresList = movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];

                        return (
                            <div
                                key={item.id || movie.id}
                                className="group flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-28 w-20 sm:h-24 sm:w-16 shrink-0 rounded-xl overflow-hidden bg-muted">
                                    {movie.posterUrl ? (
                                        <Image
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Film className="h-6 w-6 opacity-40" />
                                        </div>
                                    )}
                                </div>

                                {/* Content Details */}
                                <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <Link href={`/movies/${movie.id}`}>
                                            <h3 className="font-bold text-foreground text-sm hover:text-red-500 transition-colors">
                                                {movie.title}
                                            </h3>
                                        </Link>
                                        <Badge
                                            variant="outline"
                                            className="bg-amber-500/10 border-amber-500/30 text-amber-500 text-[10px] px-1.5 py-0"
                                        >
                                            ★ {formatRating(movie.averageRating)}
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="text-[10px] px-1.5 py-0"
                                        >
                                            {movie.pricing}
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                        {movie.synopsis}
                                    </p>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-muted-foreground pt-1">
                                        <span>{movie.releaseYear}</span>
                                        <span>•</span>
                                        <span>{formatDuration(movie.duration)}</span>
                                        {genresList.length > 0 && (
                                            <>
                                                <span>•</span>
                                                <span>{genresList.slice(0, 3).join(", ")}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Row Actions */}
                                <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                                    {movie.youtubeLink && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedTrailerMovie(movie)}
                                            className="h-8 px-3 text-xs gap-1.5 rounded-xl text-red-500 border-red-500/30 hover:bg-red-500/10"
                                        >
                                            <Play className="h-3.5 w-3.5 fill-current" />
                                            <span>Trailer</span>
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleLike(movie.id, movie.title)}
                                        title={liked ? "Unlike" : "Like"}
                                        className="h-8 w-8 rounded-xl text-muted-foreground hover:text-red-500"
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${
                                                liked ? "fill-red-500 text-red-500" : ""
                                            }`}
                                        />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleWishlist(movie)}
                                        disabled={isToggling}
                                        title="Remove from wishlist"
                                        className="h-8 w-8 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        asChild
                                        size="sm"
                                        className="h-8 px-3.5 rounded-xl bg-zinc-900 text-zinc-50 hover:bg-red-600 text-xs dark:bg-zinc-800"
                                    >
                                        <Link href={`/movies/${movie.id}`}>Details</Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Trailer Modal */}
            <MovieTrailerModal
                isOpen={!!selectedTrailerMovie}
                onClose={() => setSelectedTrailerMovie(null)}
                title={selectedTrailerMovie?.title || ""}
                trailerUrl={selectedTrailerMovie?.youtubeLink}
            />
        </div>
    );
}
