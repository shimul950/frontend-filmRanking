"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/src/app/(commonRoute)/movies/_action";
import { IMovie } from "@/src/types/movie.types";
import { formatDuration, formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import { MovieTrailerModal } from "@/components/modules/dashboard/movie/MovieTrailerModal";
import { MovieActionButtons } from "./MovieActionButtons";
import { MovieGridSkeleton } from "./MovieGridSkeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    Search,
    Star,
    Play,
    Loader2,
    Tag as TagIcon,
    Tv,
    MessageSquare,
    X,
    SlidersHorizontal,
    Sparkles,
    Flame,
    Clapperboard,
    Compass,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Layers,
    Smile,
    Ghost,
    Heart,
    Sword,
} from "lucide-react";

// Standard genre icon and color mapping
const GENRE_ICON_MAP: Record<string, { icon: typeof Flame; color: string }> = {
    Action: { icon: Flame, color: "text-red-500" },
    "Sci-Fi": { icon: Sparkles, color: "text-cyan-500" },
    Drama: { icon: Clapperboard, color: "text-amber-500" },
    Thriller: { icon: Compass, color: "text-purple-500" },
    Animation: { icon: Star, color: "text-pink-500" },
    Comedy: { icon: Smile, color: "text-emerald-500" },
    Horror: { icon: Ghost, color: "text-zinc-400" },
    Romance: { icon: Heart, color: "text-rose-500" },
    Adventure: { icon: Sword, color: "text-blue-500" },
    Crime: { icon: Compass, color: "text-violet-500" },
};

function matchesGenre(movie: IMovie, targetGenre: string): boolean {
    if (!targetGenre || targetGenre.toLowerCase() === "all") return true;
    const cleanTarget = targetGenre.toLowerCase().trim();

    // 1. Direct match on movie.genres relation
    const directMatch = movie.genres?.some((g) => {
        const cleanMovie = (g.genre?.name || "").toLowerCase().trim();
        if (cleanMovie === cleanTarget) return true;
        if (cleanMovie.includes(cleanTarget) || cleanTarget.includes(cleanMovie)) return true;

        const normMovie = cleanMovie.replace(/[^a-z0-9]/g, "");
        const normTarget = cleanTarget.replace(/[^a-z0-9]/g, "");

        if (
            (normTarget === "scifi" || normTarget === "sciencefiction") &&
            (normMovie.includes("scifi") || normMovie.includes("sciencefiction"))
        ) {
            return true;
        }
        if (
            (normTarget === "animation" || normTarget === "animated") &&
            (normMovie.includes("animation") || normMovie.includes("animated"))
        ) {
            return true;
        }
        if (
            (normTarget === "romance" || normTarget === "romantic") &&
            (normMovie.includes("romance") || normMovie.includes("romantic"))
        ) {
            return true;
        }
        if (
            (normTarget === "thriller" || normTarget === "suspense") &&
            (normMovie.includes("thriller") || normMovie.includes("suspense"))
        ) {
            return true;
        }
        return false;
    });

    if (directMatch) return true;

    // 2. Keyword fallback for genres where movies may have thematic metadata
    const normTarget = cleanTarget.replace(/[^a-z0-9]/g, "");
    if (normTarget === "scifi" || normTarget === "sciencefiction") {
        const text = `${movie.title} ${movie.synopsis || ""}`.toLowerCase();
        if (
            text.includes("sci-fi") ||
            text.includes("science fiction") ||
            text.includes("cyberpunk") ||
            text.includes("multiverse") ||
            text.includes("cyber-intelligence") ||
            text.includes("matrix") ||
            text.includes("dimensions") ||
            text.includes("space journey") ||
            text.includes("interstellar") ||
            text.includes("futuristic") ||
            text.includes("robot") ||
            text.includes("alien")
        ) {
            return true;
        }
    }

    return false;
}

