"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    TrendingUp,
    Users,
    Film,
    MessageSquareText,
    Star,
    CreditCard,
    Bookmark,
    Tags,
    ArrowUpRight,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    Clock,
    AlertCircle,
    Activity,
    Layers,
    MonitorPlay,
    ChevronRight,
    UserCheck,
    Video,
    Tv,
    ExternalLink,
    DollarSign,
    SlidersHorizontal,
} from "lucide-react";
import { IAdminStatsData } from "@/src/types/stats.types";
import { IMeUser } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRating } from "@/components/modules/dashboard/movie/movie-helpers";
import { formatMemberDate } from "@/components/modules/dashboard/user/user-helpers";

interface AdminOverviewViewProps {
    currentUser?: IMeUser | null;
    initialStats: IAdminStatsData | null;
    extraCounts?: {
        totalCast: number;
        totalDirectors: number;
        totalWebSeries: number;
        totalBanners?: number;
    };
}

export function AdminOverviewView({
    currentUser,
    initialStats,
    extraCounts,
}: AdminOverviewViewProps) {
    const [activeTab, setActiveTab] = useState("reviews");
    const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
    const [hoveredPoint, setHoveredPoint] = useState<{ month: string; reviews: number; x: number; y: number } | null>(null);

    const totalCast = extraCounts?.totalCast ?? 0;
    const totalDirectors = extraCounts?.totalDirectors ?? 0;
    const totalWebSeries = extraCounts?.totalWebSeries ?? 0;
    const totalBanners = extraCounts?.totalBanners ?? 0;

    // Provide safe defaults if initialStats is null or partially empty
    const overview = initialStats?.overview || {
        totalUsers: 0,
        totalMedia: 0,
        totalGenres: 0,
        totalPlatforms: 0,
        totalWishlists: 0,
        totalPayments: 0,
        totalReviews: 0,
        totalRevenue: 0,
        averageRating: 0,
    };

    const charts = initialStats?.charts || {
        ratingDistributionPieChart: [],
        reviewGrowthLineChart: [],
        mostReviewedMoviesBarChart: [],
    };

    const activities = initialStats?.recentActivities || {};
    const recentUsers = activities.recentUsers || activities.recentUsersCount || [];
    const recentReviews = activities.recentReviews || activities.recentReviewsCount || [];
    const recentPayments = activities.recentPayments || activities.recentPaymentsCount || [];

    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
    const adminName = currentUser?.name || (currentUser?.email ? currentUser.email.split("@")[0] : "Admin");

    // Dynamic greeting based on current time
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    }, []);

    // Format currency
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(val);
    };

    // Calculate pending review count
    const pendingReviewsCount = useMemo(() => {
        return recentReviews.filter((r) => r.status === "PENDING").length;
    }, [recentReviews]);

    // Donut Chart Calculations for Rating Distribution
    const ratingColors = [
        { star: "5 Star", color: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", label: "5 Stars" },
        { star: "4 Star", color: "#10b981", glow: "rgba(16, 185, 129, 0.4)", label: "4 Stars" },
        { star: "3 Star", color: "#0ea5e9", glow: "rgba(14, 165, 233, 0.4)", label: "3 Stars" },
        { star: "2 Star", color: "#f97316", glow: "rgba(249, 115, 22, 0.4)", label: "2 Stars" },
        { star: "1 Star", color: "#ef4444", glow: "rgba(239, 68, 68, 0.4)", label: "1 Star" },
    ];

    const processedRatingDistribution = useMemo(() => {
        const raw = charts.ratingDistributionPieChart || [];
        // Ensure all 5 stars are represented
        const map = new Map<string, number>();
        raw.forEach((item) => {
            map.set(item.name, item.value);
        });

        const list = ratingColors.map((conf) => {
            const val = map.get(conf.star) || 0;
            return {
                name: conf.star,
                label: conf.label,
                value: val,
                color: conf.color,
                glow: conf.glow,
            };
        });

        const total = list.reduce((acc, curr) => acc + curr.value, 0);

        let cumulativeAngle = 0;
        return list.map((item, idx) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const angle = total > 0 ? (item.value / total) * 360 : 0;
            const startAngle = cumulativeAngle;
            cumulativeAngle += angle;
            return {
                ...item,
                percentage: Number(percentage.toFixed(1)),
                startAngle,
                endAngle: cumulativeAngle,
                index: idx,
            };
        });
    }, [charts.ratingDistributionPieChart]);

    const totalRatingsCount = useMemo(() => {
        return processedRatingDistribution.reduce((sum, item) => sum + item.value, 0);
    }, [processedRatingDistribution]);

    // Helpers to create SVG donut paths
    const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: cx + radius * Math.cos(angleInRadians),
            y: cy + radius * Math.sin(angleInRadians),
        };
    };

    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        // If full circle, slightly decrement to draw
        const adjustedEndAngle = endAngle - startAngle >= 360 ? startAngle + 359.99 : endAngle;
        const start = polarToCartesian(x, y, radius, adjustedEndAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = adjustedEndAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    // Review Growth Line Chart calculations
    const processedGrowthData = useMemo(() => {
        const raw = charts.reviewGrowthLineChart || [];
        if (raw.length === 0) {
            return [
                { month: "Jan", reviews: 0 },
                { month: "Feb", reviews: 0 },
                { month: "Mar", reviews: 0 },
                { month: "Apr", reviews: 0 },
                { month: "May", reviews: 0 },
                { month: "Jun", reviews: 0 },
            ];
        }
        return raw;
    }, [charts.reviewGrowthLineChart]);

    const maxGrowthReviews = useMemo(() => {
        const max = Math.max(...processedGrowthData.map((d) => d.reviews), 1);
        return Math.ceil(max * 1.25);
    }, [processedGrowthData]);

    // Construct SVG path for area & line chart
    const lineChartDimensions = { width: 600, height: 220, paddingX: 45, paddingY: 30 };
    const chartPoints = useMemo(() => {
        const { width, height, paddingX, paddingY } = lineChartDimensions;
        const chartW = width - paddingX * 2;
        const chartH = height - paddingY * 2;

        return processedGrowthData.map((item, index) => {
            const x = paddingX + (index / Math.max(processedGrowthData.length - 1, 1)) * chartW;
            const y = height - paddingY - (item.reviews / maxGrowthReviews) * chartH;
            return {
                ...item,
                x,
                y,
            };
        });
    }, [processedGrowthData, maxGrowthReviews]);

    const smoothLinePath = useMemo(() => {
        if (chartPoints.length < 2) return "";
        let path = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
        for (let i = 0; i < chartPoints.length - 1; i++) {
            const current = chartPoints[i];
            const next = chartPoints[i + 1];
            const controlX = (current.x + next.x) / 2;
            path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
        }
        return path;
    }, [chartPoints]);

    const smoothAreaPath = useMemo(() => {
        if (chartPoints.length < 2) return "";
        const bottomY = lineChartDimensions.height - lineChartDimensions.paddingY;
        const first = chartPoints[0];
        const last = chartPoints[chartPoints.length - 1];
        let path = `M ${first.x} ${bottomY} L ${first.x} ${first.y}`;
        for (let i = 0; i < chartPoints.length - 1; i++) {
            const current = chartPoints[i];
            const next = chartPoints[i + 1];
            const controlX = (current.x + next.x) / 2;
            path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
        }
        path += ` L ${last.x} ${bottomY} Z`;
        return path;
    }, [chartPoints]);

    // Most Reviewed Movies Bar Chart calculations
    const maxReviewedMovieCount = useMemo(() => {
        const raw = charts.mostReviewedMoviesBarChart || [];
        if (raw.length === 0) return 1;
        return Math.max(...raw.map((m) => m.reviews), 1);
    }, [charts.mostReviewedMoviesBarChart]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-500">
            {/* 1. Executive Ambient Header */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card/95 via-card/70 to-background/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
                {/* Visual Ambient Glows */}
                <div className="absolute top-0 right-0 -mt-12 -mr-12 h-80 w-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 -mb-12 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 right-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left: Greeting & Status Info */}
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm">
                                <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
                                {isSuperAdmin ? "Super Admin Console" : "Admin Command Center"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                Live Sync Active
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
                            <span>{greeting}, {adminName}</span>
                            <Sparkles className="h-6 w-6 text-amber-400 shrink-0 hidden sm:inline" />
                        </h1>

                        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                            Comprehensive platform overview, real-time revenue analytics, community review trends, and dynamic film rankings across the entire FilmRank cinema network.
                        </p>
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-xl h-10 px-4 text-xs font-semibold border-border/80 hover:bg-muted transition-all shadow-sm flex-1 sm:flex-initial"
                        >
                            <Link href="/admin/dashboard/review-management" className="flex items-center gap-2">
                                <MessageSquareText className="h-4 w-4 text-amber-500" />
                                <span>Review Queue</span>
                                {pendingReviewsCount > 0 && (
                                    <Badge className="ml-1 px-1.5 py-0.2 bg-amber-500 text-black font-black text-[10px] rounded-full">
                                        {pendingReviewsCount}
                                    </Badge>
                                )}
                            </Link>
                        </Button>

                        <Button
                            asChild
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-lg shadow-red-600/25 transition-all flex-1 sm:flex-initial"
                        >
                            <Link href="/admin/dashboard/movie-management" className="flex items-center gap-2">
                                <Film className="h-4 w-4" />
                                <span>Movie Catalogue</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. Executive 8 KPI Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1: Total Revenue */}
                <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-card via-card/80 to-emerald-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-emerald-500/60 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Revenue</span>
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-emerald-400 tracking-tight">
                            {formatCurrency(overview.totalRevenue)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                            <span className="font-semibold text-emerald-400">{overview.totalPayments}</span>
                            <span>completed transactions</span>
                        </div>
                    </div>
                </div>

                {/* 2: Total Registered Users */}
                <Link
                    href="/admin/dashboard/user-management"
                    className="group relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-card via-card/80 to-cyan-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-cyan-500/60 hover:-translate-y-1 transition-all duration-300 block"
                >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cinephile Members</span>
                        <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {overview.totalUsers.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 group-hover:text-cyan-400 transition-colors">
                            <span>Registered community</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </Link>

                {/* 3: Total Movies */}
                <Link
                    href="/admin/dashboard/movie-management"
                    className="group relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-br from-card via-card/80 to-red-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-red-500/60 hover:-translate-y-1 transition-all duration-300 block"
                >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Movie Titles</span>
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Film className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {overview.totalMedia.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 group-hover:text-red-400 transition-colors">
                            <span>Curated cinema library</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </Link>

                {/* 4: Web Series Catalog */}
                <Link
                    href="/admin/dashboard/web-series-management"
                    className="group relative overflow-hidden rounded-2xl border border-sky-500/30 bg-gradient-to-br from-card via-card/80 to-sky-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-sky-500/60 hover:-translate-y-1 transition-all duration-300 block"
                >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Web Series</span>
                        <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Tv className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {totalWebSeries.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 group-hover:text-sky-400 transition-colors">
                            <span>Episodic production hub</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </Link>

                {/* 4b: Hero Banners */}
                <Link
                    href="/admin/dashboard/banner-management"
                    className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-card via-card/80 to-rose-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-rose-500/60 hover:-translate-y-1 transition-all duration-300 block"
                >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hero Banners</span>
                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <SlidersHorizontal className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {totalBanners.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 group-hover:text-rose-400 transition-colors">
                            <span>Spotlight slides & promos</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </Link>

                {/* 5: Cast Members Talent */}
                <Link
                    href="/admin/dashboard/cast-management"
                    className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-card via-card/80 to-purple-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-purple-500/60 hover:-translate-y-1 transition-all duration-300 block"
                >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cast Members</span>
                        <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UserCheck className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {totalCast.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 group-hover:text-purple-400 transition-colors">
                            <span>Actors & performers</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </Link>

                {/* 6: Film Directors */}
                <Link
                    href="/admin/dashboard/director-management"
                    className="group relative overflow-hidden rounded-2xl border border-orange-500/30 bg-gradient-to-br from-card via-card/80 to-orange-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-orange-500/60 hover:-translate-y-1 transition-all duration-300 block"
                >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Film Directors</span>
                        <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Video className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {totalDirectors.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 group-hover:text-orange-400 transition-colors">
                            <span>Visionary auteurs</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </Link>

                {/* 7: Total Reviews */}
                <Link
                    href="/admin/dashboard/review-management"
                    className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-card via-card/80 to-amber-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-300 block"
                >
                    <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Critic Reviews</span>
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MessageSquareText className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {overview.totalReviews.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 group-hover:text-amber-400 transition-colors">
                            <span>Published ratings</span>
                            <ArrowUpRight className="h-3 w-3" />
                        </div>
                    </div>
                </Link>

                {/* 5: Average Rating */}
                <div className="group relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-card via-card/80 to-yellow-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-yellow-500/60 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Rating</span>
                        <div className="h-10 w-10 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Star className="h-5 w-5 fill-yellow-400" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-yellow-400 tracking-tight flex items-baseline gap-1.5">
                            <span>{formatRating(overview.averageRating)}</span>
                            <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                            i <= Math.round(overview.averageRating)
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-muted-foreground/30"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-1 text-[11px]">Across all reviews</span>
                        </div>
                    </div>
                </div>

                {/* 6: Total Payments Count */}
                <div className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-card via-card/80 to-violet-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-violet-500/60 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Orders & Access</span>
                        <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CreditCard className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {overview.totalPayments.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Successful purchases
                        </p>
                    </div>
                </div>

                {/* 7: Watchlist Bookmarks */}
                <div className="group relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-card via-card/80 to-rose-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-rose-500/60 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bookmarks Saved</span>
                        <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Bookmark className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {overview.totalWishlists.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Added to member watchlists
                        </p>
                    </div>
                </div>

                {/* 8: Taxonomy Ecosystem */}
                <div className="group relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-card via-card/80 to-indigo-950/10 p-5 shadow-lg hover:shadow-2xl hover:border-indigo-500/60 hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Taxonomy Index</span>
                        <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Layers className="h-5 w-5" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-foreground tracking-tight">
                            {overview.totalGenres + overview.totalPlatforms}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span className="text-indigo-400 font-semibold">{overview.totalGenres} Genres</span>
                            <span>•</span>
                            <span>{overview.totalPlatforms} Platforms</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Visual Charts Grid (Interactive SVG Charts) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left (7 cols): Review Growth Trajectory Area Chart */}
                <div className="lg:col-span-7 rounded-3xl border border-border/70 bg-card/90 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-red-500" />
                                    Review Velocity & Growth
                                </h3>
                                <Badge variant="outline" className="text-[11px] font-semibold text-red-400 border-red-500/30 bg-red-500/10">
                                    Monthly Trends
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Volume of critic and community reviews recorded over chronological months.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-foreground">
                                {overview.totalReviews}
                            </span>
                            <span className="text-xs text-muted-foreground block">Total Records</span>
                        </div>
                    </div>

                    {/* SVG Area Chart Container */}
                    <div className="relative w-full overflow-x-auto py-2">
                        <svg
                            viewBox={`0 0 ${lineChartDimensions.width} ${lineChartDimensions.height}`}
                            className="w-full h-56 overflow-visible select-none"
                        >
                            <defs>
                                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                                    <stop offset="60%" stopColor="#ef4444" stopOpacity="0.12" />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="lineStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f59e0b" />
                                    <stop offset="50%" stopColor="#ef4444" />
                                    <stop offset="100%" stopColor="#ec4899" />
                                </linearGradient>
                                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Horizontal Grid lines */}
                            {[0.25, 0.5, 0.75, 1].map((fraction) => {
                                const y =
                                    lineChartDimensions.height -
                                    lineChartDimensions.paddingY -
                                    fraction * (lineChartDimensions.height - lineChartDimensions.paddingY * 2);
                                return (
                                    <g key={fraction}>
                                        <line
                                            x1={lineChartDimensions.paddingX}
                                            y1={y}
                                            x2={lineChartDimensions.width - lineChartDimensions.paddingX}
                                            y2={y}
                                            stroke="currentColor"
                                            className="text-border/40"
                                            strokeDasharray="4 4"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={lineChartDimensions.paddingX - 10}
                                            y={y + 3}
                                            textAnchor="end"
                                            className="text-[10px] fill-muted-foreground font-mono"
                                        >
                                            {Math.round(fraction * maxGrowthReviews)}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Base horizontal axis */}
                            <line
                                x1={lineChartDimensions.paddingX}
                                y1={lineChartDimensions.height - lineChartDimensions.paddingY}
                                x2={lineChartDimensions.width - lineChartDimensions.paddingX}
                                y2={lineChartDimensions.height - lineChartDimensions.paddingY}
                                stroke="currentColor"
                                className="text-border/80"
                                strokeWidth="1.5"
                            />

                            {/* Area fill */}
                            {smoothAreaPath && (
                                <path
                                    d={smoothAreaPath}
                                    fill="url(#areaGradient)"
                                    className="transition-all duration-700"
                                />
                            )}

                            {/* Line path */}
                            {smoothLinePath && (
                                <path
                                    d={smoothLinePath}
                                    fill="none"
                                    stroke="url(#lineStrokeGradient)"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#glowFilter)"
                                    className="transition-all duration-700"
                                />
                            )}

                            {/* Interactive Points */}
                            {chartPoints.map((point, idx) => (
                                <g
                                    key={idx}
                                    className="cursor-pointer group"
                                    onMouseEnter={() => setHoveredPoint(point)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                >
                                    {/* Hover Ring */}
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="9"
                                        className={`transition-all duration-200 fill-red-500/20 ${
                                            hoveredPoint?.month === point.month ? "opacity-100 scale-125" : "opacity-0"
                                        }`}
                                    />
                                    {/* Core Dot */}
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r="4.5"
                                        className={`transition-all duration-200 ${
                                            hoveredPoint?.month === point.month
                                                ? "fill-white stroke-red-500 stroke-[3]"
                                                : "fill-red-500 stroke-card stroke-[2]"
                                        }`}
                                    />
                                    {/* Month Label */}
                                    <text
                                        x={point.x}
                                        y={lineChartDimensions.height - 10}
                                        textAnchor="middle"
                                        className={`text-[11px] font-semibold transition-colors ${
                                            hoveredPoint?.month === point.month
                                                ? "fill-foreground font-black"
                                                : "fill-muted-foreground"
                                        }`}
                                    >
                                        {point.month}
                                    </text>
                                </g>
                            ))}
                        </svg>

                        {/* Floating Tooltip for Area Chart */}
                        {hoveredPoint && (
                            <div
                                className="absolute pointer-events-none -translate-x-1/2 -translate-y-full px-3 py-1.5 rounded-xl bg-card/95 border border-border shadow-2xl backdrop-blur-md text-xs font-semibold"
                                style={{
                                    left: `${(hoveredPoint.x / lineChartDimensions.width) * 100}%`,
                                    top: `${(hoveredPoint.y / lineChartDimensions.height) * 100}%`,
                                }}
                            >
                                <span className="text-red-400 font-bold">{hoveredPoint.month}: </span>
                                <span className="text-foreground">{hoveredPoint.reviews} Reviews</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right (5 cols): Rating Distribution Donut Chart */}
                <div className="lg:col-span-5 rounded-3xl border border-border/70 bg-card/90 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                                Rating Distribution
                            </h3>
                            <Badge variant="outline" className="text-[11px] font-bold text-amber-400 border-amber-500/30 bg-amber-500/10">
                                {formatRating(overview.averageRating)} ★ Avg
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Breakdown of user sentiment scores across the catalogue.
                        </p>
                    </div>

                    {/* Donut Chart Visual & Legend */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
                        {/* Donut SVG */}
                        <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 200 200" className="h-full w-full transform -rotate-90">
                                {/* Background Ring */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="70"
                                    fill="none"
                                    stroke="currentColor"
                                    className="text-border/30"
                                    strokeWidth="16"
                                />

                                {totalRatingsCount === 0 ? (
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="70"
                                        fill="none"
                                        stroke="currentColor"
                                        className="text-muted/30"
                                        strokeWidth="16"
                                    />
                                ) : (
                                    processedRatingDistribution.map((slice) => {
                                        if (slice.percentage <= 0) return null;
                                        const path = describeArc(100, 100, 70, slice.startAngle, slice.endAngle);
                                        const isHovered = hoveredSlice === slice.index;

                                        return (
                                            <path
                                                key={slice.name}
                                                d={path}
                                                fill="none"
                                                stroke={slice.color}
                                                strokeWidth={isHovered ? 20 : 16}
                                                strokeLinecap="round"
                                                className="cursor-pointer transition-all duration-300"
                                                style={{
                                                    filter: isHovered ? `drop-shadow(0 0 8px ${slice.glow})` : "none",
                                                }}
                                                onMouseEnter={() => setHoveredSlice(slice.index)}
                                                onMouseLeave={() => setHoveredSlice(null)}
                                            />
                                        );
                                    })
                                )}
                            </svg>

                            {/* Center Donut Hole Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                <span className="text-2xl font-black text-foreground tracking-tight">
                                    {hoveredSlice !== null
                                        ? `${processedRatingDistribution[hoveredSlice].percentage}%`
                                        : formatRating(overview.averageRating)}
                                </span>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                    {hoveredSlice !== null
                                        ? processedRatingDistribution[hoveredSlice].label
                                        : `${totalRatingsCount} Ratings`}
                                </span>
                            </div>
                        </div>

                        {/* Legend Pills List */}
                        <div className="w-full space-y-2">
                            {processedRatingDistribution.map((item) => {
                                const isHovered = hoveredSlice === item.index;
                                return (
                                    <div
                                        key={item.name}
                                        onMouseEnter={() => setHoveredSlice(item.index)}
                                        onMouseLeave={() => setHoveredSlice(null)}
                                        className={`flex items-center justify-between p-1.5 px-2.5 rounded-xl cursor-pointer transition-all ${
                                            isHovered ? "bg-muted/80 scale-[1.02]" : "hover:bg-muted/40"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-xs font-semibold text-foreground">
                                                {item.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="font-mono text-muted-foreground">{item.value}</span>
                                            <span className="font-black text-foreground">{item.percentage}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Most Reviewed Movies Leaderboard */}
            <div className="rounded-3xl border border-border/70 bg-card/90 backdrop-blur-xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Film className="h-5 w-5 text-red-500" />
                            Most Reviewed Movies Leaderboard
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                            Top cinematic titles with the highest engagement and discussion volume.
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-400 hover:text-red-300 font-semibold"
                    >
                        <Link href="/admin/dashboard/movie-management" className="flex items-center gap-1.5">
                            <span>Manage All Films</span>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {charts.mostReviewedMoviesBarChart && charts.mostReviewedMoviesBarChart.length > 0 ? (
                    <div className="space-y-3.5">
                        {charts.mostReviewedMoviesBarChart.slice(0, 5).map((movie, index) => {
                            const percent = Math.round((movie.reviews / maxReviewedMovieCount) * 100);
                            const rankColors = [
                                "bg-amber-500/20 text-amber-400 border-amber-500/40",
                                "bg-zinc-400/20 text-zinc-300 border-zinc-400/40",
                                "bg-amber-700/20 text-amber-500 border-amber-700/40",
                            ];
                            const badgeStyle = rankColors[index] || "bg-muted text-muted-foreground border-border";

                            return (
                                <div
                                    key={movie.id || movie.movie + index}
                                    className="group relative overflow-hidden rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 p-3 sm:p-4 transition-all duration-300"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Rank Badge */}
                                            <span
                                                className={`h-7 w-7 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${badgeStyle}`}
                                            >
                                                #{index + 1}
                                            </span>

                                            {/* Movie Thumbnail */}
                                            <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-xl overflow-hidden bg-muted border border-border/80 shrink-0">
                                                {movie.posterUrl ? (
                                                    <Image
                                                        src={movie.posterUrl}
                                                        alt={movie.movie}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-red-600/20 to-amber-600/20">
                                                        <Film className="h-5 w-5 text-red-500" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title & Metadata */}
                                            <div className="min-w-0">
                                                <h4 className="text-sm font-bold text-foreground truncate group-hover:text-red-500 transition-colors">
                                                    {movie.movie}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                    {movie.releaseYear && <span>{movie.releaseYear}</span>}
                                                    {movie.averageRating ? (
                                                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                                            <Star className="h-3 w-3 fill-amber-400" />
                                                            {formatRating(movie.averageRating)}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Review Count Badge */}
                                        <div className="text-right shrink-0">
                                            <span className="text-sm font-black text-foreground">
                                                {movie.reviews}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground block">reviews</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar Track */}
                                    <div className="mt-3 w-full bg-border/40 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-amber-400 rounded-full transition-all duration-1000 shadow-sm"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        No movie reviews recorded yet. Once users review movies, they will appear ranked here.
                    </div>
                )}
            </div>

            {/* 5. Live Recent Activity Center (Multi-tab stream) */}
            <div className="rounded-3xl border border-border/70 bg-card/90 backdrop-blur-xl p-6 shadow-xl">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Activity className="h-5 w-5 text-cyan-400" />
                                Real-Time Activity Center
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Recent community submissions, new membership signups, and completed platform purchases.
                            </p>
                        </div>

                        <TabsList className="bg-muted/50 border border-border/60 p-1 rounded-2xl">
                            <TabsTrigger value="reviews" className="rounded-xl text-xs font-bold gap-2">
                                <MessageSquareText className="h-3.5 w-3.5" />
                                Reviews ({recentReviews.length})
                            </TabsTrigger>
                            <TabsTrigger value="users" className="rounded-xl text-xs font-bold gap-2">
                                <Users className="h-3.5 w-3.5" />
                                New Cinephiles ({recentUsers.length})
                            </TabsTrigger>
                            <TabsTrigger value="payments" className="rounded-xl text-xs font-bold gap-2">
                                <CreditCard className="h-3.5 w-3.5" />
                                Payments ({recentPayments.length})
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Tab 1: Recent Reviews */}
                    <TabsContent value="reviews" className="space-y-3 focus-visible:outline-none">
                        {recentReviews.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {recentReviews.map((review) => {
                                    const reviewerName = review.user?.name || "Community Member";
                                    const movieTitle = review.media?.title || "Unknown Film";
                                    const isPending = review.status === "PENDING";
                                    const isApproved = review.status === "APPROVED";

                                    return (
                                        <div
                                            key={review.id}
                                            className="group rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 p-4 transition-all duration-300 flex flex-col justify-between gap-3"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <Avatar className="h-9 w-9 rounded-xl border border-border">
                                                            {review.user?.image && (
                                                                <AvatarImage src={review.user.image} alt={reviewerName} />
                                                            )}
                                                            <AvatarFallback className="rounded-xl bg-gradient-to-br from-amber-600 to-red-600 text-white font-bold text-xs">
                                                                {reviewerName.slice(0, 2).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h5 className="text-xs font-bold text-foreground">
                                                                {reviewerName}
                                                            </h5>
                                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                                on <span className="font-semibold text-foreground/80 truncate max-w-[140px]">{movieTitle}</span>
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                            isPending
                                                                ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                                                                : isApproved
                                                                ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
                                                                : "text-red-400 border-red-500/40 bg-red-500/10"
                                                        }`}
                                                    >
                                                        {review.status || "APPROVED"}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star
                                                            key={s}
                                                            className={`h-3 w-3 ${
                                                                s <= review.rating
                                                                    ? "text-amber-400 fill-amber-400"
                                                                    : "text-muted-foreground/30"
                                                            }`}
                                                        />
                                                    ))}
                                                    <span className="text-xs font-bold text-amber-400 ml-1">
                                                        {review.rating}.0
                                                    </span>
                                                </div>

                                                {review.content && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                        &ldquo;{review.content}&rdquo;
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatMemberDate(review.createdAt)}
                                                </span>
                                                <Link
                                                    href="/admin/dashboard/review-management"
                                                    className="text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 group-hover:underline"
                                                >
                                                    Moderate
                                                    <ChevronRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No recent reviews recorded.
                            </div>
                        )}
                    </TabsContent>

                    {/* Tab 2: Recent Users */}
                    <TabsContent value="users" className="space-y-3 focus-visible:outline-none">
                        {recentUsers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                {recentUsers.map((u) => {
                                    const initials = (u.name || u.email || "U").slice(0, 2).toUpperCase();
                                    const isSuper = u.role === "SUPER_ADMIN";
                                    const isAdmin = u.role === "ADMIN";

                                    return (
                                        <div
                                            key={u.id}
                                            className="rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 p-4 transition-all duration-300 flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <Avatar className="h-10 w-10 rounded-xl border border-border shrink-0">
                                                    {u.image && <AvatarImage src={u.image} alt={u.name} />}
                                                    <AvatarFallback className="rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white font-bold text-xs">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <h5 className="text-xs font-bold text-foreground truncate">
                                                        {u.name || "Cinephile User"}
                                                    </h5>
                                                    <p className="text-[11px] text-muted-foreground truncate">{u.email}</p>
                                                    <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-0.5">
                                                        Joined {formatMemberDate(u.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                                    isSuper
                                                        ? "text-red-400 border-red-500/30 bg-red-500/10"
                                                        : isAdmin
                                                        ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
                                                        : "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                                                }`}
                                            >
                                                {u.role || "USER"}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No recent registrations found.
                            </div>
                        )}
                    </TabsContent>

                    {/* Tab 3: Recent Payments */}
                    <TabsContent value="payments" className="space-y-3 focus-visible:outline-none">
                        {recentPayments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {recentPayments.map((p) => {
                                    const buyerName = p.user?.name || "Customer";
                                    const mediaTitle = p.media?.title || "Movie Access";

                                    return (
                                        <div
                                            key={p.id}
                                            className="rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 p-4 transition-all duration-300 flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                                    <CreditCard className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h5 className="text-xs font-bold text-foreground truncate">
                                                        {buyerName}
                                                    </h5>
                                                    <p className="text-[11px] text-muted-foreground truncate">
                                                        Purchased: <span className="font-semibold text-foreground/80">{mediaTitle}</span>
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground/80 block mt-0.5">
                                                        {formatMemberDate(p.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="text-base font-black text-emerald-400 block">
                                                    {formatCurrency(p.amount)}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] font-bold text-emerald-400 border-emerald-500/30 bg-emerald-500/10 px-2 py-0.2"
                                                >
                                                    {p.status || "PAID"}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No recent payments recorded.
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            {/* 6. Administrative Quick Navigation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                <Link
                    href="/admin/dashboard/movie-management"
                    className="group rounded-2xl border border-border/60 bg-card p-4 hover:border-red-500/50 hover:bg-muted/30 transition-all duration-300 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Film className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Films</span>
                    <span className="text-[10px] text-muted-foreground">{overview.totalMedia} entries</span>
                </Link>

                <Link
                    href="/admin/dashboard/review-management"
                    className="group rounded-2xl border border-border/60 bg-card p-4 hover:border-amber-500/50 hover:bg-muted/30 transition-all duration-300 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MessageSquareText className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Reviews</span>
                    <span className="text-[10px] text-muted-foreground">{overview.totalReviews} total</span>
                </Link>

                <Link
                    href="/admin/dashboard/user-management"
                    className="group rounded-2xl border border-border/60 bg-card p-4 hover:border-cyan-500/50 hover:bg-muted/30 transition-all duration-300 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Users</span>
                    <span className="text-[10px] text-muted-foreground">{overview.totalUsers} registered</span>
                </Link>

                <Link
                    href="/admin/dashboard/genre-management"
                    className="group rounded-2xl border border-border/60 bg-card p-4 hover:border-violet-500/50 hover:bg-muted/30 transition-all duration-300 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Tags className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Genres</span>
                    <span className="text-[10px] text-muted-foreground">{overview.totalGenres} categories</span>
                </Link>

                <Link
                    href="/admin/dashboard/platform-management"
                    className="group rounded-2xl border border-border/60 bg-card p-4 hover:border-emerald-500/50 hover:bg-muted/30 transition-all duration-300 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MonitorPlay className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Platforms</span>
                    <span className="text-[10px] text-muted-foreground">{overview.totalPlatforms} providers</span>
                </Link>

                <Link
                    href="/movies"
                    target="_blank"
                    className="group rounded-2xl border border-border/60 bg-card p-4 hover:border-yellow-500/50 hover:bg-muted/30 transition-all duration-300 flex flex-col items-center text-center gap-2 shadow-sm"
                >
                    <div className="h-10 w-10 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ExternalLink className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Public Hub</span>
                    <span className="text-[10px] text-muted-foreground">Live Cinephile View</span>
                </Link>
            </div>
        </div>
    );
}
