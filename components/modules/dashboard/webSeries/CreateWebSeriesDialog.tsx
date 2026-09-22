"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoviePosterUpload } from "../movie/MoviePosterUpload";
import { createWebSeriesAction } from "@/src/app/(dashboardRoute)/admin/dashboard/web-series-management/_action/createWebSeries.action";
import { Tv, Loader2, Sparkles } from "lucide-react";

interface CreateWebSeriesDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function CreateWebSeriesDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateWebSeriesDialogProps) {
    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [releaseYear, setReleaseYear] = useState(new Date().getFullYear().toString());
    const [language, setLanguage] = useState("English");
    const [country, setCountry] = useState("USA");
    const [pricing, setPricing] = useState<"FREE" | "PREMIUM">("FREE");
    const [posterUrl, setPosterUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setTitle("");
        setSynopsis("");
        setReleaseYear(new Date().getFullYear().toString());
        setLanguage("English");
        setCountry("USA");
        setPricing("FREE");
        setPosterUrl("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Please provide the series title");
            return;
        }

        if (!synopsis.trim()) {
            toast.error("Please provide a synopsis for the series");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await createWebSeriesAction({
                title: title.trim(),
                synopsis: synopsis.trim(),
                releaseYear: parseInt(releaseYear, 10),
                language: language.trim(),
                country: country.trim(),
                pricing,
                posterUrl: posterUrl.trim() || undefined,
            });

            if (res.success) {
                toast.success(`Series "${title}" registered successfully!`);
                resetForm();
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to create web series");
            }
        } catch {
            toast.error("An unexpected error occurred while creating web series");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto bg-zinc-950 border-white/10 text-white p-6 sm:p-8 shadow-2xl">
                <DialogHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 shadow-md shadow-red-600/10">
                            <Tv className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                Add New Web Series
                                <Sparkles className="h-4 w-4 text-amber-400" />
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                                Register television and streaming episodic series with CDN posters, seasons, release years, and access tiers.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Poster Upload Column - 5 cols */}
                        <div className="lg:col-span-5 space-y-3 rounded-2xl bg-zinc-900/40 border border-white/5 p-5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                                Series Key Art / Poster
                            </label>
                            <MoviePosterUpload
                                value={posterUrl}
                                onChange={(url) => setPosterUrl(url)}
                                isSubmitting={isSubmitting}
                            />
                            <p className="text-[11px] text-zinc-500 leading-relaxed mt-2">
                                Cinematic 2:3 vertical aspect ratio poster image for catalog hero displays and carousel cards.
                            </p>
                        </div>

                        {/* Info Fields Column - 7 cols */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                    Series Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Stranger Things, Dark, Succession"
                                    required
                                    className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                        Release Year
                                    </label>
                                    <Input
                                        type="number"
                                        value={releaseYear}
                                        onChange={(e) => setReleaseYear(e.target.value)}
                                        min="1900"
                                        max="2099"
                                        className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                        Language
                                    </label>
                                    <Input
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        placeholder="e.g. English"
                                        className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                        Country
                                    </label>
                                    <Input
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="e.g. USA, UK"
                                        className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                    Access Pricing Tier
                                </label>
                                <Select
                                    value={pricing}
                                    onValueChange={(val: "FREE" | "PREMIUM") => setPricing(val)}
                                >
                                    <SelectTrigger className="bg-zinc-900/80 border-white/10 text-white text-sm h-11 px-3.5 focus:border-red-500/50">
                                        <SelectValue placeholder="Select Pricing Tier" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-white/10 text-white text-sm">
                                        <SelectItem value="FREE">Free Access (Standard)</SelectItem>
                                        <SelectItem value="PREMIUM">Premium Access (VIP Tier)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                                    Series Synopsis / Storyline <span className="text-red-500">*</span>
                                </label>
                                <Textarea
                                    value={synopsis}
                                    onChange={(e) => setSynopsis(e.target.value)}
                                    placeholder="Overview of the series premise, character dynamics, worldbuilding, and plot arc..."
                                    rows={5}
                                    required
                                    className="bg-zinc-900/80 border-white/10 text-white text-sm p-3.5 resize-none leading-relaxed focus:border-red-500/50"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-white/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="text-zinc-400 hover:text-white text-xs h-10 px-5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs h-10 px-6 shadow-lg shadow-red-600/30"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registering Series...
                                </>
                            ) : (
                                "Register Web Series"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
