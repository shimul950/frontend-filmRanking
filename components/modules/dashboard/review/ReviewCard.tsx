"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Star,
    Check,
    X,
    Trash2,
    Eye,
    AlertTriangle,
    Film,
    Calendar,
    MessageSquare,
    Heart,
} from "lucide-react";
import { IReview } from "@/src/types/movie.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewCardProps {
    review: IReview;
    onViewDetails: (review: IReview) => void;
    onUpdateStatus: (reviewId: string, status: "APPROVED" | "REJECTED" | "PENDING") => void;
    onDelete: (review: IReview) => void;
    isUpdating: boolean;
}

export default function ReviewCard({
    review,
    onViewDetails,
    onUpdateStatus,
    onDelete,
    isUpdating,
}: ReviewCardProps) {
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
        <div className="group relative rounded-2xl border border-border/80 bg-card p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4">
            {/* Top header: Movie details & Status */}
            <div className="flex items-start gap-3.5">
                <div className="relative h-16 w-12 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
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

                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                        <Badge
                            variant="outline"
                            className={`text-[9px] px-1.5 py-0 uppercase tracking-wider font-bold ${
                                review.status === "APPROVED"
                                    ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                                    : review.status === "REJECTED"
                                    ? "text-red-500 border-red-500/30 bg-red-500/10"
                                    : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                            }`}
                        >
                            {review.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{review.rating}.0</span>
                        </div>
                    </div>

                    <Link
                        href={movie?.id ? `/movies/${movie.id}` : "#"}
                        className="text-xs sm:text-sm font-bold text-foreground hover:text-red-500 line-clamp-1 transition-colors block"
                    >
                        {movie?.title || "Unknown Movie"}
                    </Link>

                    <p className="text-[11px] text-muted-foreground">
                        {movie?.releaseYear || "—"}
                    </p>
                </div>
            </div>

            {/* Review Content */}
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {review.content}
                </p>
                {review.spoiler && (
                    <Badge
                        variant="destructive"
                        className="text-[9px] px-1.5 py-0 uppercase font-bold"
                    >
                        <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                        Contains Spoilers
                    </Badge>
                )}
            </div>

            {/* Reviewer and meta info */}
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 rounded-full">
                        {user?.image ? (
                            <AvatarImage src={user.image} alt={user.name || "User"} />
                        ) : null}
                        <AvatarFallback className="text-[9px] bg-red-600/20 text-red-500 font-bold">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground line-clamp-1">
                        {user?.name || "User"}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span>{review._count?.likes ?? review.likes?.length ?? 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-cyan-400" />
                        <span>{review._count?.comments ?? review.comments?.length ?? 0}</span>
                    </span>
                </div>
            </div>

            {/* Action buttons strip */}
            <div className="pt-2 flex items-center justify-between gap-1 border-t border-border/40">
                <div className="flex items-center gap-1">
                    {review.status !== "APPROVED" && (
                        <Button
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => onUpdateStatus(review.id, "APPROVED")}
                            className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1 font-semibold"
                        >
                            <Check className="h-3 w-3" />
                            <span>Approve</span>
                        </Button>
                    )}

                    {review.status !== "REJECTED" && (
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() => onUpdateStatus(review.id, "REJECTED")}
                            className="h-7 px-2 text-xs text-amber-500 border-amber-500/30 hover:bg-amber-500/10 rounded-lg gap-1 font-semibold"
                        >
                            <X className="h-3 w-3" />
                            <span>Reject</span>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onViewDetails(review)}
                        title="Inspect details"
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                        <Eye className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={isUpdating}
                        onClick={() => onDelete(review)}
                        title="Delete review"
                        className="h-7 w-7 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
