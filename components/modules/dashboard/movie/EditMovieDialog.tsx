"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { IMovie } from "@/src/types/movie.types";
import { IGenre } from "@/src/types/genre.types";
import { IPlatform } from "@/src/types/platform.types";
import { updateMovieAction } from "@/src/app/(dashboardRoute)/admin/dashboard/movie-management/_action/updateMovie.action";
import { getYouTubeEmbedUrl } from "./movie-helpers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Edit3,
    Upload,
    Video,
    Sparkles,
    Check,
    Loader2,
} from "lucide-react";

interface EditMovieDialogProps {
    isOpen: boolean;
    onClose: () => void;
    movie: IMovie | null;
    genres: IGenre[];
    platforms: IPlatform[];
    onSuccess: () => void;
}

interface EditMovieFormProps {
    movie: IMovie;
    genres: IGenre[];
    platforms: IPlatform[];
    onClose: () => void;
    onSuccess: () => void;
}

function EditMovieForm({
    movie,
    genres,
    platforms,
    onClose,
    onSuccess,
}: EditMovieFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize state directly from movie prop
    const [title, setTitle] = useState(movie.title || "");
    const [synopsis, setSynopsis] = useState(movie.synopsis || "");
    const [releaseYear, setReleaseYear] = useState(movie.releaseYear?.toString() || "");
    const [duration, setDuration] = useState(movie.duration?.toString() || "");
    const [director, setDirector] = useState(movie.director || "");
    const [castInput, setCastInput] = useState(Array.isArray(movie.cast) ? movie.cast.join(", ") : "");
    const [language, setLanguage] = useState(movie.language || "English");
    const [country, setCountry] = useState(movie.country || "USA");
    const [pricing, setPricing] = useState<"FREE" | "PREMIUM">(movie.pricing || "FREE");
    const [youtubeLink, setYoutubeLink] = useState(movie.youtubeLink || "");

    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(movie.posterUrl || null);

    const initialGenreIds = (movie.genres?.map((g) => g.genreId || g.genre?.id).filter(Boolean) || []) as string[];
    const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>(initialGenreIds);

    const initialPlatformIds = (movie.platforms?.map((p) => p.platformId || p.platform?.id).filter(Boolean) || []) as string[];
    const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>(initialPlatformIds);

    const trailerEmbedUrl = getYouTubeEmbedUrl(youtubeLink, false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPosterFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const toggleGenre = (genreId: string) => {
        setSelectedGenreIds((prev) =>
            prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
        );
    };

    const togglePlatform = (platformId: string) => {
        setSelectedPlatformIds((prev) =>
            prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Movie title is required");
            return;
        }

        if (!synopsis.trim() || synopsis.trim().length < 10) {
            toast.error("Synopsis must be at least 10 characters");
            return;
        }

        const parsedCast = castInput
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);

        setIsSubmitting(true);

        try {
            const moviePayload = {
                title: title.trim(),
                synopsis: synopsis.trim(),
                releaseYear: parseInt(releaseYear, 10),
                duration: parseInt(duration, 10),
                director: director.trim(),
                cast: parsedCast,
                language: language.trim(),
                country: country.trim(),
                pricing,
                youtubeLink: youtubeLink.trim() || undefined,
                genreIds: selectedGenreIds,
                platformIds: selectedPlatformIds,
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(moviePayload));
            if (posterFile) {
                formData.append("file", posterFile);
            }

            const res = await updateMovieAction(movie.id, formData);

            if (res.success) {
                toast.success(`"${title}" updated successfully!`);
                onSuccess();
                onClose();
            } else {
                toast.error(res.messsage || "Failed to update movie");
            }
        } catch (error) {
            console.error("Update movie error:", error);
            toast.error("An unexpected error occurred while updating the movie.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            {/* General Info */}
            <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    General Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs text-zinc-300">
                            Movie Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs text-zinc-300">
                            Synopsis / Summary <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                            rows={3}
                            required
                            className="border-white/10 bg-zinc-900 text-white text-sm resize-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">
                            Release Year <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            value={releaseYear}
                            onChange={(e) => setReleaseYear(e.target.value)}
                            min={1888}
                            max={2035}
                            required
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">
                            Duration (Minutes) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            min={1}
                            required
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">
                            Director <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                            required
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">
                            Access / Pricing
                        </Label>
                        <Select
                            value={pricing}
                            onValueChange={(val: "FREE" | "PREMIUM") => setPricing(val)}
                        >
                            <SelectTrigger className="border-white/10 bg-zinc-900 text-white text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-white/10 bg-zinc-950 text-white">
                                <SelectItem value="FREE">FREE (Standard)</SelectItem>
                                <SelectItem value="PREMIUM">PREMIUM (Subscriber Exclusive)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-xs text-zinc-300">
                            Cast Members (Comma separated)
                        </Label>
                        <Input
                            value={castInput}
                            onChange={(e) => setCastInput(e.target.value)}
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Language</Label>
                        <Input
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs text-zinc-300">Country</Label>
                        <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Poster & Trailer Link */}
            <div className="space-y-4 pt-2 border-t border-white/5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5" />
                    Poster & Trailer Media
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* Poster File Upload */}
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-300">Update Poster Image</Label>
                        <div className="flex items-center gap-3">
                            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 flex items-center justify-center">
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Poster preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Upload className="h-6 w-6 text-zinc-600" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="border-white/10 bg-zinc-900 text-xs file:bg-zinc-800 file:text-white file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2"
                                />
                                <p className="text-[11px] text-zinc-500">
                                    Upload a new poster or keep the existing one.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* YouTube Trailer Link */}
                    <div className="space-y-2">
                        <Label className="text-xs text-zinc-300">
                            YouTube Trailer Link
                        </Label>
                        <Input
                            value={youtubeLink}
                            onChange={(e) => setYoutubeLink(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="border-white/10 bg-zinc-900 text-white text-sm"
                        />

                        {trailerEmbedUrl && (
                            <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black mt-2">
                                <iframe
                                    src={trailerEmbedUrl}
                                    title="Trailer preview"
                                    className="h-full w-full border-0"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Genres & Platforms */}
            <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">
                        Genres ({selectedGenreIds.length} selected)
                    </Label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-zinc-900/50 border border-white/5">
                        {genres.map((genre) => {
                            const isSelected = selectedGenreIds.includes(genre.id);
                            return (
                                <Badge
                                    key={genre.id}
                                    variant="outline"
                                    onClick={() => toggleGenre(genre.id)}
                                    className={`cursor-pointer transition-all px-2.5 py-1 text-xs select-none ${
                                        isSelected
                                            ? "bg-amber-600 border-amber-500 text-white font-semibold"
                                            : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    {isSelected && <Check className="h-3 w-3 mr-1" />}
                                    {genre.name}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs text-zinc-300">
                        Streaming Platforms ({selectedPlatformIds.length} selected)
                    </Label>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-zinc-900/50 border border-white/5">
                        {platforms.map((platform) => {
                            const isSelected = selectedPlatformIds.includes(platform.id);
                            return (
                                <Badge
                                    key={platform.id}
                                    variant="outline"
                                    onClick={() => togglePlatform(platform.id)}
                                    className={`cursor-pointer transition-all px-2.5 py-1 text-xs select-none ${
                                        isSelected
                                            ? "bg-cyan-600 border-cyan-500 text-white font-semibold"
                                            : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white"
                                    }`}
                                >
                                    {isSelected && <Check className="h-3 w-3 mr-1" />}
                                    {platform.name}
                                </Badge>
                            );
                        })}
                    </div>
                </div>
            </div>

            <DialogFooter className="border-t border-white/10 pt-4 gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="text-xs text-zinc-400 hover:text-white"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-amber-600 text-white hover:bg-amber-700 text-xs font-semibold px-5 shadow-lg shadow-amber-600/30"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                            Saving Changes...
                        </>
                    ) : (
                        "Update Movie"
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function EditMovieDialog({
    isOpen,
    onClose,
    movie,
    genres,
    platforms,
    onSuccess,
}: EditMovieDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-white/10 bg-zinc-950 text-white shadow-2xl p-6">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-500 border border-amber-500/30">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-white tracking-wide">
                                Edit Movie
                            </DialogTitle>
                            <DialogDescription className="text-xs text-zinc-400">
                                Update metadata, synopsis, streaming platforms, and trailer for &ldquo;{movie?.title}&rdquo;.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {movie && (
                    <EditMovieForm
                        key={movie.id}
                        movie={movie}
                        genres={genres}
                        platforms={platforms}
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
