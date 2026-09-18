"use client";

import { useState } from "react";
import Image from "next/image";
import { IMovie } from "@/src/types/movie.types";
import { formatDuration, formatRating } from "./movie-helpers";
import {
    Star,
    Play,
    MoreVertical,
    Edit3,
    Trash2,
    Eye,
    MessageSquare,
    Tv,
    Tag as TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MovieTrailerModal } from "./MovieTrailerModal";

interface MovieCardProps {
    movie: IMovie;
    onViewDetails: (movie: IMovie) => void;
    onEdit: (movie: IMovie) => void;
    onDelete: (movie: IMovie) => void;
}

export function MovieCard({
    movie,
    onViewDetails,
    onEdit,
    onDelete,
}: MovieCardProps) {
    const [showTrailer, setShowTrailer] = useState(false);
    const [imageError, setImageError] = useState(false);

    const genresList = movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];
    const platformsList = movie.platforms?.map((p) => p.platform?.name || "").filter(Boolean) || [];

    return (
        <>
            <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/20">
                {/* Poster & Backdrop Banner */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                    {movie.posterUrl && !imageError ? (
                        <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 font-black text-xl mb-2">
                                {movie.title.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="text-xs text-zinc-500 font-medium line-clamp-1 max-w-[85%]">
                                {movie.title}
                            </span>
                        </div>
                    )}

                    {/* Dark gradient fade for text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/60" />

                    {/* Top badging */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5 pointer-events-auto">
                            <Badge
                                variant="outline"
                                className="bg-black/70 backdrop-blur-md border-amber-500/30 text-amber-400 font-bold px-2 py-0.5 text-xs flex items-center gap-1"
                            >
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                {formatRating(movie.averageRating)}
                            </Badge>

                            <Badge
                                variant="outline"
                                className={
                                    movie.pricing === "PREMIUM"
                                        ? "bg-amber-500/20 border-amber-500/30 text-amber-300 text-[10px] uppercase font-bold"
                                        : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 text-[10px] uppercase font-bold"
                                }
                            >
                                {movie.pricing}
                            </Badge>
                        </div>

                        {/* Quick Menu */}
                        <div className="pointer-events-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-black/60 border border-white/10 text-white hover:bg-black/90 hover:border-white/30"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-44 border-white/10 bg-zinc-950 text-white"
                                >
                                    <DropdownMenuItem
                                        onClick={() => onViewDetails(movie)}
                                        className="flex cursor-pointer items-center gap-2 text-xs"
                                    >
                                        <Eye className="h-3.5 w-3.5 text-blue-400" />
                                        <span>View Details & Reviews</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onEdit(movie)}
                                        className="flex cursor-pointer items-center gap-2 text-xs"
                                    >
                                        <Edit3 className="h-3.5 w-3.5 text-amber-400" />
                                        <span>Edit Movie</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        onClick={() => onDelete(movie)}
                                        className="flex cursor-pointer items-center gap-2 text-xs text-red-400 focus:text-red-400 focus:bg-red-500/10"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete Movie</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Trailer Play Overlay Trigger */}
                    {movie.youtubeLink && (
                        <button
                            type="button"
                            onClick={() => setShowTrailer(true)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]"
                            aria-label={`Watch ${movie.title} trailer`}
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg shadow-red-600/50 transition-transform duration-300 hover:scale-110">
                                <Play className="h-5 w-5 fill-white ml-0.5" />
                            </div>
                        </button>
                    )}
                </div>

                {/* Content Details */}
                <div className="flex flex-1 flex-col justify-between p-4 gap-3">
                    <div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium mb-1">
                            <span>{movie.releaseYear}</span>
                            <span>•</span>
                            <span>{formatDuration(movie.duration)}</span>
                            {movie.director && (
                                <>
                                    <span>•</span>
                                    <span className="truncate max-w-[120px]" title={movie.director}>
                                        Dir: {movie.director}
                                    </span>
                                </>
                            )}
                        </div>

                        <h3 className="font-bold text-white tracking-tight line-clamp-1 group-hover:text-red-400 transition-colors">
                            {movie.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                            {movie.synopsis}
                        </p>
                    </div>

                    {/* Genres & Platforms Badges */}
                    <div className="space-y-1.5">
                        {genresList.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {genresList.slice(0, 3).map((genreName) => (
                                    <Badge
                                        key={genreName}
                                        variant="secondary"
                                        className="bg-zinc-800 text-[10px] text-zinc-300 px-1.5 py-0 rounded-md border border-white/5"
                                    >
                                        <TagIcon className="h-2.5 w-2.5 mr-1 text-red-400" />
                                        {genreName}
                                    </Badge>
                                ))}
                                {genresList.length > 3 && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-zinc-800 text-[10px] text-zinc-400 px-1.5 py-0 rounded-md border border-white/5"
                                    >
                                        +{genresList.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {platformsList.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center">
                                {platformsList.slice(0, 2).map((platformName) => (
                                    <Badge
                                        key={platformName}
                                        variant="outline"
                                        className="bg-zinc-950/80 border-cyan-500/20 text-[10px] text-cyan-300 px-1.5 py-0 rounded-md"
                                    >
                                        <Tv className="h-2.5 w-2.5 mr-1 text-cyan-400" />
                                        {platformName}
                                    </Badge>
                                ))}
                                {platformsList.length > 2 && (
                                    <span className="text-[10px] text-zinc-500">
                                        +{platformsList.length - 2} platforms
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                            <span
                                className="flex items-center gap-1 hover:text-zinc-200 cursor-pointer"
                                onClick={() => onViewDetails(movie)}
                                title="Reviews & Comments"
                            >
                                <MessageSquare className="h-3.5 w-3.5 text-red-500" />
                                <span>{movie.reviewCount || 0} reviews</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {movie.youtubeLink && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowTrailer(true)}
                                    className="h-7 text-xs border-red-500/30 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors px-2.5"
                                >
                                    <Play className="h-3 w-3 fill-current mr-1" />
                                    Trailer
                                </Button>
                            )}

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onViewDetails(movie)}
                                className="h-7 text-xs bg-zinc-800 text-white hover:bg-zinc-700 rounded-lg px-2.5"
                            >
                                Inspect
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            <MovieTrailerModal
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                title={movie.title}
                trailerUrl={movie.youtubeLink}
            />
        </>
    );
}
