"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IMovie } from "@/src/types/movie.types";
import { IGenre } from "@/src/types/genre.types";
import { IPlatform } from "@/src/types/platform.types";
import { calculateMovieStats } from "./movie-helpers";
import { MovieCard } from "./MovieCard";
import { MovieTable } from "./MovieTable";
import { CreateMovieDialog } from "./CreateMovieDialog";
import { EditMovieDialog } from "./EditMovieDialog";
import { DeleteMovieDialog } from "./DeleteMovieDialog";
import { MovieDetailsDialog } from "./MovieDetailsDialog";
import { SeedMoviesModal } from "./SeedMoviesModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Film,
    Plus,
    Search,
    LayoutGrid,
    List,
    Star,
    MessageSquare,
    Sparkles,
    RefreshCw,
    SlidersHorizontal,
} from "lucide-react";

interface MovieManagementViewProps {
    initialMovies: IMovie[];
    genres: IGenre[];
    platforms: IPlatform[];
}

export function MovieManagementView({
    initialMovies,
    genres,
    platforms,
}: MovieManagementViewProps) {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenreFilter, setSelectedGenreFilter] = useState("all");
    const [selectedPlatformFilter, setSelectedPlatformFilter] = useState("all");
    const [sortBy, setSortBy] = useState<"rating" | "year" | "title" | "reviews">("rating");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    // Dialog state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSeedOpen, setIsSeedOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<IMovie | null>(null);
    const [deletingMovie, setDeletingMovie] = useState<IMovie | null>(null);
    const [inspectingMovie, setInspectingMovie] = useState<IMovie | null>(null);

    const stats = useMemo(() => calculateMovieStats(initialMovies), [initialMovies]);

    // Filtering and sorting
    const filteredMovies = useMemo(() => {
        let result = [...initialMovies];

        // Search query
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            result = result.filter(
                (m) =>
                    m.title.toLowerCase().includes(query) ||
                    m.director?.toLowerCase().includes(query) ||
                    m.cast?.some((actor) => actor.toLowerCase().includes(query)) ||
                    m.synopsis?.toLowerCase().includes(query)
            );
        }

        // Genre filter
        if (selectedGenreFilter !== "all") {
            result = result.filter((m) =>
                m.genres?.some(
                    (g) => g.genreId === selectedGenreFilter || g.genre?.id === selectedGenreFilter
                )
            );
        }

        // Platform filter
        if (selectedPlatformFilter !== "all") {
            result = result.filter((m) =>
                m.platforms?.some(
                    (p) => p.platformId === selectedPlatformFilter || p.platform?.id === selectedPlatformFilter
                )
            );
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return (b.averageRating || 0) - (a.averageRating || 0);
                case "year":
                    return b.releaseYear - a.releaseYear;
                case "reviews":
                    return (b.reviewCount || 0) - (a.reviewCount || 0);
                case "title":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

        return result;
    }, [initialMovies, searchTerm, selectedGenreFilter, selectedPlatformFilter, sortBy]);

    const handleRefresh = () => {
        router.refresh();
    };

    return (
        <div className="space-y-6">
            {/* Header with Title and Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500 mb-1">
                        <Film className="h-4 w-4" />
                        <span>Content Management System</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                        Movie Management
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        Manage titles, cinema trailers, community reviews, ratings, and streaming availability.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        className="border-border bg-background text-muted-foreground hover:text-foreground text-xs h-9"
                    >
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsSeedOpen(true)}
                        className="border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs h-9 font-semibold"
                    >
                        <Sparkles className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                        Seed Movies (10+ per Genre)
                    </Button>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-600/30 h-9 px-4"
                    >
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add New Movie
                    </Button>
                </div>
            </div>

            {/* KPI Metric Summary Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
                        <span>Total Catalog</span>
                        <Film className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="text-2xl font-black text-white">{stats.totalMovies}</div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                        Films registered in hub
                    </span>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
                        <span>Average Rating</span>
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black text-amber-400">
                        {stats.averageRating > 0 ? stats.averageRating : "—"}
                        <span className="text-xs text-zinc-500 font-normal ml-1">/ 5.0</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                        Audience score index
                    </span>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
                        <span>Reviews & Notes</span>
                        <MessageSquare className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-black text-white">{stats.totalReviews}</div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                        Community discussions
                    </span>
                </div>

                <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md">
                    <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-1">
                        <span>Catalog Tiers</span>
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="text-sm font-bold text-zinc-200 mt-1 flex items-center gap-2">
                        <span className="text-emerald-400">{stats.freeCount} Free</span>
                        <span>•</span>
                        <span className="text-amber-400">{stats.premiumCount} Premium</span>
                    </div>
                    <span className="text-[11px] text-zinc-500 mt-1 block">
                        Access tier breakdown
                    </span>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* Search Input */}
                    <div className="relative w-full md:flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search by title, director, cast, or plot..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-zinc-950 border-white/10 text-white text-xs h-9"
                        />
                    </div>

                    {/* Genre Filter */}
                    <div className="w-full md:w-44">
                        <Select
                            value={selectedGenreFilter}
                            onValueChange={setSelectedGenreFilter}
                        >
                            <SelectTrigger className="bg-zinc-950 border-white/10 text-white text-xs h-9">
                                <SelectValue placeholder="All Genres" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white text-xs">
                                <SelectItem value="all">All Genres</SelectItem>
                                {genres.map((g) => (
                                    <SelectItem key={g.id} value={g.id}>
                                        {g.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Platform Filter */}
                    <div className="w-full md:w-44">
                        <Select
                            value={selectedPlatformFilter}
                            onValueChange={setSelectedPlatformFilter}
                        >
                            <SelectTrigger className="bg-zinc-950 border-white/10 text-white text-xs h-9">
                                <SelectValue placeholder="All Platforms" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white text-xs">
                                <SelectItem value="all">All Platforms</SelectItem>
                                {platforms.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="w-full md:w-44">
                        <Select
                            value={sortBy}
                            onValueChange={(val: "rating" | "year" | "title" | "reviews") =>
                                setSortBy(val)
                            }
                        >
                            <SelectTrigger className="bg-zinc-950 border-white/10 text-white text-xs h-9">
                                <SlidersHorizontal className="h-3 w-3 mr-1.5 text-zinc-400" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-950 border-white/10 text-white text-xs">
                                <SelectItem value="rating">Rating (Highest)</SelectItem>
                                <SelectItem value="year">Release Year (Newest)</SelectItem>
                                <SelectItem value="reviews">Most Reviewed</SelectItem>
                                <SelectItem value="title">Title (A - Z)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1 border border-white/10 rounded-xl p-1 bg-zinc-950 self-end md:self-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode("grid")}
                            className={`h-7 w-7 rounded-lg ${
                                viewMode === "grid"
                                    ? "bg-zinc-800 text-white"
                                    : "text-zinc-500 hover:text-white"
                            }`}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setViewMode("table")}
                            className={`h-7 w-7 rounded-lg ${
                                viewMode === "table"
                                    ? "bg-zinc-800 text-white"
                                    : "text-zinc-500 hover:text-white"
                            }`}
                        >
                            <List className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                {/* Filter info indicator */}
                {(searchTerm || selectedGenreFilter !== "all" || selectedPlatformFilter !== "all") && (
                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                        <span>
                            Showing {filteredMovies.length} of {initialMovies.length} movies
                        </span>
                        <button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedGenreFilter("all");
                                setSelectedPlatformFilter("all");
                            }}
                            className="text-red-400 hover:underline text-[11px]"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>

            {/* Movie Content (Grid or Table) */}
            {viewMode === "grid" ? (
                filteredMovies.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30">
                        <Film className="h-12 w-12 text-zinc-600 mb-3" />
                        <h3 className="text-base font-bold text-white">No Movies Found</h3>
                        <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
                            No films match your search or active filters. Clear your filters or add a new movie to the catalog.
                        </p>
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-red-600 text-white hover:bg-red-700 text-xs font-semibold"
                        >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add First Movie
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredMovies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onViewDetails={(m) => setInspectingMovie(m)}
                                onEdit={(m) => setEditingMovie(m)}
                                onDelete={(m) => setDeletingMovie(m)}
                            />
                        ))}
                    </div>
                )
            ) : (
                <MovieTable
                    movies={filteredMovies}
                    onViewDetails={(m) => setInspectingMovie(m)}
                    onEdit={(m) => setEditingMovie(m)}
                    onDelete={(m) => setDeletingMovie(m)}
                />
            )}

            {/* Dialogs */}
            <SeedMoviesModal
                isOpen={isSeedOpen}
                onClose={() => setIsSeedOpen(false)}
                existingMovies={initialMovies}
                genres={genres}
                platforms={platforms}
                onSuccess={handleRefresh}
            />

            <CreateMovieDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                genres={genres}
                platforms={platforms}
                onSuccess={handleRefresh}
            />

            <EditMovieDialog
                isOpen={!!editingMovie}
                onClose={() => setEditingMovie(null)}
                movie={editingMovie}
                genres={genres}
                platforms={platforms}
                onSuccess={handleRefresh}
            />

            <DeleteMovieDialog
                isOpen={!!deletingMovie}
                onClose={() => setDeletingMovie(null)}
                movie={deletingMovie}
                onSuccess={handleRefresh}
            />

            <MovieDetailsDialog
                isOpen={!!inspectingMovie}
                onClose={() => setInspectingMovie(null)}
                movie={inspectingMovie}
                onMovieUpdated={handleRefresh}
            />
        </div>
    );
}
