"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { IBanner } from "@/src/types/banner.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreateBannerDialog } from "./CreateBannerDialog";
import { EditBannerDialog } from "./EditBannerDialog";
import { DeleteBannerDialog } from "./DeleteBannerDialog";
import { BannerPreviewModal } from "./BannerPreviewModal";
import { getAllBannersAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/getAllBanners.action";
import { toggleBannerStatusAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/toggleBannerStatus.action";
import {
    SlidersHorizontal,
    Plus,
    Search,
    RefreshCw,
    Star,
    Film,
    Play,
    Edit3,
    Trash2,
    Eye,
    CheckCircle2,
    XCircle,
    Calendar,
    Clock,
    Sparkles,
    Flame,
    Layers,
    Tv,
} from "lucide-react";

interface BannerManagementViewProps {
    initialBanners?: IBanner[];
}

export function BannerManagementView({
    initialBanners = [],
}: BannerManagementViewProps) {
    const [banners, setBanners] = useState<IBanner[]>(initialBanners);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Dialog states
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editBanner, setEditBanner] = useState<IBanner | null>(null);
    const [deleteBanner, setDeleteBanner] = useState<IBanner | null>(null);
    const [previewBanner, setPreviewBanner] = useState<IBanner | null>(null);

    const refreshBanners = async () => {
        setIsRefreshing(true);
        try {
            const data = await getAllBannersAction();
            if (data) {
                setBanners(data);
                toast.success("Banners refreshed successfully");
            }
        } catch {
            toast.error("Failed to refresh banners");
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleToggleStatus = async (banner: IBanner) => {
        const nextStatus = !banner.isActive;
        // Optimistic UI update
        setBanners((prev) =>
            prev.map((b) => (b.id === banner.id ? { ...b, isActive: nextStatus } : b))
        );

        try {
            const res = await toggleBannerStatusAction(banner.id, banner.isActive);
            if (res.success) {
                toast.success(
                    `Banner "${banner.title}" is now ${nextStatus ? "active" : "inactive"}`
                );
            } else {
                toast.error(res.messsage || "Failed to update banner status");
                // Revert
                setBanners((prev) =>
                    prev.map((b) => (b.id === banner.id ? { ...b, isActive: banner.isActive } : b))
                );
            }
        } catch {
            toast.error("Failed to toggle status");
            setBanners((prev) =>
                prev.map((b) => (b.id === banner.id ? { ...b, isActive: banner.isActive } : b))
            );
        }
    };

    // Filtered Banners
    const filteredBanners = useMemo(() => {
        return banners.filter((b) => {
            const matchesSearch =
                !searchQuery.trim() ||
                b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.director?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && b.isActive) ||
                (statusFilter === "INACTIVE" && !b.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [banners, searchQuery, statusFilter]);

    // KPI Metrics
    const totalCount = banners.length;
    const activeCount = banners.filter((b) => b.isActive).length;
    const inactiveCount = totalCount - activeCount;
    const premiumCount = banners.filter((b) => b.pricing === "PREMIUM").length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/10 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                            <SlidersHorizontal className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                            Hero Banner Management
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Control spotlight banners, video trailers, and high-impact hero slides featured on the Cinema Hub homepage.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshBanners}
                        disabled={isRefreshing}
                        className="rounded-xl text-xs gap-1.5 h-10 border-border"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span>Refresh</span>
                    </Button>

                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold gap-1.5 h-10 px-4 shadow-lg shadow-red-600/30 flex-1 sm:flex-initial"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add New Banner</span>
                    </Button>
                </div>
            </div>

            {/* KPI Metric Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Banners</span>
                        <Film className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-black mt-2 text-foreground">{totalCount}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Configured slides</div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Active on Home</span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black mt-2 text-emerald-600 dark:text-emerald-400">{activeCount}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Live on homepage</div>
                </div>

                <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Draft / Inactive</span>
                        <XCircle className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div className="text-2xl font-black mt-2 text-foreground">{inactiveCount}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Hidden from slider</div>
                </div>

                <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Premium Spotlight</span>
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </div>
                    <div className="text-2xl font-black mt-2 text-amber-600 dark:text-amber-400">{premiumCount}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Featured showcases</div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search banners by title, genre, director..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 rounded-xl bg-background border-border text-xs"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    <Button
                        size="sm"
                        variant={statusFilter === "ALL" ? "default" : "outline"}
                        onClick={() => setStatusFilter("ALL")}
                        className={`text-xs rounded-xl h-9 px-3 ${statusFilter === "ALL" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                    >
                        All ({totalCount})
                    </Button>
                    <Button
                        size="sm"
                        variant={statusFilter === "ACTIVE" ? "default" : "outline"}
                        onClick={() => setStatusFilter("ACTIVE")}
                        className={`text-xs rounded-xl h-9 px-3 ${statusFilter === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                    >
                        Active ({activeCount})
                    </Button>
                    <Button
                        size="sm"
                        variant={statusFilter === "INACTIVE" ? "default" : "outline"}
                        onClick={() => setStatusFilter("INACTIVE")}
                        className={`text-xs rounded-xl h-9 px-3 ${statusFilter === "INACTIVE" ? "bg-zinc-700 hover:bg-zinc-800 text-white" : ""}`}
                    >
                        Drafts ({inactiveCount})
                    </Button>
                </div>
            </div>

            {/* Banner Cards Grid */}
            {filteredBanners.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-border bg-card/30 space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 mx-auto">
                        <SlidersHorizontal className="h-7 w-7" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">No Banners Found</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mt-1">
                            {searchQuery
                                ? `No banners match "${searchQuery}". Try a different keyword.`
                                : "No banners have been added to the database yet. Click below to add the first spotlight banner."}
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateDialogOpen(true)}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold gap-1.5 shadow-lg shadow-red-600/30"
                    >
                        <Plus className="h-4 w-4" />
                        Create Spotlight Banner
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredBanners.map((banner) => (
                        <div
                            key={banner.id}
                            className="group flex flex-col rounded-3xl border border-border/80 bg-card/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 backdrop-blur-md hover:border-red-500/40"
                        >
                            {/* Backdrop Thumbnail */}
                            <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden">
                                {banner.imageUrl ? (
                                    <Image
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={() => {}}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                        <Film className="h-8 w-8" />
                                    </div>
                                )}

                                {/* Gradient Vignette */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

                                {/* Top Badges */}
                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(banner)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all shadow ${
                                            banner.isActive
                                                ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                                                : "bg-black/60 text-zinc-300 border border-white/20 hover:bg-black/80"
                                        }`}
                                        title="Click to toggle active on homepage"
                                    >
                                        <span className={`h-2 w-2 rounded-full ${banner.isActive ? "bg-white animate-pulse" : "bg-zinc-400"}`} />
                                        <span>{banner.isActive ? "Live on Home" : "Draft (Hidden)"}</span>
                                    </button>

                                    <Badge
                                        variant="outline"
                                        className={
                                            banner.pricing === "PREMIUM"
                                                ? "bg-amber-500/20 border-amber-500/40 text-amber-300 text-[10px] font-bold backdrop-blur-md"
                                                : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 text-[10px] font-bold backdrop-blur-md"
                                        }
                                    >
                                        {banner.pricing}
                                    </Badge>
                                </div>

                                {/* Bottom Info on Poster */}
                                <div className="absolute bottom-3 left-3 right-3">
                                    <div className="flex items-center gap-2">
                                        {banner.rating !== null && banner.rating !== undefined && (
                                            <Badge
                                                variant="outline"
                                                className="bg-black/70 border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5"
                                            >
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                                                {banner.rating}
                                            </Badge>
                                        )}
                                        {banner.releaseYear && (
                                            <span className="text-[11px] text-zinc-300 font-semibold drop-shadow">
                                                {banner.releaseYear}
                                            </span>
                                        )}
                                        {banner.duration && (
                                            <span className="text-[11px] text-zinc-300 font-semibold drop-shadow">
                                                • {banner.duration}m
                                            </span>
                                        )}
                                        {banner.order !== undefined && banner.order > 0 && (
                                            <span className="text-[10px] text-zinc-400 ml-auto bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                                                Order: #{banner.order}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-base font-black text-white drop-shadow truncate mt-1">
                                        {banner.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-1.5">
                                    {banner.genre && (
                                        <div className="text-xs font-bold text-red-500">
                                            {banner.genre}
                                        </div>
                                    )}
                                    {banner.director && (
                                        <div className="text-[11px] text-muted-foreground truncate">
                                            Director: <span className="text-foreground font-semibold">{banner.director}</span>
                                        </div>
                                    )}
                                    {banner.synopsis && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {banner.synopsis}
                                        </p>
                                    )}
                                </div>

                                {/* Footer Action Buttons */}
                                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-1.5">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setPreviewBanner(banner)}
                                        className="rounded-xl text-xs h-8 px-2.5 gap-1 border-border hover:border-foreground"
                                        title="Preview cinematic presentation"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>Preview</span>
                                    </Button>

                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditBanner(banner)}
                                            className="rounded-xl text-xs h-8 px-2.5 gap-1 border-border text-foreground hover:bg-muted"
                                        >
                                            <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                                            <span>Edit</span>
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setDeleteBanner(banner)}
                                            className="rounded-xl text-xs h-8 px-2.5 text-red-600 hover:text-red-700 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals & Dialogs */}
            <CreateBannerDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={refreshBanners}
            />

            <EditBannerDialog
                banner={editBanner}
                open={!!editBanner}
                onOpenChange={(open) => !open && setEditBanner(null)}
                onSuccess={refreshBanners}
            />

            <DeleteBannerDialog
                banner={deleteBanner}
                open={!!deleteBanner}
                onOpenChange={(open) => !open && setDeleteBanner(null)}
                onSuccess={refreshBanners}
            />

            <BannerPreviewModal
                banner={previewBanner}
                open={!!previewBanner}
                onOpenChange={(open) => !open && setPreviewBanner(null)}
            />
        </div>
    );
}
