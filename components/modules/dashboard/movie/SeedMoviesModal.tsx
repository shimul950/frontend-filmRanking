"use client";

import { useState } from "react";
import Image from "next/image";
import {
    SEED_MOVIES_50,
    ISeedMovie,
    SEED_GENRE_COUNTS,
    getSeedMoviesByGenre,
} from "@/src/data/movie-seed-data";
import { createMovieAction } from "@/src/app/(dashboardRoute)/admin/dashboard/movie-management/_action/createMovie.action";
import { IGenre } from "@/src/types/genre.types";
import { IPlatform } from "@/src/types/platform.types";
import { IMovie } from "@/src/types/movie.types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
    Sparkles,
    CheckCircle2,
    XCircle,
    Loader2,
    Film,
    AlertCircle,
    Filter,
} from "lucide-react";

interface SeedMoviesModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingMovies: IMovie[];
    genres: IGenre[];
    platforms: IPlatform[];
    onSuccess: () => void;
}

export function SeedMoviesModal({
    isOpen,
    onClose,
    existingMovies,
    genres,
    platforms,
    onSuccess,
}: SeedMoviesModalProps) {
    const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>("all");
    const [isSeeding, setIsSeeding] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [statusLogs, setStatusLogs] = useState<{ title: string; success: boolean; message?: string }[]>([]);
    const [isComplete, setIsComplete] = useState(false);

    const existingTitles = new Set(existingMovies.map((m) => m.title.trim().toLowerCase()));

    // Active pool of movies based on genre selection
    const moviesToConsider: ISeedMovie[] =
        selectedGenreFilter === "all"
            ? SEED_MOVIES_50
            : getSeedMoviesByGenre(selectedGenreFilter);

    const handleStartSeeding = async () => {
        setIsSeeding(true);
        setIsComplete(false);
        setStatusLogs([]);
        setCurrentIndex(0);

        let successCount = 0;
        let skipCount = 0;
        let failCount = 0;

        for (let i = 0; i < moviesToConsider.length; i++) {
            const movie = moviesToConsider[i];
            setCurrentIndex(i + 1);

            // Skip if already in database
            if (existingTitles.has(movie.title.trim().toLowerCase())) {
                skipCount++;
                setStatusLogs((prev) => [
                    ...prev,
                    { title: movie.title, success: true, message: "Already exists in catalog (skipped)" },
                ]);
                continue;
            }

            // Map genre keywords to existing genre IDs
            const matchedGenreIds: string[] = [];
            movie.genreKeywords.forEach((kw) => {
                const found = genres.find(
                    (g) =>
                        g.name.toLowerCase() === kw.toLowerCase() ||
                        g.name.toLowerCase().includes(kw.toLowerCase()) ||
                        kw.toLowerCase().includes(g.name.toLowerCase())
                );
                if (found && !matchedGenreIds.includes(found.id)) {
                    matchedGenreIds.push(found.id);
                }
            });

            // Map platform keywords to existing platform IDs
            const matchedPlatformIds: string[] = [];
            movie.platformKeywords.forEach((pk) => {
                const found = platforms.find(
                    (p) =>
                        p.name.toLowerCase() === pk.toLowerCase() ||
                        p.name.toLowerCase().includes(pk.toLowerCase()) ||
                        pk.toLowerCase().includes(p.name.toLowerCase())
                );
                if (found && !matchedPlatformIds.includes(found.id)) {
                    matchedPlatformIds.push(found.id);
                }
            });

            const moviePayload = {
                title: movie.title,
                synopsis: movie.synopsis,
                releaseYear: movie.releaseYear,
                duration: movie.duration,
                director: movie.director,
                cast: movie.cast,
                language: movie.language,
                country: movie.country,
                pricing: movie.pricing,
                youtubeLink: movie.youtubeLink,
                genreIds: matchedGenreIds.length > 0 ? matchedGenreIds : undefined,
                platformIds: matchedPlatformIds.length > 0 ? matchedPlatformIds : undefined,
                posterUrl: movie.posterUrl,
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(moviePayload));

            // Attempt to fetch poster as blob to upload to Cloudinary/backend
            try {
                const imgRes = await fetch(movie.posterUrl, { mode: "cors" });
                if (imgRes.ok) {
                    const blob = await imgRes.blob();
                    const cleanName = movie.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
                    formData.append("file", blob, `${cleanName}.jpg`);
                }
            } catch {
                // If CORS prevents client-side fetch, backend still gets posterUrl in JSON
            }

            try {
                const res = await createMovieAction(formData);
                if (res.success) {
                    successCount++;
                    setStatusLogs((prev) => [
                        ...prev,
                        { title: movie.title, success: true, message: "Added successfully" },
                    ]);
                } else {
                    failCount++;
                    setStatusLogs((prev) => [
                        ...prev,
                        { title: movie.title, success: false, message: res.messsage || "Failed" },
                    ]);
                }
            } catch (err: unknown) {
                failCount++;
                const errMsg = err instanceof Error ? err.message : "Error";
                setStatusLogs((prev) => [
                    ...prev,
                    { title: movie.title, success: false, message: errMsg },
                ]);
            }
        }

        setIsSeeding(false);
        setIsComplete(true);
        toast.success(
            `Seeding completed! ${successCount} added, ${skipCount} skipped, ${failCount} failed.`
        );
        onSuccess();
    };

    const progressPercentage =
        moviesToConsider.length > 0
            ? Math.round((currentIndex / moviesToConsider.length) * 100)
            : 0;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !isSeeding && !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-border bg-card text-card-foreground shadow-2xl">
                {/* Header */}
                <DialogHeader className="p-6 border-b border-border bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-600 dark:text-red-500 border border-red-500/20">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold tracking-tight">
                                    Curated Movie Catalog Seeder
                                </DialogTitle>
                                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                    Populate your catalog with minimum 10 iconic movies for every genre (Action, Sci-Fi, Horror, Comedy, Animation, Romance, Drama, Crime, Fantasy, Adventure).
                                </DialogDescription>
                            </div>
                        </div>

                        <Badge
                            variant="outline"
                            className="text-xs px-2.5 py-1 bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 font-semibold shrink-0"
                        >
                            {moviesToConsider.length} Titles Ready
                        </Badge>
                    </div>

                    {/* Genre Quick Filter Bar */}
                    <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                        <div className="flex items-center gap-1 text-muted-foreground font-semibold shrink-0 pr-1">
                            <Filter className="h-3 w-3" />
                            <span>Genre:</span>
                        </div>

                        <button
                            disabled={isSeeding}
                            onClick={() => setSelectedGenreFilter("all")}
                            className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                                selectedGenreFilter === "all"
                                    ? "bg-red-600 text-white shadow-sm"
                                    : "bg-muted hover:bg-accent text-muted-foreground"
                            }`}
                        >
                            All ({SEED_MOVIES_50.length})
                        </button>

                        {SEED_GENRE_COUNTS.map((g) => {
                            const isSelected = selectedGenreFilter === g.genre;
                            return (
                                <button
                                    key={g.genre}
                                    disabled={isSeeding}
                                    onClick={() => setSelectedGenreFilter(g.genre)}
                                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                                        isSelected
                                            ? "bg-red-600 text-white shadow-sm"
                                            : "bg-muted hover:bg-accent text-muted-foreground"
                                    }`}
                                >
                                    {g.genre} ({g.count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress Bar (Visible during and after seeding) */}
                    {(isSeeding || isComplete) && (
                        <div className="mt-4 space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-muted-foreground">
                                    {isComplete
                                        ? "Seeding finished!"
                                        : `Processing title ${currentIndex} of ${moviesToConsider.length}...`}
                                </span>
                                <span className="text-foreground">{progressPercentage}%</span>
                            </div>
                            <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                </DialogHeader>

                {/* Movie Preview / Status Log Grid */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[50vh]">
                    {statusLogs.length > 0 ? (
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Seeding Activity Log
                            </h4>
                            <div className="space-y-1.5">
                                {statusLogs.slice(-12).reverse().map((log, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                                            log.success
                                                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                                : "bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 font-medium">
                                            {log.success ? (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                            ) : (
                                                <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                                            )}
                                            <span>{log.title}</span>
                                        </div>
                                        <span className="text-[11px] opacity-80">{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {selectedGenreFilter === "all"
                                        ? "Catalog Preview (80 Titles across 10 Genres)"
                                        : `${selectedGenreFilter} Movies (${moviesToConsider.length} Titles Available)`}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                    {genres.length} genres & {platforms.length} platforms available for linking
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {moviesToConsider.slice(0, 10).map((m, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative rounded-xl overflow-hidden border border-border bg-card shadow-sm"
                                    >
                                        <div className="relative aspect-[2/3] w-full bg-muted">
                                            <Image
                                                src={m.posterUrl}
                                                alt={m.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 20vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                                            <div className="absolute bottom-2 left-2 right-2 text-white">
                                                <div className="text-xs font-bold truncate">{m.title}</div>
                                                <div className="text-[10px] text-zinc-300 flex items-center justify-between mt-0.5">
                                                    <span>{m.releaseYear}</span>
                                                    <span>{m.genreKeywords[0]}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-3.5 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                            <span>10+ Movies per Genre Guarantee</span>
                        </div>
                        <p>
                            • Every genre in the selector contains at least 10 curated films with high-res TMDB posters, cast, directors, and official trailers.
                        </p>
                        <p>
                            • Already existing movies will be safely skipped to avoid duplicate database entries.
                        </p>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        disabled={isSeeding}
                        className="text-xs"
                    >
                        {isComplete ? "Done" : "Cancel"}
                    </Button>

                    <div className="flex items-center gap-2">
                        {isComplete ? (
                            <Button
                                size="sm"
                                onClick={() => {
                                    onClose();
                                    onSuccess();
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                Close & Refresh Catalog
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                onClick={handleStartSeeding}
                                disabled={isSeeding}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md shadow-red-600/30"
                            >
                                {isSeeding ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                                        Seeding {currentIndex} / {moviesToConsider.length}...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                        {selectedGenreFilter === "all"
                                            ? `Seed All ${moviesToConsider.length} Movies`
                                            : `Seed ${selectedGenreFilter} Movies (${moviesToConsider.length})`}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
