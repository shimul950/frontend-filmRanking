"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { IGenre } from "@/src/types/genre.types";
import { IPlatform } from "@/src/types/platform.types";
import { createMovieAction } from "@/src/app/(dashboardRoute)/admin/dashboard/movie-management/_action/createMovie.action";
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
    Film,
    Upload,
    Video,
    Sparkles,
    Check,
    Loader2,
} from "lucide-react";

interface CreateMovieDialogProps {
    isOpen: boolean;
    onClose: () => void;
    genres: IGenre[];
    platforms: IPlatform[];
    onSuccess: () => void;
}

export function CreateMovieDialog({
    isOpen,
    onClose,
    genres,
    platforms,
    onSuccess,
}: CreateMovieDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
    const [duration, setDuration] = useState("120");
    const [director, setDirector] = useState("");
    const [castInput, setCastInput] = useState("");
    const [language, setLanguage] = useState("English");
    const [country, setCountry] = useState("USA");
    const [pricing, setPricing] = useState<"FREE" | "PREMIUM">("FREE");
    const [youtubeLink, setYoutubeLink] = useState("");

    // Poster file & preview
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Selected relations
    const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
    const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);

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

    const resetForm = () => {
        setTitle("");
        setSynopsis("");
        setReleaseYear(new Date().getFullYear().toString());
        setDuration("120");
        setDirector("");
        setCastInput("");
        setLanguage("English");
        setCountry("USA");
        setPricing("FREE");
        setYoutubeLink("");
        setPosterFile(null);
        setPreviewUrl(null);
        setSelectedGenreIds([]);
        setSelectedPlatformIds([]);
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

        if (!director.trim()) {
            toast.error("Director name is required");
            return;
        }

        const parsedCast = castInput
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);

        if (parsedCast.length === 0) {
            toast.error("Please provide at least one cast member");
            return;
        }

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
                genreIds: selectedGenreIds.length > 0 ? selectedGenreIds : undefined,
                platformIds: selectedPlatformIds.length > 0 ? selectedPlatformIds : undefined,
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(moviePayload));
            if (posterFile) {
                formData.append("file", posterFile);
            }

            const res = await createMovieAction(formData);

            if (res.success) {
                toast.success(`"${title}" registered successfully!`);
                resetForm();
                onSuccess();
                onClose();
            } else {
                toast.error(res.messsage || "Failed to create movie");
            }
        } catch (error) {
            console.error("Create movie error:", error);
            toast.error("An unexpected error occurred while creating the movie.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-white/10 bg-zinc-950 text-white shadow-2xl p-6">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                            <Film className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-white tracking-wide">
                                Add New Movie
                            </DialogTitle>
                            <DialogDescription className="text-xs text-zinc-400">
                                Register a film with media, trailer, genres, and streaming platforms.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Section 1: Basic Information */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
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
                                    placeholder="e.g. Oppenheimer"
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
                                    placeholder="Enter film plot summary (min 10 characters)..."
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
                                    placeholder="120"
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
                                    placeholder="e.g. Christopher Nolan"
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
                                    Cast Members (Comma separated) <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    value={castInput}
                                    onChange={(e) => setCastInput(e.target.value)}
                                    placeholder="Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr."
                                    required
                                    className="border-white/10 bg-zinc-900 text-white text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-zinc-300">Language</Label>
                                <Input
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    placeholder="English"
                                    className="border-white/10 bg-zinc-900 text-white text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-zinc-300">Country</Label>
                                <Input
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="USA"
                                    className="border-white/10 bg-zinc-900 text-white text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Poster & Trailer Link */}
                    <div className="space-y-4 pt-2 border-t border-white/5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                            <Video className="h-3.5 w-3.5" />
                            Poster & Trailer Media
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            {/* Poster File Upload */}
                            <div className="space-y-2">
                                <Label className="text-xs text-zinc-300">Movie Poster Image</Label>
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
                                            Supports JPG, PNG, WEBP up to 5MB.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* YouTube Trailer Link with Live Preview */}
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

                    {/* Section 3: Genres & Streaming Platforms */}
                    <div className="space-y-4 pt-2 border-t border-white/5">
                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">
                                Genres ({selectedGenreIds.length} selected)
                            </Label>
                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-zinc-900/50 border border-white/5">
                                {genres.length === 0 ? (
                                    <span className="text-xs text-zinc-500">No genres found.</span>
                                ) : (
                                    genres.map((genre) => {
                                        const isSelected = selectedGenreIds.includes(genre.id);
                                        return (
                                            <Badge
                                                key={genre.id}
                                                variant="outline"
                                                onClick={() => toggleGenre(genre.id)}
                                                className={`cursor-pointer transition-all px-2.5 py-1 text-xs select-none ${
                                                    isSelected
                                                        ? "bg-red-600 border-red-500 text-white font-semibold shadow-sm shadow-red-600/30"
                                                        : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                                                }`}
                                            >
                                                {isSelected && <Check className="h-3 w-3 mr-1" />}
                                                {genre.name}
                                            </Badge>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs text-zinc-300">
                                Streaming Platforms ({selectedPlatformIds.length} selected)
                            </Label>
                            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-zinc-900/50 border border-white/5">
                                {platforms.length === 0 ? (
                                    <span className="text-xs text-zinc-500">No platforms found.</span>
                                ) : (
                                    platforms.map((platform) => {
                                        const isSelected = selectedPlatformIds.includes(platform.id);
                                        return (
                                            <Badge
                                                key={platform.id}
                                                variant="outline"
                                                onClick={() => togglePlatform(platform.id)}
                                                className={`cursor-pointer transition-all px-2.5 py-1 text-xs select-none ${
                                                    isSelected
                                                        ? "bg-cyan-600 border-cyan-500 text-white font-semibold shadow-sm shadow-cyan-600/30"
                                                        : "bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/30"
                                                }`}
                                            >
                                                {isSelected && <Check className="h-3 w-3 mr-1" />}
                                                {platform.name}
                                            </Badge>
                                        );
                                    })
                                )}
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
                            className="bg-red-600 text-white hover:bg-red-700 text-xs font-semibold px-5 shadow-lg shadow-red-600/30"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                                    Registering Film...
                                </>
                            ) : (
                                "Create Movie"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
