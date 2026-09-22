"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Star,
    Check,
    X,
    Trash2,
    AlertTriangle,
    Film,
    Calendar,
    Heart,
    MessageSquare,
    ExternalLink,
    Tag as TagIcon,
} from "lucide-react";
import { IReview } from "@/src/types/movie.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ReviewDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    review: IReview | null;
    onUpdateStatus: (reviewId: string, status: "APPROVED" | "REJECTED" | "PENDING") => void;
    onDelete: (review: IReview) => void;
    isUpdating: boolean;
}

export default function ReviewDetailsDialog({
    isOpen,
    onClose,
    review,
    onUpdateStatus,
    onDelete,
    isUpdating,
}: ReviewDetailsDialogProps) {
    if (!review) return null;

    const movie = review.media;
    const user = review.user;

    const userInitials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-xl rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center justify-between gap-2">
                        <span>Review Moderation Details</span>
                        <Badge
                            variant="outline"
                            className={`text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold ${
                                review.status === "APPROVED"
                                    ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                                    : review.status === "REJECTED"
                                    ? "text-red-500 border-red-500/30 bg-red-500/10"
                                    : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                            }`}
                        >
                            {review.status}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Review ID: {review.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Movie info box */}
                    <div className="flex items-center gap-4 p-3.5 rounded-xl bg-muted/40 border border-border/60">
                        <div className="relative h-16 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
                            {movie?.posterUrl ? (
                                <Image
                                    src={movie.posterUrl}
                                    alt={movie.title || "Movie poster"}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <Film className="h-4 w-4 opacity-40" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm text-foreground line-clamp-1">
                                    {movie?.title}
                                </h4>
                                {movie?.id && (
                                    <Link
                                        href={`/movies/${movie.id}`}
                                        target="_blank"
                                        className="text-xs text-red-500 hover:underline flex items-center gap-1 font-semibold"
                                    >
                                        <span>View Page</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Release Year: {movie?.releaseYear || "N/A"} • Rating: ★ {movie?.averageRating || 0} ({movie?.reviewCount || 0} reviews)
                            </p>
                        </div>
                    </div>

                    {/* Reviewer info row */}
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/50 text-xs">
                        <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 rounded-full">
                                {user?.image ? (
                                    <AvatarImage src={user.image} alt={user.name || "User"} />
                                ) : null}
                                <AvatarFallback className="text-xs bg-red-600/20 text-red-500 font-bold">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-foreground">{user?.name || "User"}</p>
                                <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>

                        <div className="text-right text-muted-foreground text-[11px]">
                            <p className="flex items-center gap-1 justify-end">
                                <Calendar className="h-3 w-3" />
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Score and spoiler banner */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
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
                            <span className="text-xs font-black text-amber-400">
                                {review.rating}.0 Stars
                            </span>
                        </div>

                        {review.spoiler ? (
                            <Badge variant="destructive" className="text-[10px] px-2 py-0.5 font-bold">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Contains Spoilers
                            </Badge>
                        ) : (
                            <span className="text-[11px] text-muted-foreground">No spoilers flagged</span>
                        )}
                    </div>

                    {/* Review text */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Review Content
                        </label>
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {review.content}
                        </div>
                    </div>

                    {/* Tags */}
                    {review.tags && review.tags.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Attached Tags
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                                {review.tags.map((t) => (
                                    <Badge
                                        key={t.tagId || t.tag?.name}
                                        variant="secondary"
                                        className="text-xs px-2 py-0.5 rounded-md"
                                    >
                                        <TagIcon className="h-3 w-3 mr-1 text-red-500" />
                                        {t.tag?.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 border-t border-border/50">
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => onDelete(review)}
                        className="text-xs h-9 rounded-xl gap-1.5"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete Review</span>
                    </Button>

                    <div className="flex items-center gap-2 justify-end flex-1">
                        {review.status !== "REJECTED" && (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isUpdating}
                                onClick={() => onUpdateStatus(review.id, "REJECTED")}
                                className="text-xs h-9 rounded-xl text-amber-500 border-amber-500/30 hover:bg-amber-500/10 gap-1.5 font-bold"
                            >
                                <X className="h-3.5 w-3.5" />
                                <span>Reject Review</span>
                            </Button>
                        )}

                        {review.status !== "APPROVED" && (
                            <Button
                                size="sm"
                                disabled={isUpdating}
                                onClick={() => onUpdateStatus(review.id, "APPROVED")}
                                className="text-xs h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-bold"
                            >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve Review</span>
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