export default function MoviesList() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read URL search params
    const genreParam = searchParams.get("genre") || "all";
    const queryParam = searchParams.get("search") || "";
    const sortParam = searchParams.get("sort") || "rating";
    const pricingParam = searchParams.get("pricing") || "all";
    const pageParam = parseInt(searchParams.get("page") || "1", 10);

    // Local state synchronized with URL params
    const [searchTerm, setSearchTerm] = useState(queryParam);
    const [selectedGenre, setSelectedGenre] = useState(genreParam);
    const [sortBy, setSortBy] = useState<string>(sortParam);
    const [pricingFilter, setPricingFilter] = useState<string>(pricingParam);
    const [currentPage, setCurrentPage] = useState<number>(pageParam > 0 ? pageParam : 1);
    const [pageSize, setPageSize] = useState<number>(12);
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<IMovie | null>(null);

    // Sync state when URL params change (e.g. user clicked genre in Navbar)
    useEffect(() => {
        setSelectedGenre(genreParam);
    }, [genreParam]);

    useEffect(() => {
        setSearchTerm(queryParam);
    }, [queryParam]);

    useEffect(() => {
        if (sortParam) setSortBy(sortParam);
    }, [sortParam]);

    useEffect(() => {
        if (pricingParam) setPricingFilter(pricingParam);
    }, [pricingParam]);

    useEffect(() => {
        if (pageParam > 0) setCurrentPage(pageParam);
    }, [pageParam]);

    // Update URL query parameters helper
    const updateUrlParams = (updates: {
        genre?: string;
        search?: string;
        sort?: string;
        pricing?: string;
        page?: number;
    }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (updates.genre !== undefined) {
            if (updates.genre && updates.genre !== "all") {
                params.set("genre", updates.genre);
            } else {
                params.delete("genre");
            }
        }

        if (updates.search !== undefined) {
            if (updates.search.trim()) {
                params.set("search", updates.search.trim());
            } else {
                params.delete("search");
            }
        }

        if (updates.sort !== undefined) {
            if (updates.sort && updates.sort !== "rating") {
                params.set("sort", updates.sort);
            } else {
                params.delete("sort");
            }
        }

        if (updates.pricing !== undefined) {
            if (updates.pricing && updates.pricing !== "all") {
                params.set("pricing", updates.pricing);
            } else {
                params.delete("pricing");
            }
        }

        if (updates.page !== undefined) {
            if (updates.page > 1) {
                params.set("page", updates.page.toString());
            } else {
                params.delete("page");
            }
        }

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
            scroll: false,
        });
    };

    // Debounce search input
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            setCurrentPage(1);
            updateUrlParams({ search: value, page: 1 });
        }, 350);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setCurrentPage(1);
        updateUrlParams({ search: "", page: 1 });
    };

    // Handle genre selection
    const handleGenreSelect = (genreName: string) => {
        const newGenre = selectedGenre.toLowerCase() === genreName.toLowerCase() ? "all" : genreName;
        setSelectedGenre(newGenre);
        setCurrentPage(1);
        updateUrlParams({ genre: newGenre, page: 1 });
    };

    // Handle sort change
    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        setCurrentPage(1);
        updateUrlParams({ sort: newSort, page: 1 });
    };

    // Handle pricing filter change
    const handlePricingChange = (newPricing: string) => {
        setPricingFilter(newPricing);
        setCurrentPage(1);
        updateUrlParams({ pricing: newPricing, page: 1 });
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        updateUrlParams({ page: newPage });
        window.scrollTo({ top: 180, behavior: "smooth" });
    };

    // Reset all filters
    const handleResetAllFilters = () => {
        setSearchTerm("");
        setSelectedGenre("all");
        setSortBy("rating");
        setPricingFilter("all");
        setCurrentPage(1);
        router.replace(pathname, { scroll: false });
    };

    // Fetch movies: requests limit: 100 so all movies in database are retrieved
    const { data: rawData, isLoading, isFetching } = useQuery({
        queryKey: ["movies"],
        queryFn: () => getMovies({ limit: 100 }),
    });

    // Extract movies list safely
    const payload = rawData?.data;
    const allMovies: IMovie[] = useMemo(() => {
        if (Array.isArray(payload)) return payload;
        if (payload && "data" in (payload as object) && Array.isArray((payload as { data: IMovie[] }).data)) {
            return (payload as { data: IMovie[] }).data;
        }
        return [];
    }, [payload]);

    const databaseTotal =
        rawData?.meta?.total ||
        (payload && "meta" in (payload as object)
            ? ((payload as { meta?: { total?: number } }).meta?.total ?? allMovies.length)
            : allMovies.length);

    // Extract all unique genres present in loaded movies
    const { availableGenres, genreCounts } = useMemo(() => {
        const counts: Record<string, number> = {};
        const genreSet = new Set<string>();

        allMovies.forEach((movie) => {
            movie.genres?.forEach((g) => {
                const name = g.genre?.name?.trim();
                if (name) {
                    genreSet.add(name);
                }
            });
        });

        // Collect all distinct genres that exist in the database plus standards
        const allCandidates = Array.from(
            new Set([
                ...Array.from(genreSet),
                "Action",
                "Sci-Fi",
                "Drama",
                "Thriller",
                "Animation",
                "Comedy",
                "Crime",
                "Horror",
                "Romance",
                "Adventure",
                "Fantasy",
            ])
        );

        allCandidates.forEach((cand) => {
            counts[cand] = allMovies.filter((m) => matchesGenre(m, cand)).length;
        });

        // Show genres that have movies or are in the database
        const sortedList = allCandidates
            .filter((g) => (counts[g] || 0) > 0 || genreSet.has(g))
            .sort((a, b) => {
                const countA = counts[a] || 0;
                const countB = counts[b] || 0;
                if (countB !== countA) return countB - countA;
                return a.localeCompare(b);
            });

        return { availableGenres: sortedList, genreCounts: counts };
    }, [allMovies]);

    // Filter movies based on Genre, Search, and Pricing
    const filteredMovies = useMemo(() => {
        return allMovies.filter((movie) => {
            // 1. Genre filter
            if (selectedGenre && selectedGenre.toLowerCase() !== "all") {
                if (!matchesGenre(movie, selectedGenre)) return false;
            }

            // 2. Pricing filter
            if (pricingFilter !== "all" && movie.pricing !== pricingFilter) {
                return false;
            }

            // 3. Search filter
            if (searchTerm.trim()) {
                const q = searchTerm.toLowerCase().trim();
                const titleMatch = movie.title.toLowerCase().includes(q);
                const directorMatch = movie.director?.toLowerCase().includes(q);
                const synopsisMatch = movie.synopsis?.toLowerCase().includes(q);
                const castMatch = movie.cast?.some((actor) => actor.toLowerCase().includes(q));
                const genreMatch = movie.genres?.some((g) =>
                    (g.genre?.name || "").toLowerCase().includes(q)
                );

                if (!titleMatch && !directorMatch && !synopsisMatch && !castMatch && !genreMatch) {
                    return false;
                }
            }

            return true;
        });
    }, [allMovies, selectedGenre, pricingFilter, searchTerm]);

    // Sort movies
    const sortedMovies = useMemo(() => {
        const result = [...filteredMovies];
        switch (sortBy) {
            case "rating":
                result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
            case "newest":
                result.sort((a, b) => b.releaseYear - a.releaseYear);
                break;
            case "oldest":
                result.sort((a, b) => a.releaseYear - b.releaseYear);
                break;
            case "reviews":
                result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                break;
            case "title":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "duration":
                result.sort((a, b) => (b.duration || 0) - (a.duration || 0));
                break;
            default:
                result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
                break;
        }
        return result;
    }, [filteredMovies, sortBy]);

    // Pagination calculations
    const totalItems = sortedMovies.length;
    const effectivePageSize = pageSize === 0 ? totalItems : pageSize;
    const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

    const paginatedMovies = useMemo(() => {
        if (pageSize === 0) return sortedMovies;
        const start = (safeCurrentPage - 1) * pageSize;
        return sortedMovies.slice(start, start + pageSize);
    }, [sortedMovies, safeCurrentPage, pageSize]);

    const isFiltered =
        (selectedGenre && selectedGenre.toLowerCase() !== "all") ||
        pricingFilter !== "all" ||
        Boolean(searchTerm.trim());

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
            {/* Header banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500 mb-1">
                        <Film className="h-4 w-4" />
                        <span>Cinema Directory</span>
                        <Badge
                            variant="secondary"
                            className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0"
                        >
                            {databaseTotal} Movies in Catalog
                        </Badge>
                    </div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">
                        Explore Movies & Trailers
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Discover cinematic masterpieces, watch official trailers, filter by your favorite genres, and join the community discussion.
                    </p>
                </div>

                {/* Search Bar with clear button */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search movies, genres, directors, cast..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 pr-9 bg-background dark:bg-zinc-900/90 border-border text-foreground text-xs h-10 rounded-xl shadow-sm focus-visible:ring-red-500/30"
                    />
                    {searchTerm && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label="Clear search"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* GENRE PILLS CAROUSEL / FILTER BAR */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <TagIcon className="h-3.5 w-3.5 text-red-500" />
                        <span>Filter by Genre</span>
                    </span>
                    {selectedGenre && selectedGenre.toLowerCase() !== "all" && (
                        <button
                            onClick={() => handleGenreSelect("all")}
                            className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw className="h-3 w-3" />
                            <span>Show All Genres</span>
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted">
                    {/* "All" button */}
                    <Link
                        href="/movies"
                        onClick={(e) => {
                            e.preventDefault();
                            handleGenreSelect("all");
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                            selectedGenre.toLowerCase() === "all"
                                ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30 font-bold"
                                : "bg-card/70 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                        }`}
                    >
                        <Layers className="h-3.5 w-3.5" />
                        <span>All Movies</span>
                        <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                selectedGenre.toLowerCase() === "all"
                                    ? "bg-white/25 text-white"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            {allMovies.length}
                        </span>
                    </Link>

                    {/* Genre buttons */}
                    {availableGenres.map((gName) => {
                        const count = genreCounts[gName] || 0;
                        const isSelected = selectedGenre.toLowerCase() === gName.toLowerCase();
                        const genreInfo = GENRE_ICON_MAP[gName];
                        const Icon = genreInfo?.icon || TagIcon;

                        return (
                            <Link
                                key={gName}
                                href={`/movies?genre=${encodeURIComponent(gName)}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleGenreSelect(gName);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                                    isSelected
                                        ? "bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30 font-bold"
                                        : "bg-card/70 border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-red-500/40"
                                }`}
                            >
                                <Icon
                                    className={`h-3.5 w-3.5 ${
                                        isSelected ? "text-white" : genreInfo?.color || "text-muted-foreground"
                                    }`}
                                />
                                <span>{gName}</span>
                                {count > 0 && (
                                    <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                            isSelected
                                                ? "bg-white/25 text-white"
                                                : "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* CONTROL TOOLBAR: Pricing, Sorting, Items per page, and Active Filter Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/80 bg-muted/20 dark:bg-zinc-900/40 backdrop-blur-sm">
                {/* Left side: Results Count & Active Filter Indicator */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-foreground">
                        {sortedMovies.length}{" "}
                        <span className="text-muted-foreground font-normal">
                            {sortedMovies.length === 1 ? "movie found" : "movies found"}
                        </span>
                    </span>

                    {/* Active genre badge */}
                    {selectedGenre && selectedGenre.toLowerCase() !== "all" && (
                        <Badge
                            variant="secondary"
                            className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 gap-1 pl-2 pr-1 py-0.5"
                        >
                            <span>Genre: {selectedGenre}</span>
                            <button
                                onClick={() => handleGenreSelect("all")}
                                className="hover:bg-red-500/20 rounded-full p-0.5 transition cursor-pointer"
                                aria-label="Remove genre filter"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}

                    {/* Active search badge */}
                    {searchTerm.trim() && (
                        <Badge
                            variant="secondary"
                            className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 gap-1 pl-2 pr-1 py-0.5"
                        >
                            <span>Search: &ldquo;{searchTerm}&rdquo;</span>
                            <button
                                onClick={handleClearSearch}
                                className="hover:bg-blue-500/20 rounded-full p-0.5 transition cursor-pointer"
                                aria-label="Remove search filter"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}

                    {/* Active pricing badge */}
                    {pricingFilter !== "all" && (
                        <Badge
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 gap-1 pl-2 pr-1 py-0.5"
                        >
                            <span>Pricing: {pricingFilter}</span>
                            <button
                                onClick={() => handlePricingChange("all")}
                                className="hover:bg-amber-500/20 rounded-full p-0.5 transition cursor-pointer"
                                aria-label="Remove pricing filter"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}

                    {isFiltered && (
                        <button
                            onClick={handleResetAllFilters}
                            className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1 cursor-pointer"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {/* Right side: Pricing tabs + Sort Dropdown + Items Per Page */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
                    {/* Pricing Filter Buttons */}
                    <div className="inline-flex rounded-xl border border-border bg-background dark:bg-zinc-900 p-0.5 text-xs">
                        <button
                            onClick={() => handlePricingChange("all")}
                            className={`px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer ${pricingFilter === "all"
                                    ? "bg-red-600 text-white shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handlePricingChange("FREE")}
                            className={`px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer ${pricingFilter === "FREE"
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Free
                        </button>
                        <button
                            onClick={() => handlePricingChange("PREMIUM")}
                            className={`px-2.5 py-1 rounded-lg transition font-semibold cursor-pointer ${pricingFilter === "PREMIUM"
                                    ? "bg-amber-600 text-white shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Premium
                        </button>
                    </div>

                    {/* Sort Dropdown */}
                    <Select value={sortBy} onValueChange={handleSortChange}>
                        <SelectTrigger className="h-8 w-[140px] text-xs rounded-xl bg-background dark:bg-zinc-900 border-border">
                            <SlidersHorizontal className="h-3 w-3 mr-1 text-muted-foreground" />
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border bg-popover">
                            <SelectItem value="rating" className="text-xs">
                                Top Rated
                            </SelectItem>
                            <SelectItem value="newest" className="text-xs">
                                Newest First
                            </SelectItem>
                            <SelectItem value="oldest" className="text-xs">
                                Oldest First
                            </SelectItem>
                            <SelectItem value="reviews" className="text-xs">
                                Most Reviewed
                            </SelectItem>
                            <SelectItem value="title" className="text-xs">
                                Title (A-Z)
                            </SelectItem>
                            <SelectItem value="duration" className="text-xs">
                                Duration
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Items Per Page Select */}
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(val) => {
                            setPageSize(parseInt(val, 10));
                            setCurrentPage(1);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[100px] text-xs rounded-xl bg-background dark:bg-zinc-900 border-border">
                            <SelectValue placeholder="Per page" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border bg-popover">
                            <SelectItem value="12" className="text-xs">
                                12 / page
                            </SelectItem>
                            <SelectItem value="24" className="text-xs">
                                24 / page
                            </SelectItem>
                            <SelectItem value="48" className="text-xs">
                                48 / page
                            </SelectItem>
                            <SelectItem value="0" className="text-xs">
                                Show All
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Movies Grid / Loading / Empty State */}
            {isLoading ? (
                <MovieGridSkeleton cardCount={pageSize > 0 ? Math.min(pageSize, 12) : 12} showFilters={false} />
            ) : sortedMovies.length === 0 ? (
                <div className="p-16 text-center rounded-2xl border border-dashed border-border bg-muted/30 dark:bg-zinc-900/30 space-y-3">
                    <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-red-500/10 text-red-600">
                        <Film className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                        No Movies Found
                        {selectedGenre && selectedGenre.toLowerCase() !== "all" && (
                            <span> in &ldquo;{selectedGenre}&rdquo;</span>
                        )}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        No movies match your current search or genre criteria. Try resetting filters or searching for different keywords.
                    </p>
                    <div className="pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetAllFilters}
                            className="rounded-xl text-xs gap-1.5 cursor-pointer border-red-500/30 hover:border-red-500"
                        >
                            <RotateCcw className="h-3.5 w-3.5 text-red-500" />
                            <span>Reset All Filters</span>
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {paginatedMovies.map((movie) => {
                            const genresList =
                                movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];
                            const platformsList =
                                movie.platforms?.map((p) => p.platform?.name || "").filter(Boolean) || [];

                            return (
                                <div
                                    key={movie.id}
                                    className="group flex flex-col rounded-2xl border border-border/80 dark:border-white/10 bg-card/90 dark:bg-zinc-900/60 shadow-sm hover:shadow-xl dark:hover:shadow-red-950/25 hover:shadow-red-500/10 overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/40"
                                >
                                    {/* Poster Image */}
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
                                                <Film className="h-10 w-10 mb-2 text-muted-foreground/60" />
                                                <span className="text-xs line-clamp-1">{movie.title}</span>
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/60" />

                                        {/* Badges on poster */}
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <Badge
                                                variant="outline"
                                                className="bg-black/75 border-amber-500/40 text-amber-300 font-bold text-xs px-2 py-0.5 backdrop-blur-sm shadow-sm"
                                            >
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                                                {formatRating(movie.averageRating)}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    movie.pricing === "PREMIUM"
                                                        ? "bg-amber-500/25 border-amber-500/40 text-amber-300 text-[10px] backdrop-blur-sm font-semibold"
                                                        : "bg-emerald-500/25 border-emerald-500/40 text-emerald-300 text-[10px] backdrop-blur-sm font-semibold"
                                                }
                                            >
                                                {movie.pricing}
                                            </Badge>
                                        </div>

                                        {/* Wishlist & Like Floating Action Buttons */}
                                        <div className="absolute top-3 right-3 z-10">
                                            <MovieActionButtons movie={movie} variant="floating" />
                                        </div>

                                        {/* Trailer Play Hover Button */}
                                        {movie.youtubeLink && (
                                            <button
                                                onClick={() => setSelectedTrailerMovie(movie)}
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px] cursor-pointer"
                                                aria-label="Play Trailer"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50 hover:scale-110 transition-transform">
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

                                        {/* Genre and Platform pills */}
                                        <div className="space-y-1.5">
                                            {genresList.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {genresList.slice(0, 3).map((g) => (
                                                        <button
                                                            key={g}
                                                            onClick={() => handleGenreSelect(g)}
                                                            className={`inline-flex items-center rounded-full border px-2 py-0 text-[10px] font-medium transition cursor-pointer ${selectedGenre.toLowerCase() === g.toLowerCase()
                                                                    ? "bg-red-600 text-white border-red-600 font-bold"
                                                                    : "bg-secondary text-secondary-foreground border-border/40 hover:border-red-500/40"
                                                                }`}
                                                        >
                                                            <TagIcon className="h-2 w-2 mr-1 text-red-500 dark:text-red-400" />
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {platformsList.length > 0 && (
                                                <div className="flex flex-wrap gap-1 items-center">
                                                    {platformsList.slice(0, 2).map((p) => (
                                                        <Badge
                                                            key={p}
                                                            variant="outline"
                                                            className="bg-cyan-500/10 dark:bg-cyan-950/40 border-cyan-500/30 text-[10px] text-cyan-700 dark:text-cyan-300 px-1.5 py-0"
                                                        >
                                                            <Tv className="h-2 w-2 mr-1 text-cyan-600 dark:text-cyan-400" />
                                                            {p}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Footer */}
                                        <div className="flex items-center justify-between pt-2 border-t border-border/60 dark:border-white/5">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <MessageSquare className="h-3.5 w-3.5 text-red-600 dark:text-red-500" />
                                                {movie.reviewCount || 0} reviews
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                                {movie.youtubeLink && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedTrailerMovie(movie)}
                                                        className="h-7 px-2 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-white hover:bg-red-50 dark:hover:bg-red-600/20 cursor-pointer"
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

                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && pageSize > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60 text-xs text-muted-foreground">
                            <p>
                                Showing{" "}
                                <span className="font-semibold text-foreground">
                                    {(safeCurrentPage - 1) * pageSize + 1}
                                </span>{" "}
                                -{" "}
                                <span className="font-semibold text-foreground">
                                    {Math.min(safeCurrentPage * pageSize, totalItems)}
                                </span>{" "}
                                of <span className="font-semibold text-foreground">{totalItems}</span>{" "}
                                movies
                                {allMovies.length !== totalItems && (
                                    <span> (filtered from {allMovies.length} total)</span>
                                )}
                            </p>

                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={safeCurrentPage <= 1 || isFetching}
                                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                                    className="rounded-xl h-8 px-2.5 gap-1 cursor-pointer text-xs"
                                >
                                    <ChevronLeft className="h-3.5 w-3.5" />
                                    <span>Previous</span>
                                </Button>

                                {/* Page number pills */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((p) => {
                                            // Show first, last, and pages around current page
                                            return (
                                                p === 1 ||
                                                p === totalPages ||
                                                Math.abs(p - safeCurrentPage) <= 1
                                            );
                                        })
                                        .map((p, idx, arr) => {
                                            const prevP = arr[idx - 1];
                                            const showEllipsis = prevP && p - prevP > 1;

                                            return (
                                                <div key={p} className="flex items-center">
                                                    {showEllipsis && (
                                                        <span className="px-1 text-muted-foreground">
                                                            ...
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handlePageChange(p)}
                                                        className={`h-8 w-8 rounded-xl text-xs font-semibold transition cursor-pointer ${safeCurrentPage === p
                                                                ? "bg-red-600 text-white shadow-sm font-bold"
                                                                : "border border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={safeCurrentPage >= totalPages || isFetching}
                                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                                    className="rounded-xl h-8 px-2.5 gap-1 cursor-pointer text-xs"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
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
