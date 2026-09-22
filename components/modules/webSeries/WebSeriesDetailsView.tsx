"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IWebSeries } from "@/src/types/webSeries.types";
import { getYouTubeEmbedUrl } from "@/components/modules/dashboard/movie/movie-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tv,
    Layers,
    Calendar,
    Globe,
    Star,
    ArrowLeft,
    Play,
    Clock,
    Video,
    Film,
    Sparkles,
} from "lucide-react";

interface WebSeriesDetailsViewProps {
    series: IWebSeries;
}

export function WebSeriesDetailsView({ series }: WebSeriesDetailsViewProps) {
    const seasons = series.seasons || [];
    const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);

    const currentSeason = seasons[selectedSeasonIndex] || null;
    const seasonTrailerUrl = currentSeason?.youtubeTrailer
        ? getYouTubeEmbedUrl(currentSeason.youtubeTrailer, false)
        : null;

    const episodes = currentSeason?.episodes || [];

    return (
        <div className="space-y-8 pb-16">
            {/* Back button */}
            <div>
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-zinc-400 hover:text-white"
                >
                    <Link href="/web-series">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Web Series
                    </Link>
                </Button>
            </div>

            {/* Series Hero Section */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 p-6 sm:p-8 md:p-10 shadow-2xl">
                {/* Background ambient glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-black/40 pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
                    {/* Left: Poster */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                            {series.posterUrl ? (
                                <Image
                                    src={series.posterUrl}
                                    alt={series.title}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 100vw, 300px"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                                    <Tv className="h-20 w-20" />
                                </div>
                            )}

                            <div className="absolute top-3 right-3">
                                <Badge
                                    className={`font-bold uppercase tracking-wider backdrop-blur-md ${
                                        series.pricing === "PREMIUM"
                                            ? "bg-amber-500/90 text-black border-amber-400"
                                            : "bg-emerald-600/90 text-white border-emerald-400"
                                    }`}
                                >
                                    {series.pricing}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold text-red-500 border border-red-500/20">
                                <Tv className="h-3 w-3" />
                                Web Series
                            </span>
                            <Badge variant="outline" className="border-white/15 text-zinc-300">
                                {series.status}
                            </Badge>
                            <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                                {series.releaseYear}
                            </span>
                            {series.country && (
                                <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                                    <Globe className="h-3.5 w-3.5 text-zinc-500" />
                                    {series.country} ({series.language})
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                            {series.title}
                        </h1>

                        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                            {series.synopsis}
                        </p>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <Star className="h-4 w-4 fill-current" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">
                                        {series.averageRating > 0 ? series.averageRating.toFixed(1) : "Not Rated"}
                                    </div>
                                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                                        {series.reviewCount} Reviews
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/10 text-red-500 border border-red-500/20">
                                    <Layers className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">
                                        {seasons.length} {seasons.length === 1 ? "Season" : "Seasons"}
                                    </div>
                                    <div className="text-[10px] text-zinc-400 uppercase tracking-wider">
                                        Serialized Show
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seasons & Episodes Section */}
            {seasons.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-12 text-center">
                    <Layers className="mx-auto h-12 w-12 text-zinc-600" />
                    <h3 className="mt-4 text-lg font-bold text-white">No Seasons Registered Yet</h3>
                    <p className="mt-1 text-sm text-zinc-400">
                        Seasons and episode breakdowns for this series will be uploaded shortly.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Season Tabs Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                <Layers className="h-5 w-5 text-red-500" />
                                Season Episodes & Trailers
                            </h2>
                            <p className="text-xs text-zinc-400 mt-0.5">
                                Select a season to watch its specific official trailer and browse all episodes.
                            </p>
                        </div>

                        {/* Season selector buttons */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                            {seasons.map((season, idx) => (
                                <button
                                    key={season.id}
                                    type="button"
                                    onClick={() => setSelectedSeasonIndex(idx)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                        selectedSeasonIndex === idx
                                            ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                                            : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5"
                                    }`}
                                >
                                    Season {season.seasonNumber}
                                    {season.title ? `: ${season.title}` : ""}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Season Content: Trailer & Breakdown */}
                    {currentSeason && (
                        <div className="space-y-6">
                            {/* Season-specific YouTube Trailer Player */}
                            <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                                                Season {currentSeason.seasonNumber} Official Trailer
                                            </span>
                                            {currentSeason.youtubeTrailer && (
                                                <span className="px-2 py-0.5 rounded-full bg-red-600/10 text-[10px] font-semibold text-red-400 border border-red-500/20">
                                                    YouTube 4K
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mt-1">
                                            {currentSeason.title || `Season ${currentSeason.seasonNumber}`}
                                        </h3>
                                    </div>

                                    {currentSeason.releaseDate && (
                                        <div className="text-xs text-zinc-400">
                                            Aired: {new Date(currentSeason.releaseDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                {currentSeason.synopsis && (
                                    <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                                        {currentSeason.synopsis}
                                    </p>
                                )}

                                {/* YouTube Video Embed */}
                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/5 shadow-inner">
                                    {seasonTrailerUrl ? (
                                        <iframe
                                            src={seasonTrailerUrl}
                                            title={`Season ${currentSeason.seasonNumber} Trailer`}
                                            className="w-full h-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                                            <Video className="h-12 w-12 text-zinc-600" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-white">
                                                    No Trailer Added For Season {currentSeason.seasonNumber}
                                                </p>
                                                <p className="text-xs text-zinc-500 max-w-sm">
                                                    The trailer link for this season will be added by the series curators soon.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Episodes Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <Film className="h-4 w-4 text-red-500" />
                                        Episodes ({episodes.length})
                                    </h3>
                                    <span className="text-xs text-zinc-400">
                                        Season {currentSeason.seasonNumber}
                                    </span>
                                </div>

                                {episodes.length === 0 ? (
                                    <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-8 text-center">
                                        <Film className="mx-auto h-8 w-8 text-zinc-600" />
                                        <p className="mt-2 text-xs text-zinc-400">
                                            No episodes uploaded for Season {currentSeason.seasonNumber} yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {episodes.map((ep) => (
                                            <div
                                                key={ep.id}
                                                className="group flex gap-4 rounded-2xl border border-white/10 bg-zinc-900/50 p-3.5 hover:border-red-500/40 transition-all hover:bg-zinc-900/80"
                                            >
                                                {/* Episode Still / Thumbnail */}
                                                <div className="relative aspect-video w-36 sm:w-44 shrink-0 rounded-xl overflow-hidden bg-black border border-white/5">
                                                    {ep.stillUrl ? (
                                                        <Image
                                                            src={ep.stillUrl}
                                                            alt={ep.title}
                                                            fill
                                                            sizes="180px"
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-700">
                                                            <Play className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                                                        EP {ep.episodeNumber}
                                                    </div>
                                                </div>

                                                {/* Episode Info */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div className="space-y-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                                                                {ep.title}
                                                            </h4>
                                                        </div>
                                                        {ep.synopsis && (
                                                            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                                                                {ep.synopsis}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500">
                                                        {ep.duration && (
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {ep.duration} mins
                                                            </span>
                                                        )}
                                                        {ep.videoUrl && (
                                                            <span className="text-red-400 font-medium">
                                                                Watch Stream
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
