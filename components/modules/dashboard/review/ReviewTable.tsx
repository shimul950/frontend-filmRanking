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
} from "lucide-react";
import { IReview } from "@/src/types/movie.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ReviewTableProps {
    reviews: IReview[];
    onViewDetails: (review: IReview) => void;
    onUpdateStatus: (reviewId: string, status: "APPROVED" | "REJECTED" | "PENDING") => void;
    onDelete: (review: IReview) => void;
    isUpdatingId: string | null;
}

export default function ReviewTable({
    reviews,
    onViewDetails,
    onUpdateStatus,
    onDelete,
    isUpdatingId,
}: ReviewTableProps) {
    return (
        <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[220px] font-bold text-xs uppercase tracking-wider">Movie</TableHead>
                        <TableHead className="w-[180px] font-bold text-xs uppercase tracking-wider">Reviewer</TableHead>
                        <TableHead className="w-[100px] font-bold text-xs uppercase tracking-wider">Score</TableHead>
                        <TableHead className="font-bold text-xs uppercase tracking-wider">Content Snippet</TableHead>
                        <TableHead className="w-[110px] font-bold text-xs uppercase tracking-wider text-center">Status</TableHead>
                        <TableHead className="w-[110px] font-bold text-xs uppercase tracking-wider">Date</TableHead>
                        <TableHead className="w-[160px] font-bold text-xs uppercase tracking-wider text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.map((review) => {
                        const movie = review.media;
                        const user = review.user;
                        const isProcessing = isUpdatingId === review.id;

                        const userInitials = user?.name
                            ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                            : "U";

                        return (
                            <TableRow
                                key={review.id}
                                className="hover:bg-muted/30 transition-colors group"
                            >
                                {/* Movie Column */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-12 w-9 shrink-0 rounded-md overflow-hidden bg-muted border border-border/60">
                                            {movie?.posterUrl ? (
                                                <Image
                                                    src={movie.posterUrl}
                                                    alt={movie.title || "Movie poster"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Film className="h-3 w-3 opacity-40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 space-y-0.5">
                                            <Link
                                                href={movie?.id ? `/movies/${movie.id}` : "#"}
                                                className="text-xs font-bold text-foreground hover:text-red-500 line-clamp-1 transition-colors"
                                                title={movie?.title}
                                            >
                                                {movie?.title || "Unknown Movie"}
                                            </Link>
                                            <p className="text-[11px] text-muted-foreground">
                                                {movie?.releaseYear || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Reviewer Column */}
                                <TableCell>
                                    <div className="flex items-center gap-2.5">
                                        <Avatar className="h-7 w-7 rounded-full">
                                            {user?.image ? (
                                                <AvatarImage src={user.image} alt={user.name || "User"} />
                                            ) : null}
                                            <AvatarFallback className="text-[10px] bg-red-600/20 text-red-500 font-bold">
                                                {userInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 space-y-0.5">
                                            <p className="text-xs font-semibold text-foreground line-clamp-1">
                                                {user?.name || "Anonymous"}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                {user?.email || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Rating Score */}
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-xs font-black text-amber-400">
                                            {review.rating}.0
                                        </span>
                                    </div>
                                </TableCell>

                                {/* Content Preview */}
                                <TableCell>
                                    <div className="space-y-1 max-w-[280px]">
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {review.content}
                                        </p>
                                        {review.spoiler && (
                                            <Badge
                                                variant="destructive"
                                                className="text-[9px] px-1 py-0 uppercase font-bold"
                                            >
                                                <AlertTriangle className="h-2 w-2 mr-0.5" />
                                                Spoiler
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>

                                {/* Status Badge */}
                                <TableCell className="text-center">
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
                                </TableCell>

                                {/* Date */}
                                <TableCell className="text-xs text-muted-foreground">
                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {/* Quick Approve button if not already approved */}
                                        {review.status !== "APPROVED" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={isProcessing}
                                                onClick={() => onUpdateStatus(review.id, "APPROVED")}
                                                title="Approve review"
                                                className="h-8 w-8 rounded-lg text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Quick Reject button if not already rejected */}
                                        {review.status !== "REJECTED" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={isProcessing}
                                                onClick={() => onUpdateStatus(review.id, "REJECTED")}
                                                title="Reject review"
                                                className="h-8 w-8 rounded-lg text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Inspect details button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onViewDetails(review)}
                                            title="Inspect review details"
                                            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>

                                        {/* Delete button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={isProcessing}
                                            onClick={() => onDelete(review)}
                                            title="Delete review"
                                            className="h-8 w-8 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
