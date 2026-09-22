"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Star,
    Search,
    Film,
    Calendar,
    MessageSquare,
    Heart,
    Edit3,
    Trash2,
    AlertTriangle,
    CheckCircle2,
    ExternalLink,
    Clock,
    Tag as TagIcon,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { IReview } from "@/src/types/movie.types";
import {
    updateUserReviewAction,
    deleteUserReviewAction,
} from "@/src/app/(dashboardRoute)/(userRouteGroup)/(userDashboardLayout)/dashboard/reviews/_actions/userReviews.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import { toast } from "sonner";

interface UserReviewsViewProps {
    initialReviews: IReview[];
}

export function UserReviewsView({ initialReviews }: UserReviewsViewProps) {
    const [reviews, setReviews] = useState<IReview[]>(initialReviews);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "ALL">("ALL");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

    // Dialog states
    const [editingReview, setEditingReview] = useState<IReview | null>(null);
    const [editRating, setEditRating] = useState<number>(5);
    const [editContent, setEditContent] = useState<string>("");
    const [editSpoiler, setEditSpoiler] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Derived statistics
    const stats = useMemo(() => {
        const total = reviews.length;
        const avg =
            total > 0
                ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / total
                : 0;
        const spoilers = reviews.filter((r) => r.spoiler).length;
        return {
            total,
            avgRating: formatRating(avg),
            spoilers,
        };
    }, [reviews]);

    // Filtered & sorted reviews
    const filteredReviews = useMemo(() => {
        let list = [...reviews];

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (r) =>
                    r.content.toLowerCase().includes(q) ||
                    r.media?.title?.toLowerCase().includes(q)
            );
        }

        if (selectedRatingFilter !== "ALL") {
            list = list.filter((r) => r.rating === selectedRatingFilter);
        }

        return list.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case "highest":
                    return b.rating - a.rating;
                case "lowest":
                    return a.rating - b.rating;
                case "newest":
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });
    }, [reviews, searchTerm, selectedRatingFilter, sortBy]);

    // Toggle expand for long content
    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Open Edit Dialog
    const handleOpenEdit = (review: IReview) => {
        setEditingReview(review);
        setEditRating(review.rating);
        setEditContent(review.content);
        setEditSpoiler(!!review.spoiler);
    };

    // Submit Edit
    const handleSaveEdit = async () => {
        if (!editingReview) return;

        if (editContent.trim().length < 5) {
            toast.error("Review content must be at least 5 characters long");
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateUserReviewAction(editingReview.id, {
                rating: editRating,
                content: editContent.trim(),
                spoiler: editSpoiler,
            });

            if (res.success) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r.id === editingReview.id
                            ? {
                                  ...r,
                                  rating: editRating,
                                  content: editContent.trim(),
                                  spoiler: editSpoiler,
                              }
                            : r
                    )
                );
                toast.success("Review updated successfully!");
                setEditingReview(null);
            } else {
                toast.error(res.messsage || "Failed to update review");
            }
        } catch {
            toast.error("An error occurred while updating the review");
        } finally {
            setIsUpdating(false);
        }
    };

    // Submit Delete
    const handleConfirmDelete = async () => {
        if (!deletingReviewId) return;

        setIsDeleting(true);
        try {
            const res = await deleteUserReviewAction(deletingReviewId);
            if (res.success) {
                setReviews((prev) => prev.filter((r) => r.id !== deletingReviewId));
                toast.success("Review removed successfully!");
                setDeletingReviewId(null);
            } else {
                toast.error(res.messsage || "Failed to delete review");
            }
        } catch {
            toast.error("An error occurred while deleting the review");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 dark:bg-zinc-950/70 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span>Critic Notebook</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            My Film Reviews & Ratings
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                            Manage all your film reviews, community scores, and discussion feedback in one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-red-600/25 transition-all"
                        >
                            <Link href="/movies" className="flex items-center gap-2">
                                <Film className="h-4 w-4" />
                                <span>Review More Movies</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/60">
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span>Total Reviews</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{stats.total}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <Film className="h-3.5 w-3.5 text-red-500" />
                            <span>Average Rating Given</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{stats.avgRating} / 5.0</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                            <span>Spoiler Warnings</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{stats.spoilers}</span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by movie title or review content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-background text-xs h-10 rounded-xl"
                    />
                </div>

                {/* Rating Filter Tabs & Sort Sorter */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Rating buttons */}
                    <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-xs font-semibold overflow-x-auto">
                        <button
                            onClick={() => setSelectedRatingFilter("ALL")}
                            className={`px-3 py-1 rounded-lg transition-all ${
                                selectedRatingFilter === "ALL"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            All ({reviews.length})
                        </button>
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = reviews.filter((r) => r.rating === stars).length;
                            return (
                                <button
                                    key={stars}
                                    onClick={() => setSelectedRatingFilter(stars)}
                                    className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                                        selectedRatingFilter === stars
                                            ? "bg-background text-amber-400 shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <span>{stars}★</span>
                                    <span className="text-[10px] text-muted-foreground">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Sorter */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        aria-label="Sort reviews"
                        className="h-9 px-3 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground outline-none cursor-pointer"
                    >
                        <option value="newest">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length === 0 ? (
                <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
                        <Star className="h-8 w-8 fill-current" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">
                            {reviews.length === 0
                                ? "You haven't written any reviews yet"
                                : "No reviews match your filters"}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                            {reviews.length === 0
                                ? "Rate and review films to build your personal critic record, help other cinephiles, and earn badges."
                                : "Try clearing your search query or adjusting your rating filters to see more reviews."}
                        </p>
                    </div>

                    <div className="pt-2">
                        {reviews.length === 0 ? (
                            <Button
                                asChild
                                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-lg shadow-red-600/25"
                            >
                                <Link href="/movies">Browse Cinema Catalog</Link>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedRatingFilter("ALL");
                                }}
                                className="text-xs h-9 rounded-xl"
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((review) => {
                        const movie = review.media;
                        const isExpanded = !!expandedIds[review.id];
                        const isLong = review.content.length > 280;

                        return (
                            <div
                                key={review.id}
                                className="group relative rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row gap-5">
                                    {/* Movie Poster Thumbnail */}
                                    <div className="relative h-32 w-24 shrink-0 rounded-xl overflow-hidden bg-muted shadow-md border border-border/50">
                                        {movie?.posterUrl ? (
                                            <Image
                                                src={movie.posterUrl}
                                                alt={movie.title || "Movie poster"}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Film className="h-8 w-8 opacity-40" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Review Body */}
                                    <div className="flex-1 min-w-0 space-y-3">
                                        {/* Header row */}
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Link
                                                        href={movie?.id ? `/movies/${movie.id}` : "#"}
                                                        className="text-base sm:text-lg font-bold text-foreground hover:text-red-500 transition-colors line-clamp-1"
                                                    >
                                                        {movie?.title || "Movie Title"}
                                                    </Link>
                                                    {movie?.releaseYear && (
                                                        <span className="text-xs text-muted-foreground font-semibold">
                                                            ({movie.releaseYear})
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Stars Rating */}
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-4 w-4 ${
                                                                    star <= review.rating
                                                                        ? "fill-amber-400 text-amber-400"
                                                                        : "text-muted-foreground/30"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-bold text-amber-400">
                                                        {review.rating}.0 / 5.0
                                                    </span>
                                                    {review.spoiler && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="text-[10px] px-1.5 py-0 uppercase tracking-wide font-bold"
                                                        >
                                                            Spoiler
                                                        </Badge>
                                                    )}
                                                    {review.status && (
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-[10px] px-1.5 py-0 uppercase tracking-wider font-semibold ${
                                                                review.status === "APPROVED"
                                                                    ? "text-emerald-500 border-emerald-500/30"
                                                                    : review.status === "REJECTED"
                                                                    ? "text-red-500 border-red-500/30"
                                                                    : "text-amber-400 border-amber-500/30"
                                                            }`}
                                                        >
                                                            {review.status}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Top right actions */}
                                            <div className="flex items-center gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(review)}
                                                    className="h-8 px-2.5 rounded-lg text-xs gap-1 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">Edit</span>
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeletingReviewId(review.id)}
                                                    className="h-8 px-2.5 rounded-lg text-xs gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">Delete</span>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Content text */}
                                        <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                            <p className={!isExpanded && isLong ? "line-clamp-3" : ""}>
                                                {review.content}
                                            </p>
                                            {isLong && (
                                                <button
                                                    onClick={() => toggleExpand(review.id)}
                                                    className="mt-1 text-xs text-red-500 font-semibold hover:underline flex items-center gap-0.5"
                                                >
                                                    <span>{isExpanded ? "Show Less" : "Read Full Review"}</span>
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-3 w-3" />
                                                    ) : (
                                                        <ChevronDown className="h-3 w-3" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Tags if available */}
                                        {review.tags && review.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {review.tags.map((t) => (
                                                    <Badge
                                                        key={t.tagId || t.tag?.name}
                                                        variant="secondary"
                                                        className="text-[10px] px-2 py-0.5 rounded-md"
                                                    >
                                                        <TagIcon className="h-2.5 w-2.5 mr-1 text-red-500" />
                                                        {t.tag?.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Footer: timestamp, likes, comments, and movie link */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <Heart className="h-3.5 w-3.5 text-red-500" />
                                                    <span>{review._count?.likes ?? review.likes?.length ?? 0}</span>
                                                </span>

                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                                                    <span>{review._count?.comments ?? review.comments?.length ?? 0}</span>
                                                </span>
                                            </div>

                                            {movie?.id && (
                                                <Button
                                                    asChild
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto p-0 text-xs text-red-500 hover:text-red-400 font-bold"
                                                >
                                                    <Link href={`/movies/${movie.id}`} className="flex items-center gap-1">
                                                        <span>Go to Movie Page</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Review Dialog */}
            <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
                <DialogContent className="sm:max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Edit3 className="h-5 w-5 text-red-500" />
                            <span>Edit Film Review</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Update your star rating, thoughts, or spoiler settings for {editingReview?.media?.title}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                        {/* Interactive Star Picker */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Your Rating</label>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setEditRating(star)}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                className={`h-7 w-7 cursor-pointer ${
                                                    star <= editRating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-muted-foreground/30 hover:text-amber-400/50"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-amber-400 ml-2">
                                    {editRating} Star{editRating > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>

                        {/* Content Textarea */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-foreground">Review Content</label>
                            <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Share your thoughtful perspective on this film..."
                                rows={5}
                                className="text-xs rounded-xl"
                            />
                            <p className="text-[11px] text-muted-foreground text-right">
                                {editContent.length} / 1000 characters
                            </p>
                        </div>

                        {/* Spoiler Checkbox */}
                        <div className="flex items-center gap-2 pt-1">
                            <input
                                type="checkbox"
                                id="edit-spoiler"
                                checked={editSpoiler}
                                onChange={(e) => setEditSpoiler(e.target.checked)}
                                className="h-4 w-4 rounded border-border accent-red-600 cursor-pointer"
                            />
                            <label
                                htmlFor="edit-spoiler"
                                className="text-xs text-foreground cursor-pointer select-none font-medium flex items-center gap-1.5"
                            >
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                <span>This review contains major plot spoilers</span>
                            </label>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setEditingReview(null)}
                            disabled={isUpdating}
                            className="text-xs h-9 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            disabled={isUpdating}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 px-4 rounded-xl font-bold"
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deletingReviewId} onOpenChange={(open) => !open && setDeletingReviewId(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
                            <Trash2 className="h-5 w-5" />
                            <span>Delete Review?</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground pt-1">
                            Are you sure you want to permanently delete this review? This action cannot be undone and will remove your score and contributions.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeletingReviewId(null)}
                            disabled={isDeleting}
                            className="text-xs h-9 rounded-xl"
                        >
                            Keep Review
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 px-4 rounded-xl font-bold"
                        >
                            {isDeleting ? "Deleting..." : "Permanently Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
