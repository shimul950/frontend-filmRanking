"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IMovie } from "@/src/types/movie.types";
import { formatDuration, formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import {
    Search,
    Loader2,
    X,
    Star,
    Film,
    ArrowRight,
    Tag as TagIcon,
    Clock,
    Calendar,
} from "lucide-react";

interface MovieAutocompleteSearchProps {
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    onItemSelect?: () => void;
    autoFocus?: boolean;
}

export function MovieAutocompleteSearch({
    placeholder = "Search movies, genres, directors...",
    className = "",
    inputClassName = "",
    onItemSelect,
    autoFocus = false,
}: MovieAutocompleteSearchProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<IMovie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced search query
    useEffect(() => {
        const query = searchQuery.trim();
        if (query.length < 2) {
            setResults([]);
            setIsLoading(false);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/movies/search?query=${encodeURIComponent(query)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    const movies: IMovie[] = Array.isArray(data?.data) ? data.data : [];
                    setResults(movies);
                    setIsOpen(true);
                    setSelectedIndex(-1);
                }
            } catch (error) {
                console.error("Autocomplete search fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 350); // 350ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Navigate to selected movie
    const handleSelectMovie = useCallback(
        (movieId: string) => {
            setIsOpen(false);
            setSearchQuery("");
            if (onItemSelect) onItemSelect();
            router.push(`/movies/${movieId}`);
        },
        [router, onItemSelect]
    );

    // Full search page submission
    const handleSubmitSearch = useCallback(
        (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            const query = searchQuery.trim();
            if (!query) return;

            if (selectedIndex >= 0 && results[selectedIndex]) {
                handleSelectMovie(results[selectedIndex].id);
                return;
            }

            setIsOpen(false);
            if (onItemSelect) onItemSelect();
            router.push(`/movies?search=${encodeURIComponent(query)}`);
        },
        [searchQuery, selectedIndex, results, handleSelectMovie, router, onItemSelect]
    );

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen || results.length === 0) {
            if (e.key === "Enter") {
                handleSubmitSearch();
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    handleSelectMovie(results[selectedIndex].id);
                } else {
                    handleSubmitSearch();
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                break;
        }
    };

    const handleClear = () => {
        setSearchQuery("");
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className={`relative w-full ${className}`}>
            <form onSubmit={handleSubmitSearch} className="relative w-full">
                {/* Search icon / spinner */}
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground flex items-center justify-center">
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-600 dark:text-red-500" />
                    ) : (
                        <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>

                <Input
                    ref={inputRef}
                    type="search"
                    autoFocus={autoFocus}
                    placeholder={placeholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0 && searchQuery.trim().length >= 2) {
                            setIsOpen(true);
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-9 pr-8 bg-muted/50 dark:bg-zinc-900/80 border-border/80 text-foreground placeholder:text-muted-foreground/70 text-xs h-9 rounded-xl focus-visible:ring-red-500/30 focus-visible:border-red-500/50 shadow-sm transition-all ${inputClassName}`}
                />

                {/* Clear query button */}
                {searchQuery && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/80 transition"
                        aria-label="Clear search input"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </form>

            {/* AUTOCOMPLETE FLOATING DROPDOWN */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-border/80 bg-popover/95 dark:bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                    {results.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground space-y-1.5">
                            <Film className="h-6 w-6 text-muted-foreground/50 mx-auto mb-1" />
                            <p className="font-semibold text-foreground">
                                No movies found for &ldquo;{searchQuery}&rdquo;
                            </p>
                            <p className="text-[11px]">
                                Try searching with different titles, genres, or director names.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {/* Dropdown Header */}
                            <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/60 bg-muted/30 text-[11px] text-muted-foreground font-medium">
                                <span>
                                    Found <span className="font-bold text-foreground">{results.length}</span>{" "}
                                    {results.length === 1 ? "movie" : "movies"}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-red-600 dark:text-red-400 font-bold">
                                    Instant Results
                                </span>
                            </div>

                            {/* Movie Suggestions List */}
                            <ul className="max-h-[380px] overflow-y-auto divide-y divide-border/40 scrollbar-thin scrollbar-thumb-muted">
                                {results.map((movie, index) => {
                                    const isHighlighted = selectedIndex === index;
                                    const genresList =
                                        movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];

                                    return (
                                        <li
                                            key={movie.id}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            onClick={() => handleSelectMovie(movie.id)}
                                            className={`group flex items-center gap-3 p-2.5 cursor-pointer transition-colors ${
                                                isHighlighted
                                                    ? "bg-red-500/10 dark:bg-red-950/40 text-foreground"
                                                    : "hover:bg-muted/60 text-card-foreground"
                                            }`}
                                        >
                                            {/* Poster Thumbnail */}
                                            <div className="relative h-14 w-10 shrink-0 rounded-lg overflow-hidden bg-muted dark:bg-zinc-900 border border-border/60 shadow-sm">
                                                {movie.posterUrl ? (
                                                    <Image
                                                        src={movie.posterUrl}
                                                        alt={movie.title}
                                                        fill
                                                        sizes="40px"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/60">
                                                        <Film className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h4
                                                        className={`text-xs font-bold truncate transition-colors ${
                                                            isHighlighted
                                                                ? "text-red-600 dark:text-red-400"
                                                                : "group-hover:text-red-600 dark:group-hover:text-red-400"
                                                        }`}
                                                    >
                                                        {movie.title}
                                                    </h4>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            movie.pricing === "PREMIUM"
                                                                ? "bg-amber-500/15 border-amber-500/30 text-amber-300 text-[9px] px-1 py-0"
                                                                : "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 text-[9px] px-1 py-0"
                                                        }
                                                    >
                                                        {movie.pricing}
                                                    </Badge>
                                                </div>

                                                {/* Meta: Year, Duration, Rating */}
                                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                                                    <span className="flex items-center gap-0.5">
                                                        <Calendar className="h-3 w-3" />
                                                        {movie.releaseYear}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-0.5">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDuration(movie.duration)}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-0.5 text-amber-500 dark:text-amber-400 font-semibold">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        {formatRating(movie.averageRating)}
                                                    </span>
                                                </div>

                                                {/* Genres */}
                                                {genresList.length > 0 && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        {genresList.slice(0, 2).map((g) => (
                                                            <span
                                                                key={g}
                                                                className="inline-flex items-center text-[10px] text-muted-foreground bg-muted dark:bg-zinc-800 px-1.5 py-0 rounded border border-border/40"
                                                            >
                                                                <TagIcon className="h-2 w-2 mr-1 text-red-500" />
                                                                {g}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right chevron indicator */}
                                            <div className="shrink-0 text-muted-foreground group-hover:text-red-500 transition-transform group-hover:translate-x-0.5 pr-1">
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>

                            {/* Dropdown Footer: See all results */}
                            <div
                                onClick={() => handleSubmitSearch()}
                                className="flex items-center justify-between px-3.5 py-2.5 border-t border-border/60 bg-muted/40 hover:bg-muted/80 text-xs font-semibold text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                            >
                                <span className="flex items-center gap-1.5">
                                    <Search className="h-3 w-3" />
                                    <span>
                                        View all catalog matches for &ldquo;{searchQuery}&rdquo;
                                    </span>
                                </span>
                                <span className="text-[10px] text-muted-foreground uppercase font-normal">
                                    Press Enter ↵
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
