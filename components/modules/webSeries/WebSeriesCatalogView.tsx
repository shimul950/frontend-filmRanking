"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { IWebSeries } from "@/src/types/webSeries.types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tv,
    Search,
    Star,
    Layers,
    Calendar,
    Globe,
    Sparkles,
    Play,
} from "lucide-react";

interface WebSeriesCatalogViewProps {
    initialSeries: IWebSeries[];
}

export function WebSeriesCatalogView({ initialSeries }: WebSeriesCatalogViewProps) {
    const [seriesList] = useState<IWebSeries[]>(initialSeries);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [pricingFilter, setPricingFilter] = useState<string>("ALL");

    const filteredSeries = useMemo(() => {
        return seriesList.filter((s) => {
            const matchesSearch =
                !searchTerm.trim() ||
                s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.synopsis.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" || s.status === statusFilter;

            const matchesPricing =
                pricingFilter === "ALL" || s.pricing === pricingFilter;

            return matchesSearch && matchesStatus && matchesPricing;
        });
    }, [seriesList, searchTerm, statusFilter, pricingFilter]);

    return (
        <div className="space-y-8 pb-16">
            {/* Hero Header */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 sm:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-600/15 via-transparent to-transparent pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-red-600/10 px-3 py-1 text-xs font-semibold text-red-500 border border-red-500/20">
                        <Tv className="h-3.5 w-3.5" />
                        Original & Serialized Shows
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                        Explore Original <span className="text-red-600">Web Series</span>
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                        Binge multi-season dramas, thrilling serials, and exclusive episodic sagas. Watch season-by-season trailers, discover episode breakdowns, and rate your favorite titles.
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-white/10">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search series by title, synopsis, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-zinc-950 border-white/10 text-white placeholder:text-zinc-500 text-sm h-10 rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/10 text-xs">
                        {["ALL", "RELEASED", "UPCOMING"].map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                    statusFilter === status
                                        ? "bg-red-600 text-white font-semibold shadow"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                {status === "ALL" ? "All Status" : status}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-white/10 text-xs">
                        {["ALL", "FREE", "PREMIUM"].map((pricing) => (
                            <button
                                key={pricing}
                                type="button"
                                onClick={() => setPricingFilter(pricing)}
                                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                                    pricingFilter === pricing
                                        ? "bg-red-600 text-white font-semibold shadow"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                {pricing === "ALL" ? "All Pricing" : pricing}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Series Grid */}
            {filteredSeries.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-zinc-900/30 p-16 text-center">
                    <Tv className="mx-auto h-14 w-14 text-zinc-600" />
                    <h3 className="mt-4 text-lg font-bold text-white">No Web Series Found</h3>
                    <p className="mt-1 text-sm text-zinc-400 max-w-md mx-auto">
                        {searchTerm || statusFilter !== "ALL" || pricingFilter !== "ALL"
                            ? "No web series match your selected search or filters. Try adjusting your query."
                            : "New series are being added to our library soon! Stay tuned."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    {filteredSeries.map((series) => {
                        const seasonCount = series.seasons?.length || 0;
                        return (
                            <Link
                                key={series.id}
                                href={`/web-series/${series.id}`}
                                className="group flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden hover:border-red-500/60 hover:shadow-xl hover:shadow-red-950/30 transition-all duration-300"
                            >
                                {/* Poster Image (Cinematic 2:3) */}
                                <div className="relative aspect-[2/3] w-full bg-zinc-950 overflow-hidden">
                                    {series.posterUrl ? (
                                        <Image
                                            src={series.posterUrl}
                                            alt={series.title}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 20vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
                                            <Tv className="h-16 w-16" />
                                        </div>
                                    )}

                                    {/* Top Badges */}
                                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/10">
                                            <Layers className="h-3 w-3 text-red-500" />
                                            {seasonCount} {seasonCount === 1 ? "Season" : "Seasons"}
                                        </span>

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                                                series.pricing === "PREMIUM"
                                                    ? "bg-amber-500/80 text-black border border-amber-400"
                                                    : "bg-emerald-600/80 text-white border border-emerald-400"
                                            }`}
                                        >
                                            {series.pricing}
                                        </span>
                                    </div>

                                    {/* Hover overlay with play indicator */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="h-12 w-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transform scale-90 group-hover:scale-100 transition-transform">
                                            <Play className="h-5 w-5 fill-current ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                                    <div>
                                        <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                                            {series.title}
                                        </h3>

                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-zinc-500" />
                                                {series.releaseYear}
                                            </span>
                                            {series.country && (
                                                <span className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3 text-zinc-500" />
                                                    {series.country}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                                            {series.synopsis}
                                        </p>
                                    </div>

                                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                                            <Star className="h-3 w-3 fill-current" />
                                            <span>
                                                {series.averageRating > 0
                                                    ? series.averageRating.toFixed(1)
                                                    : "Unrated"}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                            {series.status}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
