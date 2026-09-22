"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { IMovie, IReview } from "@/src/types/movie.types";
import { formatDuration, formatRating, getYouTubeEmbedUrl } from "./movie-helpers";
import {
    getMovieReviewsAction,
    createReviewAction,
    toggleReviewLikeAction,
    updateReviewStatusAction,
    deleteReviewAction,
} from "@/src/app/(commonRoute)/movies/_actions/social.action";
import { CommentManagement } from "@/components/modules/comments/CommentManagement";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Star,
    Film,
    Tv,
    Tag as TagIcon,
    Heart,
    MessageSquare,
    Play,
    Send,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    Trash2,
    Loader2,
    ExternalLink,
    AlertTriangle,
    Edit3,
} from "lucide-react";

interface MovieDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    movie: IMovie | null;
    onMovieUpdated?: () => void;
    onEditMovie?: (movie: IMovie) => void;
}

export function MovieDetailsDialog({
    isOpen,
    onClose,
    movie,
    onMovieUpdated,
    onEditMovie,
}: MovieDetailsDialogProps) {
    const [activeTab, setActiveTab] = useState("overview");

    // Reviews & Comments state
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);
    const [selectedReviewIdForComments, setSelectedReviewIdForComments] = useState<string | null>(null);

    // New review form state
    const [showNewReviewForm, setShowNewReviewForm] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newReviewContent, setNewReviewContent] = useState("");
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Spoilers revealed tracker
    const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

    const trailerEmbedUrl = getYouTubeEmbedUrl(movie?.youtubeLink, false);

    const loadReviews = useCallback(async (mediaId: string) => {
        setIsLoadingReviews(true);
        try {
            const data = await getMovieReviewsAction(mediaId);
            setReviews(data);
        } catch (error) {
            console.error("Failed to load reviews:", error);
        } finally {
            setIsLoadingReviews(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen && movie?.id) {
            let ignore = false;
            getMovieReviewsAction(movie.id).then((data) => {
                if (!ignore) {
                    setReviews(data);
                    setIsLoadingReviews(false);
                }
            });
            return () => {
                ignore = true;
            };
        }
    }, [isOpen, movie?.id]);

    const handleSelectReviewForComments = (reviewId: string) => {
        setSelectedReviewIdForComments((prev) => (prev === reviewId ? null : reviewId));
    };

    const handleToggleLike = async (reviewId: string) => {
        try {
            const res = await toggleReviewLikeAction(reviewId);
            if (res.success) {
                toast.success(res.data.liked ? "Liked review" : "Unliked review");
                // Optimistically update
                setReviews((prev) =>
                    prev.map((r) => {
                        if (r.id === reviewId) {
                            const count = r._count?.likes || 0;
                            return {
                                ...r,
                                _count: {
                                    ...r._count,
                                    likes: res.data.liked ? count + 1 : Math.max(0, count - 1),
                                },
                            };
                        }
                        return r;
                    })
                );
            } else {
                toast.error(res.messsage || "Failed to toggle like");
            }
        } catch {
            toast.error("Error toggling like");
        }
    };

    const handleCreateReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!movie) return;

        if (newReviewContent.trim().length < 5) {
            toast.error("Review must be at least 5 characters long");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const res = await createReviewAction({
                mediaId: movie.id,
                rating: newRating,
                content: newReviewContent.trim(),
                spoiler: isSpoiler,
            });

            if (res.success) {
                toast.success("Review submitted successfully!");
                setNewReviewContent("");
                setShowNewReviewForm(false);
                await loadReviews(movie.id);
                onMovieUpdated?.();
            } else {
                toast.error(res.messsage || "Failed to submit review");
            }
        } catch {
            toast.error("Error submitting review");
        } finally {
            setIsSubmittingReview(false);
        }
    };



    const handleReviewStatus = async (reviewId: string, status: "APPROVED" | "REJECTED") => {
        try {
            const res = await updateReviewStatusAction(reviewId, status);
            if (res.success) {
                toast.success(`Review ${status.toLowerCase()}`);
                setReviews((prev) =>
                    prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
                );
            } else {
                toast.error(res.messsage || "Failed to update status");
            }
        } catch {
            toast.error("Error updating review status");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            const res = await deleteReviewAction(reviewId);
            if (res.success) {
                toast.success("Review deleted");
                setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            } else {
                toast.error(res.messsage || "Failed to delete review");
            }
        } catch {
            toast.error("Error deleting review");
        }
    };

    const toggleSpoilerReveal = (reviewId: string) => {
        setRevealedSpoilers((prev) => ({
            ...prev,
            [reviewId]: !prev[reviewId],
        }));
    };

    if (!movie) return null;

    const genresList = movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];
    const platformsList = movie.platforms?.map((p) => p.platform?.name || "").filter(Boolean) || [];

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[94vh] overflow-y-auto border-white/10 bg-zinc-950 text-white shadow-2xl p-0">
                {/* Header Banner */}
                <div className="relative border-b border-white/10 bg-zinc-900/90 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-md">
                                {movie.posterUrl ? (
                                    <Image
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center font-bold text-red-500">
                                        <Film className="h-5 w-5" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                        variant="outline"
                                        className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5"
                                    >
                                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                                        {formatRating(movie.averageRating)}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className={
                                            movie.pricing === "PREMIUM"
                                                ? "border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px]"
                                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                                        }
                                    >
                                        {movie.pricing}
                                    </Badge>
                                    <span className="text-xs text-zinc-400">
                                        {movie.releaseYear} • {formatDuration(movie.duration)}
                                    </span>
                                </div>

                                <DialogTitle className="text-xl font-black text-white tracking-tight">
                                    {movie.title}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-zinc-400">
                                    Directed by {movie.director || "Unknown"}
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                            {onEditMovie && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        onClose();
                                        onEditMovie(movie);
                                    }}
                                    className="border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-600 hover:text-white rounded-xl text-xs gap-1.5 shadow-sm"
                                >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    <span>Edit Movie</span>
                                </Button>
                            )}

                            {movie.youtubeLink && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                    className="border-red-500/30 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded-xl text-xs gap-1.5"
                                >
                                    <a
                                        href={movie.youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Play className="h-3 w-3 fill-current" />
                                        <span>YouTube Trailer</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Tabs Container */}
                <div className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-3 w-full max-w-md bg-zinc-900 border border-white/10 mb-6">
                            <TabsTrigger value="overview" className="text-xs font-semibold">
                                Overview & Trailer
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="text-xs font-semibold">
                                Community Reviews ({reviews.length})
                            </TabsTrigger>
                            <TabsTrigger value="details" className="text-xs font-semibold">
                                Cast & Specs
                            </TabsTrigger>
                        </TabsList>

                        {/* TAB 1: OVERVIEW & TRAILER */}
                        <TabsContent value="overview" className="space-y-6 mt-0">
                            {/* Trailer Player Section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                                        <Play className="h-3.5 w-3.5 fill-current" />
                                        Official Movie Trailer
                                    </h4>
                                    {movie.youtubeLink && (
                                        <span className="text-[11px] text-zinc-500">
                                            HD 1080p • Theater Embed
                                        </span>
                                    )}
                                </div>

                                <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
                                    {trailerEmbedUrl ? (
                                        <iframe
                                            src={trailerEmbedUrl}
                                            title={`${movie.title} Trailer`}
                                            className="h-full w-full border-0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-zinc-500">
                                            <Film className="h-10 w-10 text-zinc-700" />
                                            <p className="text-sm font-semibold text-zinc-300">
                                                No Trailer Available
                                            </p>
                                            <p className="text-xs text-zinc-500 max-w-sm">
                                                Attach a YouTube trailer link via &ldquo;Edit Movie&rdquo; to enable live playback.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Synopsis */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                    Synopsis
                                </h4>
                                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    {movie.synopsis}
                                </p>
                            </div>

                            {/* Genres & Platforms */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                        Associated Genres
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {genresList.length > 0 ? (
                                            genresList.map((g) => (
                                                <Badge
                                                    key={g}
                                                    variant="secondary"
                                                    className="bg-zinc-900 border border-white/10 text-zinc-300 text-xs px-2.5 py-1"
                                                >
                                                    <TagIcon className="h-3 w-3 mr-1 text-red-400" />
                                                    {g}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-zinc-500">No genres attached.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                        Streaming Platforms
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {platformsList.length > 0 ? (
                                            platformsList.map((p) => (
                                                <Badge
                                                    key={p}
                                                    variant="outline"
                                                    className="bg-zinc-950 border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-1"
                                                >
                                                    <Tv className="h-3 w-3 mr-1 text-cyan-400" />
                                                    {p}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-zinc-500">No platforms attached.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* TAB 2: COMMUNITY REVIEWS, RATINGS, COMMENTS & LIKES */}
                        <TabsContent value="reviews" className="space-y-6 mt-0">
                            {/* Reviews Header & Action */}
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-wide">
                                        Community Ratings & Reviews
                                    </h4>
                                    <p className="text-xs text-zinc-400">
                                        Audience reviews, verified ratings, discussion threads, and moderation.
                                    </p>
                                </div>

                                <Button
                                    size="sm"
                                    onClick={() => setShowNewReviewForm((prev) => !prev)}
                                    className="bg-red-600 text-white hover:bg-red-700 text-xs font-semibold shadow-md shadow-red-600/30"
                                >
                                    {showNewReviewForm ? "Cancel Review" : "Write Review"}
                                </Button>
                            </div>

                            {/* Write Review Form */}
                            {showNewReviewForm && (
                                <form
                                    onSubmit={handleCreateReview}
                                    className="p-4 rounded-2xl border border-red-500/20 bg-zinc-900/80 backdrop-blur-md space-y-4"
                                >
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-red-400">
                                        Submit Rating & Review
                                    </h5>

                                    {/* Star Rating Picker */}
                                    <div className="space-y-1.5">
                                        <span className="text-xs text-zinc-300 font-medium">
                                            Select Rating (1 to 5 stars)
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((starVal) => (
                                                <button
                                                    key={starVal}
                                                    type="button"
                                                    onClick={() => setNewRating(starVal)}
                                                    className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 ${
                                                            starVal <= newRating
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-zinc-600"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                            <span className="ml-2 text-xs font-bold text-amber-400">
                                                {newRating} / 5 Stars
                                            </span>
                                        </div>
                                    </div>

                                    {/* Review Textarea */}
                                    <div className="space-y-1.5">
                                        <span className="text-xs text-zinc-300 font-medium">
                                            Review Content
                                        </span>
                                        <Textarea
                                            value={newReviewContent}
                                            onChange={(e) => setNewReviewContent(e.target.value)}
                                            placeholder="Share your thoughts about this movie..."
                                            rows={3}
                                            required
                                            className="border-white/10 bg-zinc-950 text-white text-sm resize-none"
                                        />
                                    </div>

                                    {/* Spoiler Checkbox */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="spoiler-check"
                                            checked={isSpoiler}
                                            onChange={(e) => setIsSpoiler(e.target.checked)}
                                            className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500"
                                        />
                                        <label
                                            htmlFor="spoiler-check"
                                            className="text-xs text-zinc-300 cursor-pointer select-none flex items-center gap-1"
                                        >
                                            <AlertTriangle className="h-3 w-3 text-amber-400" />
                                            Contains Spoilers (Will require user confirmation to reveal)
                                        </label>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button
                                            type="submit"
                                            disabled={isSubmittingReview}
                                            size="sm"
                                            className="bg-red-600 text-white hover:bg-red-700 text-xs font-semibold"
                                        >
                                            {isSubmittingReview ? (
                                                <>
                                                    <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                                    Posting...
                                                </>
                                            ) : (
                                                "Post Review"
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {/* Reviews List */}
                            {isLoadingReviews ? (
                                <div className="flex flex-col items-center justify-center p-12 gap-2 text-zinc-500">
                                    <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                                    <span className="text-xs">Loading community reviews...</span>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30">
                                    <MessageSquare className="h-8 w-8 text-zinc-600 mb-2" />
                                    <p className="text-sm font-semibold text-zinc-300">
                                        No Reviews Yet
                                    </p>
                                    <p className="text-xs text-zinc-500 max-w-xs mt-1">
                                        Be the first to rate & review &ldquo;{movie.title}&rdquo;!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((rev) => {
                                        const isRevealed = revealedSpoilers[rev.id];
                                        const isCommentsOpen = selectedReviewIdForComments === rev.id;

                                        return (
                                            <div
                                                key={rev.id}
                                                className="rounded-2xl border border-white/10 bg-zinc-900/50 p-5 space-y-3 transition-colors hover:border-white/20"
                                            >
                                                {/* Reviewer Header */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-9 w-9 border border-white/10">
                                                            <AvatarImage src={rev.user?.image || undefined} />
                                                            <AvatarFallback className="bg-zinc-800 text-xs font-bold text-white">
                                                                {rev.user?.name?.slice(0, 2).toUpperCase() || "U"}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold text-white">
                                                                    {rev.user?.name || "Community Member"}
                                                                </span>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={
                                                                        rev.status === "APPROVED"
                                                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                                                                            : rev.status === "REJECTED"
                                                                            ? "border-red-500/30 bg-red-500/10 text-red-400 text-[10px]"
                                                                            : "border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px]"
                                                                    }
                                                                >
                                                                    {rev.status}
                                                                </Badge>
                                                            </div>
                                                            <span className="text-[11px] text-zinc-500">
                                                                {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Rating Score Stars */}
                                                    <div className="flex items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded-lg border border-white/5">
                                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                        <span className="text-xs font-bold text-amber-400">
                                                            {rev.rating} / 5
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Review Content (with Spoiler Blur) */}
                                                <div className="relative">
                                                    {rev.spoiler && !isRevealed ? (
                                                        <div className="relative rounded-xl overflow-hidden bg-zinc-950/80 p-4 text-center border border-amber-500/20">
                                                            <p className="text-xs text-zinc-400 blur-sm select-none">
                                                                {rev.content}
                                                            </p>
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[2px] p-2">
                                                                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1.5">
                                                                    <AlertTriangle className="h-3.5 w-3.5" />
                                                                    Contains Spoilers
                                                                </span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => toggleSpoilerReveal(rev.id)}
                                                                    className="h-7 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                                                                >
                                                                    <Eye className="h-3 w-3 mr-1" />
                                                                    Reveal Review
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-zinc-300 leading-relaxed">
                                                                {rev.content}
                                                            </p>
                                                            {rev.spoiler && (
                                                                <button
                                                                    onClick={() => toggleSpoilerReveal(rev.id)}
                                                                    className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 pt-1"
                                                                >
                                                                    <EyeOff className="h-3 w-3" />
                                                                    Hide Spoiler
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Review Action Toolbar: Like, Comments Toggle, Admin Moderate */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                                                    <div className="flex items-center gap-3">
                                                        {/* Like Toggle Button */}
                                                        <button
                                                            onClick={() => handleToggleLike(rev.id)}
                                                            className="flex items-center gap-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                                            title="Like this review"
                                                        >
                                                            <Heart className="h-4 w-4 fill-red-500/10 hover:fill-red-500" />
                                                            <span>{rev._count?.likes || rev.likes?.length || 0} Likes</span>
                                                        </button>

                                                        {/* Comments Toggle Button */}
                                                        <button
                                                            onClick={() => handleSelectReviewForComments(rev.id)}
                                                            className={`flex items-center gap-1.5 transition-colors ${
                                                                isCommentsOpen
                                                                    ? "text-red-400 font-semibold"
                                                                    : "text-zinc-400 hover:text-zinc-200"
                                                            }`}
                                                        >
                                                            <MessageSquare className="h-4 w-4" />
                                                            <span>
                                                                {rev._count?.comments || rev.comments?.length || 0} Comments
                                                            </span>
                                                        </button>
                                                    </div>

                                                    {/* Admin Controls */}
                                                    <div className="flex items-center gap-1">
                                                        {rev.status !== "APPROVED" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleReviewStatus(rev.id, "APPROVED")}
                                                                className="h-7 text-[11px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-2"
                                                            >
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Approve
                                                            </Button>
                                                        )}
                                                        {rev.status !== "REJECTED" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleReviewStatus(rev.id, "REJECTED")}
                                                                className="h-7 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 px-2"
                                                            >
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                Reject
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteReview(rev.id)}
                                                            className="h-7 text-[11px] text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Expanded Comments Thread */}
                                                {isCommentsOpen && (
                                                    <div className="mt-3 pt-3 border-t border-white/5 bg-zinc-950/40 p-3 rounded-xl">
                                                        <CommentManagement
                                                            reviewId={rev.id}
                                                            reviewAuthorId={rev.userId}
                                                            compact
                                                            onCommentCountChange={(count) => {
                                                                setReviews((prev) =>
                                                                    prev.map((r) =>
                                                                        r.id === rev.id
                                                                            ? {
                                                                                  ...r,
                                                                                  _count: {
                                                                                      ...r._count,
                                                                                      comments: count,
                                                                                  },
                                                                              }
                                                                            : r
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>

                        {/* TAB 3: CAST & SPECS */}
                        <TabsContent value="details" className="space-y-4 mt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-zinc-400">Director</span>
                                    <p className="text-sm font-semibold text-white">{movie.director || "N/A"}</p>
                                </div>

                                <div className="space-y-1 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-zinc-400">Language & Country</span>
                                    <p className="text-sm font-semibold text-white">
                                        {movie.language || "English"} ({movie.country || "USA"})
                                    </p>
                                </div>

                                <div className="space-y-1 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-zinc-400">Release Year & Duration</span>
                                    <p className="text-sm font-semibold text-white">
                                        {movie.releaseYear} • {formatDuration(movie.duration)} ({movie.duration} mins)
                                    </p>
                                </div>

                                <div className="space-y-1 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <span className="text-xs text-zinc-400">Status</span>
                                    <p className="text-sm font-semibold text-white">{movie.status}</p>
                                </div>
                            </div>

                            <div className="space-y-2 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                <span className="text-xs text-zinc-400 font-medium">Full Cast Members</span>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {Array.isArray(movie.cast) && movie.cast.length > 0 ? (
                                        movie.cast.map((actor) => (
                                            <Badge
                                                key={actor}
                                                variant="secondary"
                                                className="bg-zinc-800 text-zinc-300 text-xs px-2.5 py-1"
                                            >
                                                {actor}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs text-zinc-500">No cast list available.</span>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
