"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { IMovie, IReview } from "@/src/types/movie.types";
import { formatDuration, formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import { MovieTrailerModal } from "@/components/modules/dashboard/movie/MovieTrailerModal";
import {
    createReviewAction,
    toggleReviewLikeAction,
} from "@/src/app/(commonRoute)/movies/_actions/social.action";
import { CommentManagement } from "@/components/modules/comments/CommentManagement";
import { MovieActionButtons } from "@/components/modules/movies/MovieActionButtons";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Star,
    Play,
    Heart,
    MessageSquare,
    Tv,
    Tag as TagIcon,
    Film,
    ArrowLeft,
    Send,
    Eye,
    EyeOff,
    AlertTriangle,
    Loader2,
    Calendar,
    Clock,
    User as UserIcon,
    Globe,
    Share2,
} from "lucide-react";

interface MovieDetailsViewProps {
    movie: IMovie;
    initialReviews: IReview[];
}

export function MovieDetailsView({ movie, initialReviews }: MovieDetailsViewProps) {
    const { user } = useAuth();

    const [reviews, setReviews] = useState<IReview[]>(initialReviews);
    const [showTrailer, setShowTrailer] = useState(false);

    // Write review state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [reviewContent, setReviewContent] = useState("");
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Active comments accordion
    const [activeReviewCommentsId, setActiveReviewCommentsId] = useState<string | null>(null);

    // Revealed spoilers
    const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

    const genresList = movie.genres?.map((g) => g.genre?.name || "").filter(Boolean) || [];
    const platformsList = movie.platforms?.map((p) => p.platform?.name || "").filter(Boolean) || [];

    const toggleSpoiler = (reviewId: string) => {
        setRevealedSpoilers((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
    };

    const handleToggleComments = (reviewId: string) => {
        setActiveReviewCommentsId((prev) => (prev === reviewId ? null : reviewId));
    };

    const handleToggleLike = async (reviewId: string) => {
        if (!user) {
            toast.error("Please login to like reviews");
            return;
        }

        try {
            const res = await toggleReviewLikeAction(reviewId);
            if (res.success) {
                toast.success(res.data.liked ? "Liked review" : "Removed like");
                setReviews((prev) =>
                    prev.map((r) => {
                        if (r.id === reviewId) {
                            const count = r._count?.likes || r.likes?.length || 0;
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
            toast.error("Error liking review");
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please login to write a review");
            return;
        }

        if (reviewContent.trim().length < 5) {
            toast.error("Review must be at least 5 characters long");
            return;
        }

        setIsSubmittingReview(true);
        try {
            const res = await createReviewAction({
                mediaId: movie.id,
                rating,
                content: reviewContent.trim(),
                spoiler: isSpoiler,
            });

            if (res.success) {
                toast.success("Your review was posted!");
                setReviewContent("");
                setIsSpoiler(false);
                setRating(5);
                setReviews((prev) => [res.data, ...prev]);
            } else {
                toast.error(res.messsage || "Failed to submit review");
            }
        } catch {
            toast.error("Error submitting review");
        } finally {
            setIsSubmittingReview(false);
        }
    };



    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Movie link copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-20">
            {/* Top Navigation Bar */}
            <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
                <Link
                    href="/movies"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Cinema Catalog</span>
                </Link>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="text-xs text-zinc-400 hover:text-white"
                >
                    <Share2 className="h-3.5 w-3.5 mr-1.5" />
                    Share
                </Button>
            </div>

            {/* Hero Cinema Showcase */}
            <div className="relative w-full overflow-hidden bg-zinc-950 border-y border-white/10">
                {/* Backdrop image blur */}
                {movie.posterUrl && (
                    <div className="absolute inset-0 opacity-20 filter blur-3xl scale-110 pointer-events-none">
                        <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent" />

                <div className="relative container mx-auto px-4 py-10 max-w-7xl">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Movie Poster */}
                        <div className="relative w-56 sm:w-64 aspect-[2/3] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/80 mx-auto md:mx-0">
                            {movie.posterUrl ? (
                                <Image
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-zinc-600 font-bold">
                                    <Film className="h-12 w-12 mb-2" />
                                    <span>{movie.title}</span>
                                </div>
                            )}

                            {/* Trailer badge overlay */}
                            {movie.youtubeLink && (
                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[2px]"
                                    aria-label="Play Trailer"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50">
                                        <Play className="h-6 w-6 fill-current ml-1" />
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Movie Metadata */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <Badge
                                    variant="outline"
                                    className="bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold text-xs px-2.5 py-1"
                                >
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                                    {formatRating(movie.averageRating)} / 5.0
                                </Badge>

                                <Badge
                                    variant="outline"
                                    className={
                                        movie.pricing === "PREMIUM"
                                            ? "bg-amber-500/20 border-amber-500/30 text-amber-300 text-xs font-bold"
                                            : "bg-emerald-500/20 border-emerald-500/30 text-emerald-300 text-xs font-bold"
                                    }
                                >
                                    {movie.pricing}
                                </Badge>

                                <span className="text-xs text-zinc-400 flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {movie.releaseYear}
                                </span>

                                <span className="text-zinc-600">•</span>

                                <span className="text-xs text-zinc-400 flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {formatDuration(movie.duration)}
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                                {movie.title}
                            </h1>

                            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                                {movie.synopsis}
                            </p>

                            {/* Genres and Platforms pills */}
                            <div className="space-y-2 pt-2">
                                {genresList.length > 0 && (
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                                        <span className="text-xs text-zinc-500 mr-1">Genres:</span>
                                        {genresList.map((g) => (
                                            <Badge
                                                key={g}
                                                variant="secondary"
                                                className="bg-zinc-900 text-zinc-300 text-xs px-2.5 py-0.5 border border-white/5"
                                            >
                                                <TagIcon className="h-3 w-3 mr-1 text-red-400" />
                                                {g}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {platformsList.length > 0 && (
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5">
                                        <span className="text-xs text-zinc-500 mr-1">Stream On:</span>
                                        {platformsList.map((p) => (
                                            <Badge
                                                key={p}
                                                variant="outline"
                                                className="bg-zinc-950 border-cyan-500/30 text-cyan-300 text-xs px-2.5 py-0.5"
                                            >
                                                <Tv className="h-3 w-3 mr-1 text-cyan-400" />
                                                {p}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions bar */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
                                {movie.youtubeLink && (
                                    <Button
                                        onClick={() => setShowTrailer(true)}
                                        className="bg-red-600 text-white hover:bg-red-700 font-bold px-6 h-11 rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2"
                                    >
                                        <Play className="h-4 w-4 fill-current" />
                                        Watch Official Trailer
                                    </Button>
                                )}

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const el = document.getElementById("reviews-section");
                                        el?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                    className="border-white/10 bg-zinc-900/80 text-white hover:bg-zinc-800 h-11 rounded-xl px-5 text-xs font-semibold"
                                >
                                    <MessageSquare className="h-4 w-4 mr-1.5 text-amber-400" />
                                    <span>Read Reviews ({reviews.length})</span>
                                </Button>

                                <MovieActionButtons movie={movie} variant="hero" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto px-4 py-12 max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left 2 Cols: Reviews, Ratings, Comments */}
                <div id="reviews-section" className="lg:col-span-2 space-y-8">
                    {/* Write a Review Card */}
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white tracking-wide">
                                    Rate & Review &ldquo;{movie.title}&rdquo;
                                </h3>
                                <p className="text-xs text-zinc-400">
                                    Share your cinematic thoughts and rate the film with stars.
                                </p>
                            </div>

                            {/* Live Star Hover Selection */}
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((starVal) => {
                                    const activeScore = hoverRating ?? rating;
                                    return (
                                        <button
                                            key={starVal}
                                            type="button"
                                            onClick={() => setRating(starVal)}
                                            onMouseEnter={() => setHoverRating(starVal)}
                                            onMouseLeave={() => setHoverRating(null)}
                                            className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
                                            aria-label={`Rate ${starVal} stars`}
                                        >
                                            <Star
                                                className={`h-6 w-6 ${
                                                    starVal <= activeScore
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-zinc-700"
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                                <span className="ml-2 text-sm font-bold text-amber-400">
                                    {hoverRating ?? rating} / 5
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <Textarea
                                value={reviewContent}
                                onChange={(e) => setReviewContent(e.target.value)}
                                placeholder="What did you think of the direction, screenplay, cinematography, and score?..."
                                rows={3}
                                className="border-white/10 bg-zinc-950 text-white text-sm resize-none rounded-xl"
                            />

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="user-spoiler-check"
                                        checked={isSpoiler}
                                        onChange={(e) => setIsSpoiler(e.target.checked)}
                                        className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-500"
                                    />
                                    <label
                                        htmlFor="user-spoiler-check"
                                        className="text-xs text-zinc-300 cursor-pointer select-none flex items-center gap-1"
                                    >
                                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                                        This review contains spoilers
                                    </label>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmittingReview}
                                    className="bg-red-600 text-white hover:bg-red-700 text-xs font-semibold px-5 rounded-xl shadow-md shadow-red-600/30"
                                >
                                    {isSubmittingReview ? (
                                        <>
                                            <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Post Review"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Community Reviews List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <h3 className="text-base font-bold text-white tracking-wide">
                                Community Reviews ({reviews.length})
                            </h3>
                            <span className="text-xs text-zinc-500">Sorted by newest</span>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/30">
                                <MessageSquare className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                                <h4 className="text-sm font-bold text-white">No reviews yet</h4>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Be the first audience member to write a review!
                                </p>
                            </div>
                        ) : (
                            reviews.map((rev) => {
                                const isRevealed = revealedSpoilers[rev.id];
                                const isCommentsOpen = activeReviewCommentsId === rev.id;

                                return (
                                    <div
                                        key={rev.id}
                                        className="rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-6 space-y-4 transition-colors hover:border-white/20"
                                    >
                                        {/* Author Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-white/10">
                                                    <AvatarImage src={rev.user?.image || undefined} />
                                                    <AvatarFallback className="bg-zinc-800 text-xs font-bold text-white">
                                                        {rev.user?.name?.slice(0, 2).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-white">
                                                            {rev.user?.name || "Film Enthusiast"}
                                                        </span>
                                                        {rev.status === "APPROVED" && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
                                                            >
                                                                Verified
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-zinc-500">
                                                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>


                                            {/* Stars */}
                                            <div className="flex items-center gap-1 bg-zinc-950 px-3 py-1 rounded-xl border border-white/5">
                                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-bold text-amber-400">
                                                    {rev.rating} / 5
                                                </span>
                                            </div>
                                        </div>

                                        {/* Review Body (with spoiler shield) */}
                                        {rev.spoiler && !isRevealed ? (
                                            <div className="relative rounded-xl overflow-hidden bg-zinc-950 p-6 text-center border border-amber-500/20">
                                                <p className="text-xs text-zinc-500 blur-sm select-none">
                                                    {rev.content}
                                                </p>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-3">
                                                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-2">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        Spoiler Alert
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleSpoiler(rev.id)}
                                                        className="h-8 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                                                    >
                                                        <Eye className="h-3 w-3 mr-1.5" />
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
                                                        onClick={() => toggleSpoiler(rev.id)}
                                                        className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 pt-1"
                                                    >
                                                        <EyeOff className="h-3 w-3" />
                                                        Hide Spoiler
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Toolbar: Like button & Comment trigger */}
                                        <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs text-zinc-400">
                                            <button
                                                onClick={() => handleToggleLike(rev.id)}
                                                className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                                            >
                                                <Heart className="h-4 w-4 fill-red-500/10 hover:fill-red-500" />
                                                <span>{rev._count?.likes || rev.likes?.length || 0} Likes</span>
                                            </button>

                                            <button
                                                onClick={() => handleToggleComments(rev.id)}
                                                className={`flex items-center gap-1.5 transition-colors ${
                                                    isCommentsOpen
                                                        ? "text-red-400 font-semibold"
                                                        : "hover:text-zinc-200"
                                                }`}
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                                <span>
                                                    {rev._count?.comments || rev.comments?.length || 0} Comments
                                                </span>
                                            </button>
                                        </div>

                                        {/* Nested Comments Discussion Section */}
                                        {isCommentsOpen && (
                                            <div className="mt-4 pt-4 border-t border-white/5 bg-zinc-950/60 p-4 rounded-xl">
                                                <CommentManagement
                                                    reviewId={rev.id}
                                                    reviewAuthorId={rev.userId}
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
                            })
                        )}
                    </div>
                </div>

                {/* Right Col: Movie Specifications, Cast & Trailer Widget */}
                <div className="space-y-6">
                    {/* Trailer Video Widget */}
                    {movie.youtubeLink && (
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                                    <Play className="h-3.5 w-3.5 fill-current" />
                                    Movie Trailer
                                </h4>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowTrailer(true)}
                                    className="text-xs text-red-400 hover:text-white h-7 px-2"
                                >
                                    Full Theater
                                </Button>
                            </div>

                            <div
                                onClick={() => setShowTrailer(true)}
                                className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 cursor-pointer group"
                            >
                                {movie.posterUrl ? (
                                    <Image
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        fill
                                        className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-zinc-900" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/50 group-hover:scale-110 transition-transform">
                                        <Play className="h-5 w-5 fill-current ml-0.5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Movie Specs Card */}
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-6 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Film Specifications
                        </h4>

                        <div className="space-y-3 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <UserIcon className="h-3.5 w-3.5" />
                                    Director
                                </span>
                                <span className="font-semibold text-white">{movie.director || "N/A"}</span>
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <Globe className="h-3.5 w-3.5" />
                                    Country & Language
                                </span>
                                <span className="font-semibold text-white">
                                    {movie.country || "USA"} • {movie.language || "English"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <span className="text-zinc-500 flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Runtime
                                </span>
                                <span className="font-semibold text-white">
                                    {formatDuration(movie.duration)} ({movie.duration} min)
                                </span>
                            </div>

                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <span className="text-zinc-500">Release Status</span>
                                <Badge variant="secondary" className="bg-zinc-800 text-white text-[10px]">
                                    {movie.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Cast Members */}
                    <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-md p-6 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                            Starring Cast
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(movie.cast) && movie.cast.length > 0 ? (
                                movie.cast.map((actor) => (
                                    <Badge
                                        key={actor}
                                        variant="secondary"
                                        className="bg-zinc-800/80 text-zinc-300 text-xs px-2.5 py-1 border border-white/5"
                                    >
                                        {actor}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-xs text-zinc-500">Cast list not available.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            <MovieTrailerModal
                isOpen={showTrailer}
                onClose={() => setShowTrailer(false)}
                title={movie.title}
                trailerUrl={movie.youtubeLink}
            />
        </div>
    );
}
