"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getYouTubeEmbedUrl } from "./movie-helpers";
import { Film, VideoOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieTrailerModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    trailerUrl?: string | null;
}

export function MovieTrailerModal({
    isOpen,
    onClose,
    title,
    trailerUrl,
}: MovieTrailerModalProps) {
    const embedUrl = getYouTubeEmbedUrl(trailerUrl, true);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl border-white/10 bg-zinc-950 p-0 text-white overflow-hidden shadow-2xl">
                <DialogHeader className="border-b border-white/10 px-6 py-4 bg-zinc-900/80 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                                <Film className="h-4 w-4" />
                            </div>
                            <div>
                                <DialogTitle className="text-base font-bold text-white tracking-wide">
                                    {title}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-zinc-400">
                                    Official Trailer & Teaser
                                </DialogDescription>
                            </div>
                        </div>

                        {trailerUrl && (
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-xs text-zinc-400 hover:text-white"
                            >
                                <a
                                    href={trailerUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5"
                                >
                                    <span>Open on YouTube</span>
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="relative aspect-video w-full bg-black">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={`${title} Trailer`}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center p-8">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500 border border-white/5">
                                <VideoOff className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-zinc-300">
                                    No Trailer Link Available
                                </p>
                                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                                    This title does not have a YouTube trailer URL linked yet. You can attach one in the Edit Movie dialog.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
