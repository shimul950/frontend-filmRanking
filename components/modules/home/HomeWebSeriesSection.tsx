"use client";

import Link from "next/link";
import Image from "next/image";
import { IWebSeries } from "@/src/types/webSeries.types";
import { Button } from "@/components/ui/button";
import {
    Tv,
    ArrowRight,
    Star,
    Layers,
    Play,
    Sparkles,
    Calendar,
} from "lucide-react";

interface HomeWebSeriesSectionProps {
    series: IWebSeries[];
}

export function HomeWebSeriesSection({ series }: HomeWebSeriesSectionProps) {
    if (!series || series.length === 0) return null;

    return (
        <section className="container mx-auto px-4 sm:px-6 max-w-7xl pt-8 pb-4">
            <div className="flex items-end justify-between mb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-600/20 text-red-500">
                            <Tv className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                            Serialized Entertainment
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        Featured <span className="text-red-600">Web Series</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400">
                        Multi-season cinematic stories with dedicated season trailers & episode breakdowns.
                    </p>
                </div>

                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                    <Link href="/web-series">
                        Explore All <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </Button>
            </div>

            {/* Horizontal Scroll / Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                {series.slice(0, 5).map((item) => {
                    const seasonCount = item.seasons?.length || 0;
                    return (
                        <Link
                            key={item.id}
                            href={`/web-series/${item.id}`}
                            className="group flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/30 transition-all duration-300"
                        >
                            <div className="relative aspect-[2/3] w-full bg-zinc-950 overflow-hidden">
                                {item.posterUrl ? (
                                    <Image
                                        src={item.posterUrl}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
                                        <Tv className="h-14 w-14" />
                                    </div>
                                )}

                                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[9px] font-bold text-white border border-white/10">
                                    <Layers className="h-2.5 w-2.5 text-red-500" />
                                    {seasonCount} {seasonCount === 1 ? "Season" : "Seasons"}
                                </div>

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="h-10 w-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40">
                                        <Play className="h-4 w-4 fill-current ml-0.5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
                                <div>
                                    <h3 className="font-bold text-white text-xs sm:text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                                        <span>{item.releaseYear}</span>
                                        {item.country && <span>· {item.country}</span>}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                                        <Star className="h-3 w-3 fill-current" />
                                        {item.averageRating > 0 ? item.averageRating.toFixed(1) : "Unrated"}
                                    </div>
                                    <span
                                        className={`font-semibold uppercase ${
                                            item.pricing === "PREMIUM" ? "text-amber-400" : "text-emerald-400"
                                        }`}
                                    >
                                        {item.pricing}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
