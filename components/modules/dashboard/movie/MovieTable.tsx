"use client";

import { useState } from "react";
import Image from "next/image";
import { IMovie } from "@/src/types/movie.types";
import { formatDuration, formatRating } from "./movie-helpers";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Star,
    Play,
    MoreHorizontal,
    Edit3,
    Trash2,
    Eye,
    Tag as TagIcon,
    Tv,
    Film,
} from "lucide-react";
import { MovieTrailerModal } from "./MovieTrailerModal";

interface MovieTableProps {
    movies: IMovie[];
    onViewDetails: (movie: IMovie) => void;
    onEdit: (movie: IMovie) => void;
    onDelete: (movie: IMovie) => void;
}

export function MovieTable({
    movies,
    onViewDetails,
    onEdit,
    onDelete,
}: MovieTableProps) {
    const [selectedTrailerMovie, setSelectedTrailerMovie] = useState<IMovie | null>(null);

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md">
                <Table>
                    <TableHeader className="bg-zinc-950/60">
                        <TableRow className="border-white/10 hover:bg-transparent">
                            <TableHead className="w-[80px] text-zinc-400">Poster</TableHead>
                            <TableHead className="text-zinc-400">Title & Year</TableHead>
                            <TableHead className="text-zinc-400">Genres</TableHead>
                            <TableHead className="text-zinc-400">Platforms</TableHead>
                            <TableHead className="text-zinc-400">Duration</TableHead>
                            <TableHead className="text-zinc-400">Rating & Reviews</TableHead>
                            <TableHead className="text-zinc-400">Pricing</TableHead>
                            <TableHead className="text-zinc-400">Trailer</TableHead>
                            <TableHead className="w-[80px] text-right text-zinc-400">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movies.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-36 text-center text-zinc-400">
                                    No movies found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            movies.map((movie) => {
                                const genresList = movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];
                                const platformsList = movie.platforms?.map((p) => p.platform?.name || "").filter(Boolean) || [];

                                return (
                                    <TableRow
                                        key={movie.id}
                                        className="border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        {/* Poster Thumbnail */}
                                        <TableCell>
                                            <div className="relative h-12 w-9 overflow-hidden rounded-md bg-zinc-950 border border-white/10">
                                                {movie.posterUrl ? (
                                                    <Image
                                                        src={movie.posterUrl}
                                                        alt={movie.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600 text-xs font-bold">
                                                        <Film className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Title & Info */}
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span
                                                    onClick={() => onViewDetails(movie)}
                                                    className="font-bold text-white hover:text-red-400 cursor-pointer transition-colors line-clamp-1"
                                                >
                                                    {movie.title}
                                                </span>
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                                    <span>{movie.releaseYear}</span>
                                                    {movie.director && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="truncate max-w-[120px]">
                                                                {movie.director}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Genres */}
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                {genresList.slice(0, 2).map((g) => (
                                                    <Badge
                                                        key={g}
                                                        variant="secondary"
                                                        className="bg-zinc-800 text-[10px] text-zinc-300 px-1.5 py-0 rounded"
                                                    >
                                                        <TagIcon className="h-2 w-2 mr-1 text-red-400" />
                                                        {g}
                                                    </Badge>
                                                ))}
                                                {genresList.length > 2 && (
                                                    <span className="text-[10px] text-zinc-500">
                                                        +{genresList.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Platforms */}
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                                                {platformsList.slice(0, 2).map((p) => (
                                                    <Badge
                                                        key={p}
                                                        variant="outline"
                                                        className="bg-zinc-950/80 border-cyan-500/20 text-[10px] text-cyan-300 px-1.5 py-0 rounded"
                                                    >
                                                        <Tv className="h-2 w-2 mr-1 text-cyan-400" />
                                                        {p}
                                                    </Badge>
                                                ))}
                                                {platformsList.length > 2 && (
                                                    <span className="text-[10px] text-zinc-500">
                                                        +{platformsList.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Duration */}
                                        <TableCell className="text-xs text-zinc-300 whitespace-nowrap">
                                            {formatDuration(movie.duration)}
                                        </TableCell>

                                        {/* Rating & Reviews */}
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <Badge
                                                    variant="outline"
                                                    className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs px-1.5 py-0.5"
                                                >
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                                                    {formatRating(movie.averageRating)}
                                                </Badge>
                                                <span className="text-xs text-zinc-500">
                                                    ({movie.reviewCount || 0})
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Pricing */}
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    movie.pricing === "PREMIUM"
                                                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px]"
                                                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                                                }
                                            >
                                                {movie.pricing}
                                            </Badge>
                                        </TableCell>

                                        {/* Trailer Button */}
                                        <TableCell>
                                            {movie.youtubeLink ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedTrailerMovie(movie)}
                                                    className="h-7 text-xs text-red-400 hover:text-white hover:bg-red-600/20 px-2"
                                                >
                                                    <Play className="h-3 w-3 fill-current mr-1" />
                                                    Watch
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-zinc-600">None</span>
                                            )}
                                        </TableCell>

                                        {/* Actions Dropdown */}
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-zinc-400 hover:text-white"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
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
                                                        <span>Inspect & Reviews</span>
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
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Trailer Modal */}
            <MovieTrailerModal
                isOpen={!!selectedTrailerMovie}
                onClose={() => setSelectedTrailerMovie(null)}
                title={selectedTrailerMovie?.title || ""}
                trailerUrl={selectedTrailerMovie?.youtubeLink}
            />
        </>
    );
}
