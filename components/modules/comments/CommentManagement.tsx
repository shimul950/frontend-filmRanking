"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { IComment } from "@/src/types/movie.types";
import {
    createCommentAction,
    updateCommentAction,
    deleteCommentAction,
    getReviewCommentsAction,
} from "@/src/app/(commonRoute)/movies/_actions/social.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    CornerDownRight,
    Send,
    Edit3,
    Trash2,
    Loader2,
    ChevronDown,
    ChevronUp,
    Shield,
    Sparkles,
    AlertCircle,
    X,
    Check,
} from "lucide-react";

export interface CommentManagementProps {
    reviewId: string;
    reviewAuthorId?: string;
    initialComments?: IComment[];
    compact?: boolean;
    onCommentCountChange?: (count: number) => void;
}

export interface ICommentNode extends IComment {
    children: ICommentNode[];
}

// Helper to format friendly relative time
function formatRelativeTime(dateString: string): string {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 45) return "just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return "yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
    } catch {
        return "recently";
    }
}

// Build hierarchical comment tree
function buildCommentTree(comments: IComment[]): ICommentNode[] {
    const nodeMap = new Map<string, ICommentNode>();
    const roots: ICommentNode[] = [];

    // Initialize node map
    for (const comment of comments) {
        nodeMap.set(comment.id, {
            ...comment,
            children: [],
        });
    }

    // Attach children to parents
    for (const comment of comments) {
        const node = nodeMap.get(comment.id)!;

        // If comment has replies in its payload, ensure they are in nodeMap
        if (Array.isArray(comment.replies) && comment.replies.length > 0) {
            for (const rep of comment.replies) {
                if (!nodeMap.has(rep.id)) {
                    nodeMap.set(rep.id, { ...rep, children: [] });
                }
            }
        }

        if (comment.parentId && nodeMap.has(comment.parentId)) {
            const parentNode = nodeMap.get(comment.parentId)!;
            if (!parentNode.children.some((c) => c.id === node.id)) {
                parentNode.children.push(node);
            }
        } else if (!comment.parentId) {
            if (!roots.some((r) => r.id === node.id)) {
                roots.push(node);
            }
        } else {
            // Orphaned comment with missing parent: show at root
            if (!roots.some((r) => r.id === node.id)) {
                roots.push(node);
            }
        }
    }

    // Sort roots descending (newest first)
    roots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Recursively sort children ascending (chronological conversation order)
    function sortChildren(node: ICommentNode) {
        node.children.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        for (const child of node.children) {
            sortChildren(child);
        }
    }

    for (const root of roots) {
        sortChildren(root);
    }

    return roots;
}

