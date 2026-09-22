"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IGenre } from "@/src/types/genre.types";
import { IPlatform } from "@/src/types/platform.types";
import { createMovieAction } from "@/src/app/(dashboardRoute)/admin/dashboard/movie-management/_action/createMovie.action";
import { getYouTubeEmbedUrl } from "./movie-helpers";
import { MoviePosterUpload } from "./MoviePosterUpload";
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
    Video,
    Sparkles,
    Check,
    Loader2,
    Layers,
    SquarePlay,
} from "lucide-react";

import { ICast } from "@/src/types/cast.types";
import { IDirector } from "@/src/types/director.types";

interface CreateMovieDialogProps {
    isOpen: boolean;
    onClose: () => void;
    genres: IGenre[];
    platforms: IPlatform[];
    casts?: ICast[];
    directors?: IDirector[];
    onSuccess: () => void;
}

export function CreateMovieDialog({
    isOpen,
    onClose,
    genres,
    platforms,
    casts = [],
    directors = [],
    onSuccess,
}: CreateMovieDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
    const [duration, setDuration] = useState("120");
    const [director, setDirector] = useState("");
    const [selectedDirectorId, setSelectedDirectorId] = useState<string>("");
    const [castInput, setCastInput] = useState("");
    const [selectedCastIds, setSelectedCastIds] = useState<string[]>([]);
    const [language, setLanguage] = useState("English");
    const [country, setCountry] = useState("USA");
    const [pricing, setPricing] = useState<"FREE" | "PREMIUM">("FREE");
    const [youtubeLink, setYoutubeLink] = useState("");

    // Poster URL (from ImageKit) & optional raw file
    const [posterUrl, setPosterUrl] = useState("");
    const [posterFile, setPosterFile] = useState<File | null>(null);

    // Selected relations
    const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
    const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>([]);

    const trailerEmbedUrl = getYouTubeEmbedUrl(youtubeLink, false);

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

    const handleSelectDirector = (dirId: string) => {
        if (dirId === "custom") {
            setSelectedDirectorId("");
            return;
        }
        const match = directors.find((d) => d.id === dirId);
        if (match) {
            setSelectedDirectorId(match.id);
            setDirector(match.name);
        }
    };

    const toggleCast = (c: ICast) => {
        if (selectedCastIds.includes(c.id)) {
            setSelectedCastIds((prev) => prev.filter((id) => id !== c.id));
            const remaining = castInput
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.toLowerCase() !== c.name.toLowerCase())
                .join(", ");
            setCastInput(remaining);
        } else {
            setSelectedCastIds((prev) => [...prev, c.id]);
            const currentNames = castInput
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            if (!currentNames.some((n) => n.toLowerCase() === c.name.toLowerCase())) {
                currentNames.push(c.name);
            }
            setCastInput(currentNames.join(", "));
        }
    };

    const resetForm = () => {
        setTitle("");
        setSynopsis("");
        setReleaseYear(new Date().getFullYear().toString());
        setDuration("120");
        setDirector("");
        setSelectedDirectorId("");
        setCastInput("");
        setSelectedCastIds([]);
        setLanguage("English");
        setCountry("USA");
        setPricing("FREE");
        setYoutubeLink("");
        setPosterUrl("");
        setPosterFile(null);
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
                castIds: selectedCastIds.length > 0 ? selectedCastIds : undefined,
                directorIds: selectedDirectorId ? [selectedDirectorId] : undefined,
                posterUrl: posterUrl.trim() || undefined,
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
            <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto border-white/10 bg-zinc-950 text-white shadow-2xl p-6 sm:p-7">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 shadow-md shadow-red-600/10">
                            <Film className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white tracking-wide">
                                Add New Movie
                            </DialogTitle>
                            <DialogDescription className="text-xs text-zinc-400">
                                Register a film with ImageKit CDN poster, trailer, genres, and streaming platforms.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Main Two-Column Layout on Large Screens */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Media (Poster & Trailer Preview) - 5 cols */}
                        <div className="lg:col-span-5 space-y-5 rounded-2xl bg-zinc-900/30 border border-white/5 p-4 sm:p-5">
                            {/* ImageKit Poster Upload Component (Enlarged cinematic 2:3 ratio) */}
                            <MoviePosterUpload
                                value={posterUrl}
                                onChange={(url, file) => {
                                    setPosterUrl(url);
                                    setPosterFile(file || null);
                                }}
                                isSubmitting={isSubmitting}
                            />

                            {/* Trailer Link & Player */}
                            <div className="space-y-2 pt-3 border-t border-white/5">
                                <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                                    <SquarePlay className="h-3.5 w-3.5 text-red-500" />
                                    YouTube Official Trailer
                                </Label>
                                <Input
                                    value={youtubeLink}
                                    onChange={(e) => setYoutubeLink(e.target.value)}
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    className="border-white/10 bg-zinc-900 text-white text-xs h-9"
                                />

                                {trailerEmbedUrl ? (
                                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black mt-2 shadow-lg">
                                        <iframe
                                            src={trailerEmbedUrl}
                                            title="Trailer preview"
                                            className="h-full w-full border-0"
                                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="relative aspect-video w-full rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 flex flex-col items-center justify-center text-center p-4 mt-2">
                                        <Video className="h-6 w-6 text-zinc-600 mb-1" />
                                        <p className="text-[11px] text-zinc-500">
                                            Enter YouTube URL above to preview player
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Metadata, Genres & Platforms - 7 cols */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Section 1: General Information */}
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
                                            placeholder="e.g. Inception"
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
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-zinc-300">
                                                Director <span className="text-red-500">*</span>
                                            </Label>
                                            {directors.length > 0 && (
                                                <span className="text-[10px] text-zinc-400">
                                                    or pick registered
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                value={director}
                                                onChange={(e) => {
                                                    setDirector(e.target.value);
                                                    setSelectedDirectorId("");
                                                }}
                                                placeholder="e.g. Christopher Nolan"
                                                required
                                                className="border-white/10 bg-zinc-900 text-white text-sm"
                                            />
                                            {directors.length > 0 && (
                                                <Select
                                                    value={selectedDirectorId || "custom"}
                                                    onValueChange={handleSelectDirector}
                                                >
                                                    <SelectTrigger className="border-white/10 bg-zinc-900/80 text-zinc-300 text-xs h-8">
                                                        <SelectValue placeholder="Select from registered directors" />
                                                    </SelectTrigger>
                                                    <SelectContent className="border-white/10 bg-zinc-950 text-white">
                                                        <SelectItem value="custom">Custom / Other Director</SelectItem>
                                                        {directors.map((d) => (
                                                            <SelectItem key={d.id} value={d.id}>
                                                                {d.name} {d.nationality ? `(${d.nationality})` : ""}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
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

                                    <div className="space-y-2 md:col-span-2">
                                        <Label className="text-xs text-zinc-300">
                                            Cast Members (Comma separated) <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={castInput}
                                            onChange={(e) => setCastInput(e.target.value)}
                                            placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page"
                                            required
                                            className="border-white/10 bg-zinc-900 text-white text-sm"
                                        />

                                        {casts.length > 0 && (
                                            <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-3 space-y-2">
                                                <p className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5">
                                                    <Sparkles className="h-3 w-3 text-red-400" />
                                                    Quick-select from registered cast:
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                                                    {casts.map((c) => {
                                                        const isSelected = selectedCastIds.includes(c.id);
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={c.id}
                                                                onClick={() => toggleCast(c)}
                                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                                                    isSelected
                                                                        ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                                                                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                                                }`}
                                                            >
                                                                {isSelected && <Check className="h-3 w-3" />}
                                                                {c.name}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
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

                            {/* Section 2: Genres & Streaming Platforms */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                                    <Layers className="h-3.5 w-3.5" />
                                    Categorization & Platforms
                                </h4>

                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-300">
                                        Genres ({selectedGenreIds.length} selected)
                                    </Label>
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 rounded-xl bg-zinc-900/50 border border-white/5">
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
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2.5 rounded-xl bg-zinc-900/50 border border-white/5">
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
                            className="bg-red-600 text-white hover:bg-red-700 text-xs font-semibold px-6 shadow-lg shadow-red-600/30"
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
