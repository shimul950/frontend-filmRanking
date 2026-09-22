"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
import { updateBannerAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/updateBanner.action";
import { IBanner } from "@/src/types/banner.types";
import {
    Image as ImageIcon,
    Loader2,
    Sparkles,
    Play,
    Star,
    Edit3,
} from "lucide-react";

interface EditBannerDialogProps {
    banner: IBanner | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function EditBannerDialog({
    banner,
    open,
    onOpenChange,
    onSuccess,
}: EditBannerDialogProps) {
    const [title, setTitle] = useState("");
    const [synopsis, setSynopsis] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [posterUrl, setPosterUrl] = useState("");
    const [genre, setGenre] = useState("");
    const [rating, setRating] = useState("4.8");
    const [releaseYear, setReleaseYear] = useState("");
    const [duration, setDuration] = useState("");
    const [pricing, setPricing] = useState<"FREE" | "PREMIUM">("PREMIUM");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [director, setDirector] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [order, setOrder] = useState("0");
    const [isActive, setIsActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (banner) {
            setTitle(banner.title || "");
            setSynopsis(banner.synopsis || "");
            setImageUrl(banner.imageUrl || "");
            setPosterUrl(banner.posterUrl || "");
            setGenre(banner.genre || "");
            setRating(banner.rating ? banner.rating.toString() : "4.8");
            setReleaseYear(banner.releaseYear ? banner.releaseYear.toString() : "");
            setDuration(banner.duration ? banner.duration.toString() : "");
            setPricing(banner.pricing || "PREMIUM");
            setYoutubeLink(banner.youtubeLink || "");
            setDirector(banner.director || "");
            setLinkUrl(banner.linkUrl || "");
            setOrder(banner.order !== undefined ? banner.order.toString() : "0");
            setIsActive(banner.isActive ?? true);
        }
    }, [banner]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!banner) return;

        if (!title.trim()) {
            toast.error("Please provide a banner title");
            return;
        }
        if (!imageUrl.trim()) {
            toast.error("Please provide a backdrop image URL");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await updateBannerAction(banner.id, {
                title: title.trim(),
                synopsis: synopsis.trim() || undefined,
                imageUrl: imageUrl.trim(),
                posterUrl: posterUrl.trim() || undefined,
                genre: genre.trim() || undefined,
                rating: rating ? parseFloat(rating) : 0,
                releaseYear: releaseYear ? parseInt(releaseYear, 10) : undefined,
                duration: duration ? parseInt(duration, 10) : undefined,
                pricing,
                youtubeLink: youtubeLink.trim() || undefined,
                director: director.trim() || undefined,
                linkUrl: linkUrl.trim() || undefined,
                order: order ? parseInt(order, 10) : 0,
                isActive,
            });

            if (res.success) {
                toast.success(`Banner "${title}" updated successfully!`);
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to update banner");
            }
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border-border bg-card/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl">
                <DialogHeader className="space-y-1.5 border-b border-border/60 pb-4 text-left">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                                Edit Spotlight Banner
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                                Update the visuals, metadata, and status of this hero banner slide.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Backdrop Image Input & Live Preview */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span>Wide Backdrop Image URL (16:9 / 21:9) *</span>
                            <span className="text-[11px] text-red-500 font-semibold">Recommended: 1920x1080px+</span>
                        </label>
                        <Input
                            placeholder="https://image.tmdb.org/t/p/original/..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                            className="h-11 rounded-xl bg-background border-border text-sm"
                        />
                        {imageUrl && (
                            <div className="relative aspect-[21/9] w-full max-h-48 overflow-hidden rounded-2xl border border-border/80 bg-zinc-950 shadow-inner mt-2">
                                <Image
                                    src={imageUrl}
                                    alt="Backdrop Preview"
                                    fill
                                    className="object-cover"
                                    onError={() => {}}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                                    <span className="text-xs font-bold text-white drop-shadow">
                                        Backdrop Live Preview
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Title & Genre */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Banner Title *
                            </label>
                            <Input
                                placeholder="e.g. Dune: Part Two"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Genre / Categories
                            </label>
                            <Input
                                placeholder="e.g. Sci-Fi / Adventure"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>
                    </div>

                    {/* Synopsis */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Synopsis / Tagline
                        </label>
                        <Textarea
                            placeholder="Brief dramatic synopsis or promotional tagline that appears over the hero banner..."
                            value={synopsis}
                            onChange={(e) => setSynopsis(e.target.value)}
                            rows={3}
                            className="rounded-xl bg-background border-border text-sm resize-none"
                        />
                    </div>

                    {/* Numeric Row: Rating, Year, Duration, Order */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <Star className="h-3 w-3 text-amber-500" />
                                Rating (0-5)
                            </label>
                            <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Release Year
                            </label>
                            <Input
                                type="number"
                                min="1888"
                                max="2100"
                                value={releaseYear}
                                onChange={(e) => setReleaseYear(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Duration (min)
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Display Order
                            </label>
                            <Input
                                type="number"
                                min="0"
                                value={order}
                                onChange={(e) => setOrder(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>
                    </div>

                    {/* Pricing, Director, YouTube Trailer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Pricing Tier
                            </label>
                            <Select
                                value={pricing}
                                onValueChange={(val: "FREE" | "PREMIUM") => setPricing(val)}
                            >
                                <SelectTrigger className="h-11 rounded-xl bg-background border-border text-sm">
                                    <SelectValue placeholder="Select tier" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border bg-popover">
                                    <SelectItem value="FREE" className="text-xs font-semibold">
                                        FREE Access
                                    </SelectItem>
                                    <SelectItem value="PREMIUM" className="text-xs font-semibold text-amber-500">
                                        PREMIUM Spotlight
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Director
                            </label>
                            <Input
                                placeholder="e.g. Denis Villeneuve"
                                value={director}
                                onChange={(e) => setDirector(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                <Play className="h-3 w-3 text-red-500" />
                                YouTube Trailer URL
                            </label>
                            <Input
                                placeholder="https://www.youtube.com/watch?v=..."
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>
                    </div>

                    {/* Poster URL & Target CTA Link */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Portrait Poster Thumbnail URL
                            </label>
                            <Input
                                placeholder="https://image.tmdb.org/t/p/w500/..."
                                value={posterUrl}
                                onChange={(e) => setPosterUrl(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Target CTA Link
                            </label>
                            <Input
                                placeholder="e.g. /movies/dune-2"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                className="h-11 rounded-xl bg-background border-border text-sm"
                            />
                        </div>
                    </div>

                    {/* Active Status Checkbox */}
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/80 bg-muted/40">
                        <input
                            type="checkbox"
                            id="editIsActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="h-4 w-4 rounded border-border text-red-600 focus:ring-red-500 cursor-pointer"
                        />
                        <label htmlFor="editIsActive" className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer">
                            Active on Homepage Hero Banner
                        </label>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 border-t border-border/60 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl text-xs"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold px-6 shadow-lg shadow-red-600/30 gap-1.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating Banner...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
