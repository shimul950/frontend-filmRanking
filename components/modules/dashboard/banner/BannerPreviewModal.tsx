"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IBanner } from "@/src/types/banner.types";
import {
    Star,
    Flame,
    Play,
    Calendar,
    Clock,
    X,
    Clapperboard,
} from "lucide-react";

interface BannerPreviewModalProps {
    banner: IBanner | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function BannerPreviewModal({
    banner,
    open,
    onOpenChange,
}: BannerPreviewModalProps) {
    if (!banner) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-5xl p-0 overflow-hidden rounded-3xl border-border bg-black shadow-2xl">
                <div className="relative w-full h-[450px] sm:h-[550px] overflow-hidden select-none">
                    {/* Backdrop */}
                    {banner.imageUrl ? (
                        <Image
                            src={banner.imageUrl}
                            alt={banner.title}
                            fill
                            className="object-cover object-top filter brightness-[0.75]"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-900" />
                    )}

                    {/* Cinema Vignette Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent lg:w-3/4" />

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 z-10 space-y-4">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-red-600/30">
                                <Flame className="h-3 w-3 fill-current" />
                                <span>Spotlight Feature</span>
                            </div>

                            {banner.rating !== null && banner.rating !== undefined && (
                                <Badge
                                    variant="outline"
                                    className="bg-black/60 border-amber-500/40 text-amber-300 font-bold text-xs px-2.5 py-0.5 backdrop-blur-md"
                                >
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                                    {banner.rating} / 5.0
                                </Badge>
                            )}

                            <Badge
                                variant="outline"
                                className={
                                    banner.pricing === "PREMIUM"
                                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300 text-[11px] backdrop-blur-md"
                                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 text-[11px] backdrop-blur-md"
                                }
                            >
                                {banner.pricing}
                            </Badge>

                            {banner.releaseYear && (
                                <span className="text-xs text-zinc-300 font-medium inline-flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3 text-red-500" />
                                    {banner.releaseYear}
                                </span>
                            )}

                            {banner.duration && (
                                <span className="text-xs text-zinc-300 font-medium inline-flex items-center gap-1.5">
                                    <Clock className="h-3 w-3 text-cyan-400" />
                                    {Math.floor(banner.duration / 60)}h {banner.duration % 60}m
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow leading-tight">
                            {banner.title}
                        </h1>

                        {/* Metadata */}
                        {(banner.genre || banner.director) && (
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 font-medium">
                                {banner.genre && <span className="text-red-400 font-semibold">{banner.genre}</span>}
                                {banner.genre && banner.director && <span>•</span>}
                                {banner.director && <span>Directed by {banner.director}</span>}
                            </div>
                        )}

                        {/* Synopsis */}
                        {banner.synopsis && (
                            <p className="text-xs sm:text-sm text-zinc-200/90 line-clamp-3 leading-relaxed max-w-xl drop-shadow">
                                {banner.synopsis}
                            </p>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            {banner.youtubeLink && (
                                <Button
                                    size="sm"
                                    asChild
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-4 rounded-xl shadow-lg shadow-red-600/40"
                                >
                                    <a href={banner.youtubeLink} target="_blank" rel="noopener noreferrer">
                                        <Play className="h-3.5 w-3.5 fill-current mr-1.5" />
                                        Watch Trailer
                                    </a>
                                </Button>
                            )}
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-white/20 bg-black/40 hover:bg-white/10 text-white text-xs h-10 px-4 rounded-xl backdrop-blur-md"
                            >
                                Close Live Preview
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
