"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    MessageSquare,
    Search,
    Film,
    Calendar,
    Edit3,
    Trash2,
    ExternalLink,
    CornerDownRight,
    MessageCircle,
    ArrowRight,
} from "lucide-react";
import { IComment } from "@/src/types/movie.types";
import {
    updateUserCommentAction,
    deleteUserCommentAction,
} from "@/src/app/(dashboardRoute)/(userRouteGroup)/(userDashboardLayout)/dashboard/comments/_actions/userComments.action";
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
import { toast } from "sonner";

interface UserCommentsViewProps {
    initialComments: IComment[];
}

export function UserCommentsView({ initialComments }: UserCommentsViewProps) {
    const [comments, setComments] = useState<IComment[]>(initialComments);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

    // Edit modal states
    const [editingComment, setEditingComment] = useState<IComment | null>(null);
    const [editContent, setEditContent] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Delete modal states
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter and sort comments
    const filteredComments = useMemo(() => {
        let list = [...comments];

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(
                (c) =>
                    c.content.toLowerCase().includes(q) ||
                    c.review?.media?.title?.toLowerCase().includes(q)
            );
        }

        return list.sort((a, b) => {
            if (sortBy === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [comments, searchTerm, sortBy]);

    // Open Edit Dialog
    const handleOpenEdit = (comment: IComment) => {
        setEditingComment(comment);
        setEditContent(comment.content);
    };

    // Save Edited Comment
    const handleSaveEdit = async () => {
        if (!editingComment) return;

        if (!editContent.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        setIsUpdating(true);
        try {
            const res = await updateUserCommentAction(editingComment.id, editContent);
            if (res.success) {
                setComments((prev) =>
                    prev.map((c) =>
                        c.id === editingComment.id
                            ? { ...c, content: editContent.trim() }
                            : c
                    )
                );
                toast.success("Comment updated successfully!");
                setEditingComment(null);
            } else {
                toast.error(res.messsage || "Failed to update comment");
            }
        } catch {
            toast.error("An error occurred while updating the comment");
        } finally {
            setIsUpdating(false);
        }
    };

    // Delete Comment
    const handleConfirmDelete = async () => {
        if (!deletingCommentId) return;

        setIsDeleting(true);
        try {
            const res = await deleteUserCommentAction(deletingCommentId);
            if (res.success) {
                setComments((prev) => prev.filter((c) => c.id !== deletingCommentId));
                toast.success("Comment deleted successfully!");
                setDeletingCommentId(null);
            } else {
                toast.error(res.messsage || "Failed to delete comment");
            }
        } catch {
            toast.error("An error occurred while deleting the comment");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 dark:bg-zinc-950/70 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                            <MessageSquare className="h-3.5 w-3.5 fill-current" />
                            <span>Community Voice</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            My Comments & Discussions
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                            View and manage all your thoughts, replies, and community discussion comments across film reviews.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            asChild
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-red-600/25 transition-all"
                        >
                            <Link href="/movies" className="flex items-center gap-2">
                                <Film className="h-4 w-4" />
                                <span>Join Movie Debates</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metric Summary Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 pt-6 border-t border-border/60">
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Total Comments Posted</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{comments.length}</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-1">
                            <MessageCircle className="h-3.5 w-3.5 text-red-500" />
                            <span>Threads Participated</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">
                            {new Set(comments.map((c) => c.reviewId)).size}
                        </span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search your comments or movie titles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-background text-xs h-10 rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        aria-label="Sort comments"
                        className="h-9 px-3 rounded-xl bg-muted border border-border text-xs font-semibold text-foreground outline-none cursor-pointer"
                    >
                        <option value="newest">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Comments List */}
            {filteredComments.length === 0 ? (
                <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mx-auto border border-cyan-500/20">
                        <MessageSquare className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">
                            {comments.length === 0
                                ? "No discussion comments yet"
                                : "No comments match your search"}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                            {comments.length === 0
                                ? "Share your insights! Leave replies and comments under film reviews to exchange views with other film lovers."
                                : "Try modifying your search keywords to find other discussion comments."}
                        </p>
                    </div>

                    <div className="pt-2">
                        {comments.length === 0 ? (
                            <Button
                                asChild
                                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-lg shadow-red-600/25"
                            >
                                <Link href="/movies" className="flex items-center gap-2">
                                    <span>Browse Movies & Reviews</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setSearchTerm("")}
                                className="text-xs h-9 rounded-xl"
                            >
                                Clear Search
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredComments.map((comment) => {
                        const movie = comment.review?.media;

                        return (
                            <div
                                key={comment.id}
                                className="group relative rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 space-y-4"
                            >
                                {/* Header banner linking to the movie */}
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        {/* Mini thumbnail if available */}
                                        <div className="relative h-10 w-8 shrink-0 rounded-lg overflow-hidden bg-muted">
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

                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={movie?.id ? `/movies/${movie.id}` : "#"}
                                                    className="font-bold text-xs sm:text-sm text-foreground hover:text-red-500 transition-colors line-clamp-1"
                                                >
                                                    {movie?.title || "Movie Discussion"}
                                                </Link>
                                                {comment.parentId && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-[10px] px-1.5 py-0 text-cyan-500 border-cyan-500/30 font-semibold"
                                                    >
                                                        <CornerDownRight className="h-2.5 w-2.5 mr-1" />
                                                        Reply
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>
                                                    {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleOpenEdit(comment)}
                                            className="h-8 px-2.5 rounded-lg text-xs gap-1 text-muted-foreground hover:text-foreground"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Edit</span>
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeletingCommentId(comment.id)}
                                            className="h-8 px-2.5 rounded-lg text-xs gap-1 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Delete</span>
                                        </Button>

                                        {movie?.id && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-2.5 rounded-lg text-xs gap-1 text-foreground border-border hover:border-red-500/50"
                                            >
                                                <Link href={`/movies/${movie.id}`}>
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                    <span className="hidden sm:inline">Thread</span>
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Comment Content Box */}
                                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Comment Dialog */}
            <Dialog open={!!editingComment} onOpenChange={(open) => !open && setEditingComment(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <Edit3 className="h-5 w-5 text-red-500" />
                            <span>Edit Comment</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Update your comment text below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Write your comment..."
                            rows={4}
                            className="text-xs rounded-xl"
                        />
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setEditingComment(null)}
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
            <Dialog open={!!deletingCommentId} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
                            <Trash2 className="h-5 w-5" />
                            <span>Delete Comment?</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground pt-1">
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeletingCommentId(null)}
                            disabled={isDeleting}
                            className="text-xs h-9 rounded-xl"
                        >
                            Cancel
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
