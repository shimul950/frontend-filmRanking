"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IWebSeries, ISeason } from "@/src/types/webSeries.types";
import {
    addSeasonAction,
    deleteSeasonAction,
    addEpisodeAction,
    deleteEpisodeAction,
} from "@/src/app/(dashboardRoute)/admin/dashboard/web-series-management/_action/manageSeasons.action";
import { getYouTubeEmbedUrl } from "../movie/movie-helpers";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Layers,
    Plus,
    Trash2,
    Video,
    Film,
    Clock,
    Play,
    Loader2,
    Sparkles,
} from "lucide-react";

interface ManageSeasonsDialogProps {
    series: IWebSeries | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function ManageSeasonsDialog({
    series,
    open,
    onOpenChange,
    onSuccess,
}: ManageSeasonsDialogProps) {
    const seasons = series?.seasons || [];
    const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
        seasons[0]?.id || ""
    );

    // Form: Add Season
    const [showAddSeason, setShowAddSeason] = useState(false);
    const [seasonNumber, setSeasonNumber] = useState(
        (seasons.length + 1).toString()
    );
    const [seasonTitle, setSeasonTitle] = useState("");
    const [seasonSynopsis, setSeasonSynopsis] = useState("");
    const [seasonTrailer, setSeasonTrailer] = useState("");
    const [isAddingSeason, setIsAddingSeason] = useState(false);

    // Form: Add Episode
    const [showAddEpisode, setShowAddEpisode] = useState(false);
    const [episodeNumber, setEpisodeNumber] = useState("1");
    const [episodeTitle, setEpisodeTitle] = useState("");
    const [episodeDuration, setEpisodeDuration] = useState("45");
    const [episodeSynopsis, setEpisodeSynopsis] = useState("");
    const [episodeVideoUrl, setEpisodeVideoUrl] = useState("");
    const [isAddingEpisode, setIsAddingEpisode] = useState(false);

    const activeSeason = seasons.find((s) => s.id === selectedSeasonId) || seasons[0];

