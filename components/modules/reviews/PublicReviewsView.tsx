"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    getPublicReviewsAction,
    IPublicReviewsResponse,
} from "@/src/app/(commonRoute)/reviews/_action/getPublicReviews.action";
import { toggleReviewLikeAction } from "@/src/app/(commonRoute)/movies/_actions/social.action";
import { IReview } from "@/src/types/movie.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Star,
    Search,
    Film,
    Heart,
    MessageSquare,
    ExternalLink,
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Quote,
    Tag as TagIcon,
    X,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PublicReviewsViewProps {
    initialData: IPublicReviewsResponse | null;
}

export function PublicReviewsView({ initialData }: PublicReviewsViewProps) {
    const { user: authUser } = useAuth();

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
    const [page, setPage] = useState(1);
    const limit = 12;

    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
    const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
    const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});

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
    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["public-reviews", { searchTerm, ratingFilter, sortBy, page }],
        queryFn: () =>
            getPublicReviewsAction({
                searchTerm,
                rating: ratingFilter === "ALL" ? undefined : ratingFilter,
                sortBy: sortBy === "highest" || sortBy === "lowest" ? "rating" : "createdAt",
                sortOrder: sortBy === "oldest" || sortBy === "lowest" ? "asc" : "desc",
                page,
                limit,
            }),
        initialData: page === 1 && !searchTerm && ratingFilter === "ALL" && sortBy === "newest" ? initialData : undefined,
        placeholderData: (prev) => prev,
    });

    const reviews = data?.data || [];
    const meta = data?.meta || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1,
    };

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleRevealSpoiler = (id: string) => {
        setRevealedSpoilers((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // Toggle Like
    const handleToggleLike = async (review: IReview) => {
        if (!authUser) {
            toast.error("Please login to like reviews");
            return;
        }

        const currentlyLiked =
            likedMap[review.id] !== undefined
                ? likedMap[review.id]
                : review.likes?.some((l) => l.userId === authUser.id) || false;

        const currentCount =
            likeCountMap[review.id] !== undefined
                ? likeCountMap[review.id]
                : review._count?.likes ?? review.likes?.length ?? 0;

        const nextLiked = !currentlyLiked;
        const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

        setLikedMap((prev) => ({ ...prev, [review.id]: nextLiked }));
        setLikeCountMap((prev) => ({ ...prev, [review.id]: nextCount }));

        try {
            const res = await toggleReviewLikeAction(review.id);
            if (!res.success) {
                // Revert
                setLikedMap((prev) => ({ ...prev, [review.id]: currentlyLiked }));
                setLikeCountMap((prev) => ({ ...prev, [review.id]: currentCount }));
                toast.error(res.messsage || "Failed to toggle like");
            }
        } catch {
            setLikedMap((prev) => ({ ...prev, [review.id]: currentlyLiked }));
            setLikeCountMap((prev) => ({ ...prev, [review.id]: currentCount }));
            toast.error("Error liking review");
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-16">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-background/90 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-80 w-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 -mb-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Community Critic Network</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                            Film Critic Reviews & Ratings
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Discover authentic perspectives, expert critique, and audience scores on cinematic works from certified critics and film lovers.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                            asChild
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-red-600/25"
                        >
                            <Link href="/movies" className="flex items-center gap-2">
                                <Film className="h-4 w-4" />
                                <span>Write a Review</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Subtitle count banner */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border/60 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{meta.total} Approved Reviews</span>
                    <span>•</span>
                    <span>Verified Community Scores</span>
                    <span>•</span>
                    <span>Filtered for Authenticity</span>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reviews by keyword or movie..."
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

                {/* Filters and Sort */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Star Rating buttons */}
                    <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-xs font-semibold overflow-x-auto">
                        <button
                            onClick={() => {
                                setRatingFilter("ALL");
                                setPage(1);
                            }}
                            className={`px-3 py-1 rounded-lg transition-all ${
                                ratingFilter === "ALL"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            All Stars
                        </button>
                        {[5, 4, 3, 2, 1].map((stars) => (
                            <button
                                key={stars}
                                onClick={() => {
                                    setRatingFilter(stars);
                                    setPage(1);
                                }}
                                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-0.5 ${
                                    ratingFilter === stars
                                        ? "bg-background text-amber-400 shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <span>{stars}★</span>
                            </button>
                        ))}
                    </div>

                    {/* Sorter */}
                    <select
                        value={sortBy}
                        onChange={(e) => {
                            setSortBy(e.target.value as any);
                            setPage(1);
                        }}
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

            {/* Reviews Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-muted/40 animate-pulse border border-border/50" />
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
                        <Star className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-foreground">No Approved Reviews Found</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                            {searchTerm || ratingFilter !== "ALL"
                                ? "No reviews match your current filters. Try changing or clearing your search criteria."
                                : "Be the first to share your thoughts on a movie! Rate a film and submit your review."}
                        </p>
                    </div>

                    <div className="pt-2">
                        {searchTerm || ratingFilter !== "ALL" ? (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    handleClearSearch();
                                    setRatingFilter("ALL");
                                }}
                                className="text-xs rounded-xl"
                            >
                                Clear All Filters
                            </Button>
                        ) : (
                            <Button asChild className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl">
                                <Link href="/movies">Browse Cinema Catalog</Link>
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => {
                        const movie = review.media;
                        const user = review.user;
                        const isExpanded = !!expandedIds[review.id];
                        const isSpoilerRevealed = !!revealedSpoilers[review.id];
                        const isLong = review.content.length > 220;

                        const isLiked =
                            likedMap[review.id] !== undefined
                                ? likedMap[review.id]
                                : review.likes?.some((l) => l.userId === authUser?.id) || false;

                        const likeCount =
                            likeCountMap[review.id] !== undefined
                                ? likeCountMap[review.id]
                                : review._count?.likes ?? review.likes?.length ?? 0;

                        const userInitials = user?.name
                            ? user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                            : "C";

                        return (
                            <div
                                key={review.id}
                                className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4"
                            >
                                <Quote className="h-8 w-8 text-muted-foreground/15 absolute top-5 right-5 pointer-events-none" />

                                <div className="space-y-4">
                                    {/* Movie header badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-14 w-10 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
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

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                href={movie?.id ? `/movies/${movie.id}` : "#"}
                                                className="font-bold text-xs sm:text-sm text-foreground hover:text-red-500 line-clamp-1 transition-colors block"
                                            >
                                                {movie?.title}
                                            </Link>
                                            <p className="text-[11px] text-muted-foreground">
                                                {movie?.releaseYear || "Cinema"} • {movie?.duration ? `${movie.duration}m` : "Movie"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stars Rating and Spoiler Warning */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-3.5 w-3.5 ${
                                                            star <= review.rating
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-muted-foreground/30"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-amber-400 ml-1">
                                                {review.rating}.0
                                            </span>
                                        </div>

                                        {review.spoiler && (
                                            <Badge
                                                variant="destructive"
                                                className="text-[9px] px-1.5 py-0 uppercase font-bold"
                                            >
                                                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                                                Spoiler
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Content Body */}
                                    <div className="relative text-xs text-foreground/90 leading-relaxed italic">
                                        {review.spoiler && !isSpoilerRevealed ? (
                                            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-center space-y-2">
                                                <p className="text-[11px] font-semibold text-destructive">
                                                    This review contains plot spoilers.
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleRevealSpoiler(review.id)}
                                                    className="text-[10px] h-7 px-2.5 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg"
                                                >
                                                    Reveal Content
                                                </Button>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className={!isExpanded && isLong ? "line-clamp-4" : ""}>
                                                    "{review.content}"
                                                </p>
                                                {isLong && (
                                                    <button
                                                        onClick={() => toggleExpand(review.id)}
                                                        className="mt-1 text-xs text-red-500 font-semibold hover:underline flex items-center gap-0.5 not-italic"
                                                    >
                                                        <span>{isExpanded ? "Show Less" : "Read More"}</span>
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-3 w-3" />
                                                        ) : (
                                                            <ChevronDown className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    {review.tags && review.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {review.tags.slice(0, 3).map((t) => (
                                                <Badge
                                                    key={t.tagId || t.tag?.name}
                                                    variant="secondary"
                                                    className="text-[10px] px-1.5 py-0 rounded-md"
                                                >
                                                    <TagIcon className="h-2.5 w-2.5 mr-1 text-red-500" />
                                                    {t.tag?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Reviewer details footer & Engagement */}
                                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Avatar className="h-7 w-7 rounded-full">
                                            {user?.image ? (
                                                <AvatarImage src={user.image} alt={user.name || "Critic"} />
                                            ) : null}
                                            <AvatarFallback className="text-[10px] bg-red-600/20 text-red-500 font-bold">
                                                {userInitials}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-foreground line-clamp-1">
                                                {user?.name || "Verified Cinephile"}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Likes & Comments counters */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleLike(review)}
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
                                            title="Like this review"
                                        >
                                            <Heart
                                                className={`h-3.5 w-3.5 transition-transform active:scale-125 ${
                                                    isLiked ? "fill-red-500 text-red-500" : ""
                                                }`}
                                            />
                                            <span className="text-[11px] font-semibold">{likeCount}</span>
                                        </button>

                                        <Link
                                            href={movie?.id ? `/movies/${movie.id}#reviews` : "#"}
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan-400 transition-colors"
                                            title="View discussion thread"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            <span className="text-[11px] font-semibold">
                                                {review._count?.comments ?? review.comments?.length ?? 0}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {meta.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                    <p className="text-xs text-muted-foreground">
                        Showing page <span className="font-bold text-foreground">{meta.page}</span> of{" "}
                        <span className="font-bold text-foreground">{meta.totalPages}</span> ({meta.total} reviews)
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
        </div>
    );
}