export function CommentManagement({
    reviewId,
    reviewAuthorId,
    initialComments,
    compact = false,
    onCommentCountChange,
}: CommentManagementProps) {
    const { user } = useAuth();

    const [comments, setComments] = useState<IComment[]>(initialComments || []);
    const [isLoading, setIsLoading] = useState(!initialComments);
    const [rootCommentText, setRootCommentText] = useState("");
    const [isSubmittingRoot, setIsSubmittingRoot] = useState(false);

    // Replying state
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    // Editing state
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    // Deleting state
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

    // Expanded replies state
    const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

    // Fetch comments if not provided initially
    useEffect(() => {
        let isMounted = true;
        if (!initialComments) {
            setIsLoading(true);
            getReviewCommentsAction(reviewId)
                .then((data) => {
                    if (isMounted) {
                        setComments(data || []);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    console.error("Failed to load review comments:", err);
                    if (isMounted) setIsLoading(false);
                });
        } else {
            setComments(initialComments);
        }
        return () => {
            isMounted = false;
        };
    }, [reviewId, initialComments]);

    // Notify parent of total comment count
    useEffect(() => {
        if (onCommentCountChange) {
            onCommentCountChange(comments.length);
        }
    }, [comments.length, onCommentCountChange]);

    const commentTree = useMemo(() => {
        return buildCommentTree(comments);
    }, [comments]);

    const toggleReplies = (commentId: string) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    // Submit root comment
    const handlePostRootComment = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = rootCommentText.trim();
        if (!trimmed) return;

        if (!user) {
            toast.error("Please login to post comments");
            return;
        }

        setIsSubmittingRoot(true);
        try {
            const res = await createCommentAction({
                reviewId,
                content: trimmed,
            });

            if (res.success) {
                toast.success("Comment posted!");
                setRootCommentText("");
                setComments((prev) => [res.data, ...prev]);
            } else {
                toast.error(res.messsage || "Failed to post comment");
            }
        } catch {
            toast.error("Error posting comment");
        } finally {
            setIsSubmittingRoot(false);
        }
    };

    // Submit reply
    const handlePostReply = async (parentComment: IComment) => {
        const trimmed = replyText.trim();
        if (!trimmed) return;

        if (!user) {
            toast.error("Please login to reply");
            return;
        }

        setIsSubmittingReply(true);
        try {
            const res = await createCommentAction({
                reviewId,
                content: trimmed,
                parentId: parentComment.id,
            });

            if (res.success) {
                toast.success("Reply posted!");
                setReplyText("");
                setReplyingToId(null);
                // Ensure replies list is open so user sees their new reply
                setExpandedReplies((prev) => ({ ...prev, [parentComment.id]: true }));
                setComments((prev) => [...prev, res.data]);
            } else {
                toast.error(res.messsage || "Failed to post reply");
            }
        } catch {
            toast.error("Error posting reply");
        } finally {
            setIsSubmittingReply(false);
        }
    };

    // Submit edit
    const handleSaveEdit = async (commentId: string) => {
        const trimmed = editText.trim();
        if (!trimmed) return;

        setIsSubmittingEdit(true);
        try {
            const res = await updateCommentAction(commentId, {
                content: trimmed,
            });

            if (res.success) {
                toast.success("Comment updated!");
                setComments((prev) =>
                    prev.map((c) => (c.id === commentId ? { ...c, content: trimmed, updatedAt: new Date().toISOString() } : c))
                );
                setEditingCommentId(null);
                setEditText("");
            } else {
                toast.error(res.messsage || "Failed to update comment");
            }
        } catch {
            toast.error("Error updating comment");
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    // Submit delete
    const handleDeleteComment = async (commentId: string) => {
        setIsDeletingId(commentId);
        try {
            const res = await deleteCommentAction(commentId);
            if (res.success) {
                toast.success("Comment deleted");
                // Remove comment and any descendants
                setComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
                setConfirmDeleteId(null);
            } else {
                toast.error(res.messsage || "Failed to delete comment");
            }
        } catch {
            toast.error("Error deleting comment");
        } finally {
            setIsDeletingId(null);
        }
    };

    // Recursive component to render a comment and its nested replies
    const renderCommentNode = (node: ICommentNode, depth = 0) => {
        const isAuthor = reviewAuthorId && node.userId === reviewAuthorId;
        const isAdmin = node.user?.role === "ADMIN" || node.user?.role === "SUPER_ADMIN";
        const isOwnComment = user && node.userId === user.id;
        const canModerate = isOwnComment || (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN"));

        const isEditing = editingCommentId === node.id;
        const isReplying = replyingToId === node.id;
        const isConfirmingDelete = confirmDeleteId === node.id;
        const isCurrentlyDeleting = isDeletingId === node.id;

        const hasChildren = node.children && node.children.length > 0;
        const areRepliesOpen = expandedReplies[node.id] ?? (depth < 1); // Expand first level by default

        return (
            <div
                key={node.id}
                className={`relative group ${depth > 0 ? "pt-2" : "pt-1"}`}
            >
                <div
                    className={`rounded-xl border transition-all duration-200 ${
                        isOwnComment
                            ? "bg-zinc-900/80 border-red-500/20 shadow-sm"
                            : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                    } ${compact ? "p-3" : "p-3.5"}`}
                >
                    {/* Comment Header */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7 border border-white/10 shrink-0">
                                <AvatarImage src={node.user?.image || undefined} alt={node.user?.name || "User"} />
                                <AvatarFallback className="bg-zinc-800 text-xs text-white font-medium">
                                    {node.user?.name ? node.user.name.slice(0, 2).toUpperCase() : "U"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-semibold text-white">
                                    {node.user?.name || "Community Member"}
                                </span>

                                {/* Role Badges */}
                                {isAuthor && (
                                    <Badge
                                        variant="outline"
                                        className="h-4 px-1.5 text-[9px] font-medium border-red-500/40 bg-red-500/10 text-red-400"
                                    >
                                        <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                        Reviewer
                                    </Badge>
                                )}
                                {isAdmin && (
                                    <Badge
                                        variant="outline"
                                        className="h-4 px-1.5 text-[9px] font-medium border-amber-500/40 bg-amber-500/10 text-amber-400"
                                    >
                                        <Shield className="h-2.5 w-2.5 mr-0.5" />
                                        Admin
                                    </Badge>
                                )}
                                {isOwnComment && (
                                    <Badge
                                        variant="outline"
                                        className="h-4 px-1 text-[9px] font-medium border-blue-500/30 bg-blue-500/10 text-blue-400"
                                    >
                                        You
                                    </Badge>
                                )}

                                <span className="text-[10px] text-zinc-500 ml-1">
                                    {formatRelativeTime(node.createdAt)}
                                </span>

                                {node.updatedAt && node.updatedAt !== node.createdAt && (
                                    <span className="text-[10px] text-zinc-500 italic">(edited)</span>
                                )}
                            </div>
                        </div>

                        {/* Top Action Icons (Edit / Delete) */}
                        {canModerate && !isEditing && !isConfirmingDelete && (
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                {isOwnComment && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingCommentId(node.id);
                                            setEditText(node.content);
                                            setReplyingToId(null);
                                        }}
                                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                        title="Edit comment"
                                    >
                                        <Edit3 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(node.id)}
                                    className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Delete comment"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Comment Body / Edit View */}
                    <div className="mt-2 text-xs text-zinc-200 pl-9">
                        {isEditing ? (
                            <div className="space-y-2 mt-1">
                                <Textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    maxLength={500}
                                    rows={2}
                                    className="text-xs bg-zinc-950 border-white/10 text-white rounded-lg focus:border-red-500"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-zinc-500">{editText.length} / 500</span>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setEditingCommentId(null);
                                                setEditText("");
                                            }}
                                            className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
                                        >
                                            <X className="h-3 w-3 mr-1" />
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleSaveEdit(node.id)}
                                            disabled={isSubmittingEdit || !editText.trim()}
                                            className="h-7 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md"
                                        >
                                            {isSubmittingEdit ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Save
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : isConfirmingDelete ? (
                            <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 flex items-center justify-between gap-3 my-1">
                                <span className="text-xs text-red-200 flex items-center gap-1.5">
                                    <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                                    Delete this comment?
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setConfirmDeleteId(null)}
                                        className="h-6 px-2 text-[11px] text-zinc-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeleteComment(node.id)}
                                        disabled={isCurrentlyDeleting}
                                        className="h-6 px-2 text-[11px] bg-red-600 hover:bg-red-700 text-white font-medium"
                                    >
                                        {isCurrentlyDeleting ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            "Confirm"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <p className="whitespace-pre-line leading-relaxed">{node.content}</p>
                        )}
                    </div>

                    {/* Bottom Actions: Reply Button & Replies Toggle */}
                    {!isEditing && !isConfirmingDelete && (
                        <div className="mt-2.5 pl-9 flex items-center gap-4 text-[11px]">
                            {/* Reply Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    if (replyingToId === node.id) {
                                        setReplyingToId(null);
                                        setReplyText("");
                                    } else {
                                        setReplyingToId(node.id);
                                        setReplyText("");
                                        setEditingCommentId(null);
                                    }
                                }}
                                className="inline-flex items-center gap-1 text-zinc-400 hover:text-red-400 font-medium transition-colors"
                            >
                                <CornerDownRight className="h-3.5 w-3.5" />
                                <span>{replyingToId === node.id ? "Cancel Reply" : "Reply"}</span>
                            </button>

                            {/* View / Hide Replies Button */}
                            {hasChildren && (
                                <button
                                    type="button"
                                    onClick={() => toggleReplies(node.id)}
                                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
                                >
                                    {areRepliesOpen ? (
                                        <>
                                            <ChevronUp className="h-3.5 w-3.5 text-red-500" />
                                            <span>Hide {node.children.length} {node.children.length === 1 ? "reply" : "replies"}</span>
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                                            <span className="font-medium text-zinc-300">
                                                View {node.children.length} {node.children.length === 1 ? "reply" : "replies"}
                                            </span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Inline Reply Composer Box */}
                {isReplying && (
                    <div className="mt-2 ml-4 pl-4 border-l-2 border-red-500/30">
                        <div className="bg-zinc-950/90 border border-white/10 p-3 rounded-xl space-y-2.5 shadow-lg">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-400 flex items-center gap-1">
                                    <CornerDownRight className="h-3.5 w-3.5 text-red-400" />
                                    Replying to{" "}
                                    <span className="font-semibold text-white">
                                        @{node.user?.name || "member"}
                                    </span>
                                </span>
                                <button
                                    onClick={() => setReplyingToId(null)}
                                    className="text-zinc-500 hover:text-white"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <Textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Write your reply to ${node.user?.name || "member"}...`}
                                autoFocus
                                maxLength={500}
                                rows={2}
                                className="text-xs bg-zinc-900 border-white/10 text-white rounded-lg focus:border-red-500 placeholder:text-zinc-500"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handlePostReply(node);
                                    }
                                }}
                            />

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-zinc-500">
                                    {replyText.length} / 500 characters
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setReplyingToId(null)}
                                        className="h-7 px-2.5 text-xs text-zinc-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handlePostReply(node)}
                                        disabled={isSubmittingReply || !replyText.trim()}
                                        className="h-7 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md shadow-md shadow-red-600/30"
                                    >
                                        {isSubmittingReply ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="h-3 w-3 mr-1" />
                                                Reply
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nested Threaded Replies */}
                {hasChildren && areRepliesOpen && (
                    <div className="ml-3 sm:ml-4 pl-3 sm:pl-4 border-l-2 border-zinc-800/80 hover:border-zinc-700 transition-colors space-y-2 mt-1">
                        {node.children.map((child) => renderCommentNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Header with Title and Count */}
            <div className="flex items-center justify-between pb-1 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-red-400" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                        Discussion ({comments.length})
                    </h5>
                </div>
                {comments.length > 0 && (
                    <span className="text-[11px] text-zinc-500">
                        {commentTree.length} {commentTree.length === 1 ? "thread" : "threads"}
                    </span>
                )}
            </div>

            {/* Root Add-Comment Composer */}
            {user ? (
                <form
                    onSubmit={handlePostRootComment}
                    className="p-3 rounded-xl bg-zinc-900/60 border border-white/10 space-y-2.5 focus-within:border-red-500/40 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-white/10">
                            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                            <AvatarFallback className="bg-zinc-800 text-[10px] text-white">
                                {user.name ? user.name.slice(0, 1).toUpperCase() : "U"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-zinc-300 font-medium">
                            Commenting as <span className="text-white font-semibold">{user.name}</span>
                        </span>
                    </div>

                    <Textarea
                        value={rootCommentText}
                        onChange={(e) => setRootCommentText(e.target.value)}
                        placeholder="Add to the discussion... (Press Enter to post, Shift+Enter for newline)"
                        maxLength={500}
                        rows={2}
                        className="text-xs bg-zinc-950 border-white/10 text-white rounded-lg focus:border-red-500 placeholder:text-zinc-500 resize-none"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handlePostRootComment();
                            }
                        }}
                    />

                    <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] text-zinc-500">
                            {rootCommentText.length} / 500
                        </span>

                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSubmittingRoot || !rootCommentText.trim()}
                            className="h-7 px-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-red-600/30"
                        >
                            {isSubmittingRoot ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <>
                                    <Send className="h-3 w-3 mr-1" />
                                    Comment
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Join the discussion to share your thoughts.</span>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300"
                    >
                        Sign in <CornerDownRight className="h-3 w-3" />
                    </Link>
                </div>
            )}

            {/* Comment List */}
            {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-6 text-xs text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                    <span>Loading conversation...</span>
                </div>
            ) : commentTree.length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500 italic bg-zinc-950/30 rounded-xl border border-white/5">
                    No comments yet on this review. Be the first to start the conversation!
                </div>
            ) : (
                <div className="space-y-3 pt-1">
                    {commentTree.map((rootNode) => renderCommentNode(rootNode))}
                </div>
            )}
        </div>
    );
}
