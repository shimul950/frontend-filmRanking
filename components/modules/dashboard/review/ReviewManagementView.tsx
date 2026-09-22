"use client";

import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllReviewsAdminAction,
    IReviewsAdminResponseData,
} from "@/src/app/(dashboardRoute)/admin/dashboard/review-management/_action/getAllReviewsAdmin.action";
import { updateReviewStatusAdminAction } from "@/src/app/(dashboardRoute)/admin/dashboard/review-management/_action/updateReviewStatusAdmin.action";
import { deleteReviewAdminAction } from "@/src/app/(dashboardRoute)/admin/dashboard/review-management/_action/deleteReviewAdmin.action";
import { IReview } from "@/src/types/movie.types";
import ReviewTable from "./ReviewTable";
import ReviewCard from "./ReviewCard";
import ReviewDetailsDialog from "./ReviewDetailsDialog";
import DeleteReviewDialog from "./DeleteReviewDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    MessageSquareText,
    Search,
    LayoutGrid,
    List,
    Clock,
    CheckCircle2,
    XCircle,
    Star,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    X,
    ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

export default function ReviewManagementView() {
    const queryClient = useQueryClient();

    // Filters and pagination state
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [page, setPage] = useState(1);
    const limit = 10;

    // Modals
    const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [deletingReview, setDeletingReview] = useState<IReview | null>(null);
    const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

    // Debounce search
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            setSearchTerm(value);
            setPage(1);
        }, 350);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
        setPage(1);
    };

    // Query reviews
    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useQuery<IReviewsAdminResponseData | null>({
        queryKey: ["admin-reviews", { searchTerm, statusFilter, ratingFilter, page, limit }],
        queryFn: () =>
            getAllReviewsAdminAction({
                searchTerm,
                status: statusFilter,
                rating: ratingFilter === "ALL" ? undefined : ratingFilter,
                page,
                limit,
            }),
        placeholderData: (prev) => prev,
    });

    const reviews = data?.data || [];
    const meta = data?.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    };

    // Update Status Mutation
    const statusMutation = useMutation({
        mutationFn: async ({
            reviewId,
            status,
        }: {
            reviewId: string;
            status: "APPROVED" | "REJECTED" | "PENDING";
        }) => {
            setIsUpdatingId(reviewId);
            return await updateReviewStatusAdminAction(reviewId, status);
        },
        onSuccess: (res, vars) => {
            setIsUpdatingId(null);
            if (res.success) {
                toast.success(`Review ${vars.status.toLowerCase()} successfully!`);
                queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
                if (selectedReview?.id === vars.reviewId) {
                    setSelectedReview((prev) => (prev ? { ...prev, status: vars.status } : null));
                }
            } else {
                toast.error(res.messsage || "Failed to update review status");
            }
        },
        onError: () => {
            setIsUpdatingId(null);
            toast.error("Network error while updating review");
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async (reviewId: string) => {
            return await deleteReviewAdminAction(reviewId);
        },
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Review deleted successfully!");
                queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
                setDeletingReview(null);
                setIsDetailsOpen(false);
            } else {
                toast.error(res.messsage || "Failed to delete review");
            }
        },
        onError: () => {
            toast.error("Network error while deleting review");
        },
    });

    // Open detail modal
    const handleViewDetails = (review: IReview) => {
        setSelectedReview(review);
        setIsDetailsOpen(true);
    };

    // Open delete dialog
    const handleDeleteReview = (review: IReview) => {
        setDeletingReview(review);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                            <MessageSquareText className="h-3.5 w-3.5" />
                            <span>Editorial Moderation</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                            Review Moderation & Approvals
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                            Approve authentic audience reviews to publish them on movie pages and home spotlights, or reject spoilers and spam.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="h-9 px-3 rounded-xl gap-1.5 text-xs self-start md:self-auto"
                    >
                        <RotateCcw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
                        <span>Refresh Data</span>
                    </Button>
                </div>

                {/* Status Summary Strips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-border/60">
                    <button
                        onClick={() => {
                            setStatusFilter("ALL");
                            setPage(1);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                            statusFilter === "ALL"
                                ? "bg-muted border-foreground/30 shadow-sm"
                                : "bg-muted/30 border-border/50 hover:bg-muted/60"
                        }`}
                    >
                        <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium mb-1">
                            <MessageSquareText className="h-3.5 w-3.5" />
                            <span>Total Reviews</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">{meta.total}</span>
                    </button>

                    <button
                        onClick={() => {
                            setStatusFilter("PENDING");
                            setPage(1);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                            statusFilter === "PENDING"
                                ? "bg-amber-500/15 border-amber-500/50 shadow-sm"
                                : "bg-muted/30 border-border/50 hover:bg-muted/60"
                        }`}
                    >
                        <div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium mb-1">
                            <Clock className="h-3.5 w-3.5 animate-pulse" />
                            <span>Needs Approval</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-amber-400">
                                {statusFilter === "PENDING" ? meta.total : "Filter"}
                            </span>
                            <Badge className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0 border-amber-500/30">
                                Pending
                            </Badge>
                        </div>
                    </button>

                    <button
                        onClick={() => {
                            setStatusFilter("APPROVED");
                            setPage(1);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                            statusFilter === "APPROVED"
                                ? "bg-emerald-500/15 border-emerald-500/50 shadow-sm"
                                : "bg-muted/30 border-border/50 hover:bg-muted/60"
                        }`}
                    >
                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium mb-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approved Live</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">
                            {statusFilter === "APPROVED" ? meta.total : "Filter"}
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            setStatusFilter("REJECTED");
                            setPage(1);
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                            statusFilter === "REJECTED"
                                ? "bg-red-500/15 border-red-500/50 shadow-sm"
                                : "bg-muted/30 border-border/50 hover:bg-muted/60"
                        }`}
                    >
                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium mb-1">
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Rejected</span>
                        </div>
                        <span className="text-2xl font-black text-foreground">
                            {statusFilter === "REJECTED" ? meta.total : "Filter"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Filter & Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search review content..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9 pr-8 bg-background text-xs h-10 rounded-xl"
                    />
                    {searchInput && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Filters, Ratings & View Mode */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Status Tabs */}
                    <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-xs font-semibold">
                        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
                            <button
                                key={st}
                                onClick={() => {
                                    setStatusFilter(st);
                                    setPage(1);
                                }}
                                className={`px-2.5 py-1 rounded-lg transition-all ${
                                    statusFilter === st
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {st === "ALL" ? "All" : st.charAt(0) + st.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>

                    {/* Star Rating Filter */}
                    <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-xs font-semibold">
                        <button
                            onClick={() => {
                                setRatingFilter("ALL");
                                setPage(1);
                            }}
                            className={`px-2 py-1 rounded-lg transition-all ${
                                ratingFilter === "ALL"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Any ★
                        </button>
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <button
                                key={stars}
                                onClick={() => {
                                    setRatingFilter(stars);
                                    setPage(1);
                                }}
                                className={`px-2 py-1 rounded-lg transition-all ${
                                    ratingFilter === stars
                                        ? "bg-background text-amber-400 shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {stars}★
                            </button>
                        ))}
                    </div>

                    {/* View Switcher */}
                    <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-muted-foreground">
                        <button
                            onClick={() => setViewMode("table")}
                            title="Table View"
                            className={`p-1.5 rounded-lg transition-all ${
                                viewMode === "table"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "hover:text-foreground"
                            }`}
                        >
                            <List className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            title="Grid Cards View"
                            className={`p-1.5 rounded-lg transition-all ${
                                viewMode === "grid"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "hover:text-foreground"
                            }`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                    ))}
                </div>
            ) : isError ? (
                <div className="p-12 text-center rounded-2xl border border-destructive/30 bg-destructive/10 space-y-3">
                    <ShieldAlert className="h-10 w-10 text-destructive mx-auto" />
                    <h3 className="text-sm font-bold text-foreground">Failed to load reviews</h3>
                    <p className="text-xs text-muted-foreground">There was an issue communicating with the server.</p>
                    <Button size="sm" onClick={() => refetch()} className="text-xs rounded-xl">
                        Retry Loading
                    </Button>
                </div>
            ) : reviews.length === 0 ? (
                <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                        <MessageSquareText className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No reviews found</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        No reviews match your selected filter criteria. Try clearing your search or switching status tabs.
                    </p>
                    {(searchTerm || statusFilter !== "ALL" || ratingFilter !== "ALL") && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                handleClearSearch();
                                setStatusFilter("ALL");
                                setRatingFilter("ALL");
                            }}
                            className="text-xs rounded-xl mt-2"
                        >
                            Clear All Filters
                        </Button>
                    )}
                </div>
            ) : viewMode === "table" ? (
                <ReviewTable
                    reviews={reviews}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={(id, st) => statusMutation.mutate({ reviewId: id, status: st })}
                    onDelete={handleDeleteReview}
                    isUpdatingId={isUpdatingId}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reviews.map((rev) => (
                        <ReviewCard
                            key={rev.id}
                            review={rev}
                            onViewDetails={handleViewDetails}
                            onUpdateStatus={(id, st) => statusMutation.mutate({ reviewId: id, status: st })}
                            onDelete={handleDeleteReview}
                            isUpdating={isUpdatingId === rev.id}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-muted-foreground">
                        Showing page <span className="font-bold text-foreground">{meta.page}</span> of{" "}
                        <span className="font-bold text-foreground">{meta.totalPages}</span> ({meta.total} total reviews)
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page <= 1 || isFetching}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="h-8 px-3 text-xs rounded-xl gap-1"
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span>Previous</span>
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                                const pNum = i + 1;
                                return (
                                    <Button
                                        key={pNum}
                                        size="sm"
                                        variant={meta.page === pNum ? "default" : "outline"}
                                        onClick={() => setPage(pNum)}
                                        className={`h-8 w-8 text-xs rounded-xl p-0 ${
                                            meta.page === pNum ? "bg-red-600 text-white font-bold" : ""
                                        }`}
                                    >
                                        {pNum}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.page >= meta.totalPages || isFetching}
                            onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                            className="h-8 px-3 text-xs rounded-xl gap-1"
                        >
                            <span>Next</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Inspect Details Modal */}
            <ReviewDetailsDialog
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                review={selectedReview}
                onUpdateStatus={(id, st) => statusMutation.mutate({ reviewId: id, status: st })}
                onDelete={handleDeleteReview}
                isUpdating={statusMutation.isPending || deleteMutation.isPending}
            />

            {/* Delete Review Dialog */}
            <DeleteReviewDialog
                isOpen={!!deletingReview}
                onClose={() => setDeletingReview(null)}
                review={deletingReview}
                onConfirm={() => deletingReview && deleteMutation.mutate(deletingReview.id)}
                isDeleting={deleteMutation.isPending}
            />
        </div>
    );
}
