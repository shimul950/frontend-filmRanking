"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Star,
    Bookmark,
    MessageSquare,
    Film,
    Sparkles,
    ArrowRight,
    Play,
    User,
    Calendar,
    Clock,
    CheckCircle2,
    Shield,
    ChevronRight,
} from "lucide-react";
import { IUserStatsData } from "@/src/types/stats.types";
import { IReview, IWatchlistItem } from "@/src/types/movie.types";
import { IMeUser } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRating } from "@/components/modules/dashboard/movie/movie-helpers";

interface UserOverviewViewProps {
    currentUser?: IMeUser | null;
    stats: IUserStatsData | null;
    fallbackReviews?: IReview[];
    fallbackWatchlist?: IWatchlistItem[];
}

export function UserOverviewView({
    currentUser,
    stats,
    fallbackReviews = [],
    fallbackWatchlist = [],
}: UserOverviewViewProps) {
    const user = {
        name: currentUser?.name || stats?.userData?.name || "",
        email: currentUser?.email || stats?.userData?.email || "",
        image: currentUser?.image || stats?.userData?.image || null,
        role: currentUser?.role || stats?.userData?.role || "USER",
        status: currentUser?.status || stats?.userData?.status || "ACTIVE",
        createdAt: stats?.userData?.createdAt || undefined,
    };

    const displayName = user.name || (user.email ? user.email.split("@")[0] : "User Profile");

    const reviewCount = stats?.reviewCount ?? fallbackReviews.length ?? 0;
    const wishlistCount = stats?.wishlistCount ?? fallbackWatchlist.length ?? 0;
    const commentCount = stats?.commentCount ?? 0;

    const recentReviews = (stats?.recentReviews && stats.recentReviews.length > 0)
        ? stats.recentReviews
        : fallbackReviews.slice(0, 5);

    const recentWatchlist = (stats?.recentWatchlist && stats.recentWatchlist.length > 0)
        ? stats.recentWatchlist
        : fallbackWatchlist.slice(0, 6);

    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
          })
        : "Member";

    // Dynamic Critic Tier
    const criticTier =
        reviewCount >= 10
            ? { name: "Gold Critic", color: "text-amber-400 border-amber-500/30 bg-amber-500/10" }
            : reviewCount >= 3
            ? { name: "Silver Reviewer", color: "text-zinc-300 border-zinc-400/30 bg-zinc-400/10" }
            : { name: "Film Enthusiast", color: "text-red-400 border-red-500/30 bg-red-500/10" };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Hero Profile Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card/90 via-card/60 to-background/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
                {/* Atmospheric ambient glow */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-10 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    {/* User Identity Info */}
                    <div className="flex items-center gap-5">
                        <Link href="/myProfile" className="group/avatar relative block" title="View Profile">
                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-2 border-red-500/30 shadow-xl ring-4 ring-black/10 group-hover/avatar:border-red-500 group-hover/avatar:scale-105 transition-all">
                                {user.image ? (
                                    <AvatarImage src={user.image} alt={displayName} className="object-cover" />
                                ) : null}
                                <AvatarFallback className="rounded-2xl bg-gradient-to-br from-red-600 to-amber-700 text-white font-black text-2xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Link>

                        <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <Link href="/myProfile" className="hover:text-red-500 transition-colors">
                                    <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                                        {displayName}
                                    </h1>
                                </Link>
                                <Badge
                                    variant="outline"
                                    className={`text-xs px-2.5 py-0.5 font-bold ${criticTier.color}`}
                                >
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    {criticTier.name}
                                </Badge>
                                {user.status === "ACTIVE" && (
                                    <Badge
                                        variant="outline"
                                        className="text-[11px] font-semibold text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Active
                                    </Badge>
                                )}
                            </div>

                            <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>

                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-red-500" />
                                    Member since {memberSince}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:flex items-center gap-1.5">
                                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                                    {user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "Editorial Critic" : "Standard Pass"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <Button
                            asChild
                            variant="outline"
                            className="text-xs h-10 px-4 rounded-xl border-border/80 hover:bg-muted font-semibold flex-1 md:flex-initial"
                        >
                            <Link href="/myProfile" className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Edit Profile</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-red-600/25 transition-all flex-1 md:flex-initial"
                        >
                            <Link href="/movies" className="flex items-center gap-2">
                                <Film className="h-4 w-4" />
                                <span>Browse Movies</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 4 Metric Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Reviews Card */}
                <Link
                    href="/dashboard/reviews"
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">My Reviews</span>
                        <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-3xl font-black text-foreground">{reviewCount}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <span>Written & rated</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-amber-500" />
                        </p>
                    </div>
                </Link>

                {/* Watchlist Card */}
                <Link
                    href="/dashboard/watchlist"
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-xl hover:border-red-500/50 transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">My Watchlist</span>
                        <div className="h-9 w-9 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Bookmark className="h-4 w-4 fill-current" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-3xl font-black text-foreground">{wishlistCount}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <span>Saved cinema queue</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-red-500" />
                        </p>
                    </div>
                </Link>

                {/* Discussion Comments Card */}
                <Link
                    href="/dashboard/comments"
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">My Comments</span>
                        <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-3xl font-black text-foreground">{commentCount}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <span>Discussion contributions</span>
                            <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-cyan-500" />
                        </p>
                    </div>
                </Link>

                {/* Cinephile Rank Card */}
                <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Community Standing</span>
                        <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                            <Sparkles className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="text-xl font-black text-foreground">{criticTier.name}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {reviewCount >= 10
                                ? "Top Tier Contributor"
                                : `${10 - reviewCount} more reviews to Gold`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-muted/40 border border-border/60">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider px-2">
                    Quick Shortcuts
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 rounded-lg hover:bg-card hover:text-foreground"
                    >
                        <Link href="/movies" className="flex items-center gap-1.5">
                            <Film className="h-3.5 w-3.5 text-red-500" />
                            <span>Catalog</span>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 rounded-lg hover:bg-card hover:text-foreground"
                    >
                        <Link href="/dashboard/reviews" className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span>Reviews ({reviewCount})</span>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 rounded-lg hover:bg-card hover:text-foreground"
                    >
                        <Link href="/dashboard/watchlist" className="flex items-center gap-1.5">
                            <Bookmark className="h-3.5 w-3.5 text-red-500" />
                            <span>Watchlist ({wishlistCount})</span>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 rounded-lg hover:bg-card hover:text-foreground"
                    >
                        <Link href="/dashboard/comments" className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
                            <span>Comments ({commentCount})</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Two-Column Activity Section: Recent Reviews & Watchlist Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COLUMN 1: Recent Reviews */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-amber-400" />
                            <h2 className="text-lg font-bold text-foreground">Recent Reviews</h2>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                            <Link href="/dashboard/reviews" className="flex items-center gap-1">
                                <span>View all</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {recentReviews.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
                            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">No Reviews Written Yet</h3>
                            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                Express your cinematic opinions! Browse the movie collection and share your ratings and reviews with the community.
                            </p>
                            <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl mt-1">
                                <Link href="/movies">Write Your First Review</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentReviews.map((review) => {
                                const movie = review.media;
                                return (
                                    <div
                                        key={review.id}
                                        className="group p-4 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all flex gap-3.5"
                                    >
                                        {/* Movie Poster Thumbnail */}
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

                                        {/* Review Info */}
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <Link
                                                    href={movie?.id ? `/movies/${movie.id}` : "#"}
                                                    className="font-bold text-foreground text-xs sm:text-sm hover:text-red-500 transition-colors line-clamp-1"
                                                >
                                                    {movie?.title || "Movie Review"}
                                                </Link>
                                                <div className="flex items-center gap-1 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-bold text-amber-400">
                                                        {review.rating}.0
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {review.content}
                                            </p>

                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                                                <span>
                                                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <Link
                                                    href={`/movies/${review.mediaId}`}
                                                    className="text-red-500 font-semibold hover:underline"
                                                >
                                                    View in Movie
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* COLUMN 2: Watchlist Queue */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <h2 className="text-lg font-bold text-foreground">Watchlist Queue</h2>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                            <Link href="/dashboard/watchlist" className="flex items-center gap-1">
                                <span>View all</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {recentWatchlist.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
                            <div className="h-12 w-12 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center mx-auto">
                                <Bookmark className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Your Queue is Empty</h3>
                            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                Bookmark cinematic masterworks to keep track of movies you want to watch next.
                            </p>
                            <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl mt-1">
                                <Link href="/movies">Discover Movies</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {recentWatchlist.map((item) => {
                                const movie = item.media;
                                if (!movie) return null;
                                return (
                                    <Link
                                        key={item.id || movie.id}
                                        href={`/movies/${movie.id}`}
                                        className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:border-red-500/40 transition-all duration-300"
                                    >
                                        <div className="relative aspect-[2/3] w-full bg-muted overflow-hidden">
                                            {movie.posterUrl ? (
                                                <Image
                                                    src={movie.posterUrl}
                                                    alt={movie.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    <Film className="h-6 w-6 opacity-40" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-black/75 border-amber-500/30 text-amber-400 text-[10px] px-1.5 py-0 font-bold backdrop-blur-sm">
                                                    ★ {formatRating(movie.averageRating)}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                                                    {movie.title}
                                                </h4>
                                                <p className="text-[10px] text-zinc-300 flex items-center gap-1 mt-0.5">
                                                    <span>{movie.releaseYear}</span>
                                                    {movie.duration && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{movie.duration}m</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