    const handleAddSeason = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!series) return;
        const num = parseInt(seasonNumber, 10);
        if (isNaN(num) || num < 1) {
            toast.error("Valid season number is required");
            return;
        }

        setIsAddingSeason(true);
        try {
            const res = await addSeasonAction(series.id, {
                seasonNumber: num,
                title: seasonTitle.trim() || undefined,
                synopsis: seasonSynopsis.trim() || undefined,
                youtubeTrailer: seasonTrailer.trim() || undefined,
            });

            if (res.success) {
                toast.success(`Season ${num} added successfully!`);
                setShowAddSeason(false);
                setSeasonTitle("");
                setSeasonSynopsis("");
                setSeasonTrailer("");
                setSeasonNumber((seasons.length + 2).toString());
                setSelectedSeasonId(res.data.id);
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to add season");
            }
        } catch {
            toast.error("Error adding season");
        } finally {
            setIsAddingSeason(false);
        }
    };

    const handleDeleteSeason = async (seasonId: string) => {
        if (!series) return;
        try {
            const res = await deleteSeasonAction(seasonId, series.id);
            if (res.success) {
                toast.success("Season deleted successfully");
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to delete season");
            }
        } catch {
            toast.error("Error deleting season");
        }
    };

    const handleAddEpisode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSeason || !series) return;
        if (!episodeTitle.trim()) {
            toast.error("Episode title is required");
            return;
        }

        setIsAddingEpisode(true);
        try {
            const res = await addEpisodeAction(
                activeSeason.id,
                {
                    episodeNumber: parseInt(episodeNumber, 10),
                    title: episodeTitle.trim(),
                    duration: parseInt(episodeDuration, 10) || undefined,
                    synopsis: episodeSynopsis.trim() || undefined,
                    videoUrl: episodeVideoUrl.trim() || undefined,
                },
                series.id
            );

            if (res.success) {
                toast.success(`Episode "${episodeTitle}" added!`);
                setShowAddEpisode(false);
                setEpisodeTitle("");
                setEpisodeSynopsis("");
                setEpisodeVideoUrl("");
                setEpisodeNumber(
                    ((activeSeason.episodes?.length || 0) + 2).toString()
                );
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to add episode");
            }
        } catch {
            toast.error("Error adding episode");
        } finally {
            setIsAddingEpisode(false);
        }
    };

    const handleDeleteEpisode = async (episodeId: string) => {
        if (!series) return;
        try {
            const res = await deleteEpisodeAction(episodeId, series.id);
            if (res.success) {
                toast.success("Episode deleted");
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to delete episode");
            }
        } catch {
            toast.error("Error deleting episode");
        }
    };

    if (!series) return null;

    const trailerEmbedUrl = activeSeason?.youtubeTrailer
        ? getYouTubeEmbedUrl(activeSeason.youtubeTrailer, false)
        : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto bg-zinc-950 border-white/10 text-white p-6 sm:p-8 shadow-2xl">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <div>Manage Seasons & Episodes</div>
                            <div className="text-xs font-normal text-zinc-400">
                                {series.title} ({series.releaseYear})
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 pt-2">
                    {/* Season Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {seasons.map((s) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedSeasonId(s.id);
                                        setShowAddSeason(false);
                                        setShowAddEpisode(false);
                                    }}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                        (activeSeason?.id === s.id && !showAddSeason)
                                            ? "bg-red-600 text-white shadow"
                                            : "bg-zinc-800 text-zinc-300 hover:text-white"
                                    }`}
                                >
                                    Season {s.seasonNumber}
                                </button>
                            ))}
                        </div>

                        <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                                setShowAddSeason(!showAddSeason);
                                setShowAddEpisode(false);
                            }}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs gap-1.5 h-8"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            {showAddSeason ? "Close Season Form" : "Add Season"}
                        </Button>
                    </div>

                    {/* Add Season Form */}
                    {showAddSeason && (
                        <form
                            onSubmit={handleAddSeason}
                            className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 space-y-3"
                        >
                            <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" />
                                Add Season with YouTube Trailer
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[11px] text-zinc-300 font-semibold">
                                        Season Number <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        type="number"
                                        value={seasonNumber}
                                        onChange={(e) => setSeasonNumber(e.target.value)}
                                        min={1}
                                        required
                                        className="bg-zinc-900 border-white/10 text-white text-xs h-8"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] text-zinc-300 font-semibold">
                                        Season Subtitle (Optional)
                                    </label>
                                    <Input
                                        value={seasonTitle}
                                        onChange={(e) => setSeasonTitle(e.target.value)}
                                        placeholder="e.g. Chapter 2: The Upside Down"
                                        className="bg-zinc-900 border-white/10 text-white text-xs h-8"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] text-zinc-300 font-semibold">
                                    Season-Specific YouTube Trailer Link <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="url"
                                    value={seasonTrailer}
                                    onChange={(e) => setSeasonTrailer(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="bg-zinc-900 border-white/10 text-white text-xs h-8"
                                />
                                <p className="text-[10px] text-zinc-400">
                                    Each season can have its own dedicated official YouTube trailer link.
                                </p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] text-zinc-300 font-semibold">
                                    Synopsis
                                </label>
                                <Textarea
                                    value={seasonSynopsis}
                                    onChange={(e) => setSeasonSynopsis(e.target.value)}
                                    placeholder="Synopsis for this specific season..."
                                    rows={2}
                                    className="bg-zinc-900 border-white/10 text-white text-xs resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowAddSeason(false)}
                                    className="text-xs text-zinc-400"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isAddingSeason}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                                >
                                    {isAddingSeason ? "Adding..." : "Save Season"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Active Season Details & Episodes */}
                    {activeSeason && !showAddSeason && (
                        <div className="space-y-6">
                            {/* Season Header and Trailer Preview */}
                            <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-base text-white">
                                                Season {activeSeason.seasonNumber}
                                                {activeSeason.title ? `: ${activeSeason.title}` : ""}
                                            </h3>
                                        </div>
                                        {activeSeason.synopsis && (
                                            <p className="text-xs text-zinc-400 mt-1">
                                                {activeSeason.synopsis}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteSeason(activeSeason.id)}
                                        className="text-red-400 border-red-500/30 hover:bg-red-950/30 text-xs h-7 self-start sm:self-auto"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete Season
                                    </Button>
                                </div>

                                {/* Trailer Preview if present */}
                                {trailerEmbedUrl ? (
                                    <div className="space-y-1.5 pt-2">
                                        <div className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                                            <Video className="h-3.5 w-3.5 text-red-500" />
                                            Season {activeSeason.seasonNumber} Trailer Embed
                                        </div>
                                        <div className="relative aspect-video max-w-xl mx-auto rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
                                            <iframe
                                                src={trailerEmbedUrl}
                                                title={`Trailer Season ${activeSeason.seasonNumber}`}
                                                className="w-full h-full border-0"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center text-xs text-zinc-500">
                                        No YouTube trailer URL saved for Season {activeSeason.seasonNumber}.
                                    </div>
                                )}
                            </div>

                            {/* Episodes in Season */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                        <Film className="h-4 w-4 text-red-500" />
                                        Episodes ({activeSeason.episodes?.length || 0})
                                    </h4>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setShowAddEpisode(!showAddEpisode)}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs h-7 gap-1"
                                    >
                                        <Plus className="h-3 w-3" />
                                        {showAddEpisode ? "Cancel Episode" : "Add Episode"}
                                    </Button>
                                </div>

                                {/* Add Episode Form */}
                                {showAddEpisode && (
                                    <form
                                        onSubmit={handleAddEpisode}
                                        className="rounded-xl border border-white/10 bg-zinc-900/80 p-3.5 space-y-3"
                                    >
                                        <h5 className="text-xs font-semibold text-white">
                                            New Episode for Season {activeSeason.seasonNumber}
                                        </h5>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-zinc-300 font-semibold">
                                                    Episode # <span className="text-red-400">*</span>
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={episodeNumber}
                                                    onChange={(e) => setEpisodeNumber(e.target.value)}
                                                    min={1}
                                                    required
                                                    className="bg-zinc-950 border-white/10 text-white text-xs h-8"
                                                />
                                            </div>
                                            <div className="sm:col-span-2 space-y-1">
                                                <label className="text-[10px] text-zinc-300 font-semibold">
                                                    Episode Title <span className="text-red-400">*</span>
                                                </label>
                                                <Input
                                                    value={episodeTitle}
                                                    onChange={(e) => setEpisodeTitle(e.target.value)}
                                                    placeholder="e.g. Chapter One: The Vanishing"
                                                    required
                                                    className="bg-zinc-950 border-white/10 text-white text-xs h-8"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-zinc-300 font-semibold">
                                                    Duration (Minutes)
                                                </label>
                                                <Input
                                                    type="number"
                                                    value={episodeDuration}
                                                    onChange={(e) => setEpisodeDuration(e.target.value)}
                                                    min={1}
                                                    className="bg-zinc-950 border-white/10 text-white text-xs h-8"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] text-zinc-300 font-semibold">
                                                    Stream / Video URL
                                                </label>
                                                <Input
                                                    value={episodeVideoUrl}
                                                    onChange={(e) => setEpisodeVideoUrl(e.target.value)}
                                                    placeholder="https://..."
                                                    className="bg-zinc-950 border-white/10 text-white text-xs h-8"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-300 font-semibold">
                                                Synopsis
                                            </label>
                                            <Textarea
                                                value={episodeSynopsis}
                                                onChange={(e) => setEpisodeSynopsis(e.target.value)}
                                                rows={2}
                                                placeholder="Episode description..."
                                                className="bg-zinc-950 border-white/10 text-white text-xs resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2 pt-1">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setShowAddEpisode(false)}
                                                className="text-xs text-zinc-400 h-7"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={isAddingEpisode}
                                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold h-7"
                                            >
                                                {isAddingEpisode ? "Adding..." : "Save Episode"}
                                            </Button>
                                        </div>
                                    </form>
                                )}

                                {/* Episode List */}
                                <div className="space-y-2">
                                    {(activeSeason.episodes || []).map((ep) => (
                                        <div
                                            key={ep.id}
                                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-white/15 transition-all text-xs"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 font-bold text-zinc-300">
                                                    {ep.episodeNumber}
                                                </span>
                                                <div>
                                                    <span className="font-bold text-white">
                                                        {ep.title}
                                                    </span>
                                                    {ep.duration && (
                                                        <span className="text-zinc-500 ml-2">
                                                            ({ep.duration}m)
                                                        </span>
                                                    )}
                                                    {ep.synopsis && (
                                                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                                                            {ep.synopsis}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteEpisode(ep.id)}
                                                className="h-7 w-7 p-0 text-zinc-500 hover:text-red-400"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
