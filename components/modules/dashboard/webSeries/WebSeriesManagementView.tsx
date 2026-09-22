"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IWebSeries } from "@/src/types/webSeries.types";
import { CreateWebSeriesDialog } from "./CreateWebSeriesDialog";
import { ManageSeasonsDialog } from "./ManageSeasonsDialog";
import { deleteWebSeriesAction } from "@/src/app/(dashboardRoute)/admin/dashboard/web-series-management/_action/deleteWebSeries.action";
import { createWebSeriesAction } from "@/src/app/(dashboardRoute)/admin/dashboard/web-series-management/_action/createWebSeries.action";
import { SEED_WEB_SERIES } from "@/src/data/webseries-seed-data";
import { toast } from "sonner";
import {
    Search,
    Plus,
    Tv,
    Layers,
    Calendar,
    Globe,
    Trash2,
    Star,
    Video,
    Loader2,
    Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface WebSeriesManagementViewProps {
    initialSeries: IWebSeries[];
}

export function WebSeriesManagementView({
    initialSeries,
}: WebSeriesManagementViewProps) {
    const router = useRouter();
    const [seriesList, setSeriesList] = useState<IWebSeries[]>(initialSeries);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [managingSeries, setManagingSeries] = useState<IWebSeries | null>(null);
    const [deletingSeries, setDeletingSeries] = useState<IWebSeries | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeedWebSeries = async () => {
        setIsSeeding(true);
        let added = 0;
        try {
            const existingTitles = new Set(seriesList.map((s) => s.title.toLowerCase().trim()));
            for (const series of SEED_WEB_SERIES) {
                if (!existingTitles.has(series.title.toLowerCase().trim())) {
                    const res = await createWebSeriesAction({
                        title: series.title,
                        synopsis: series.synopsis,
                        releaseYear: series.releaseYear,
                        language: series.language,
                        country: series.country,
                        status: series.status,
                        pricing: series.pricing,
                        posterUrl: series.posterUrl,
                    });
                    if (res.success && "data" in res) {
                        added++;
                        setSeriesList((prev) => [...prev, res.data]);
                    }
                }
            }
            if (added > 0) {
                toast.success(`Successfully seeded ${added} top web series!`);
                router.refresh();
            } else {
                toast.info("All curated web series already exist in database.");
            }
        } catch {
            toast.error("Error seeding web series catalog");
        } finally {
            setIsSeeding(false);
        }
    };

    const filteredSeries = useMemo(() => {
        if (!searchTerm.trim()) return seriesList;
        const term = searchTerm.toLowerCase();
        return seriesList.filter(
            (s) =>
                s.title.toLowerCase().includes(term) ||
                s.synopsis.toLowerCase().includes(term)
        );
    }, [seriesList, searchTerm]);

    const handleDelete = async () => {
        if (!deletingSeries) return;
        setIsDeleting(true);
        try {
            const res = await deleteWebSeriesAction(deletingSeries.id);
            if (res.success) {
                toast.success(`Series "${deletingSeries.title}" deleted`);
                setSeriesList((prev) => prev.filter((s) => s.id !== deletingSeries.id));
                setDeletingSeries(null);
                router.refresh();
            } else {
                toast.error(res.messsage || "Failed to delete series");
            }
        } catch {
            toast.error("Failed to delete web series");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                            <Tv className="h-5 w-5" />
                        </div>
                        Web Series Management
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        Register serialized titles, upload posters with ImageKit, and manage seasons with dedicated YouTube trailers.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSeedWebSeries}
                        disabled={isSeeding}
                        className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold gap-1.5 text-xs h-10 px-3.5"
                    >
                        {isSeeding ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Seeding...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 text-red-500" />
                                Seed Curated Series
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2 shadow-lg shadow-red-600/20 text-xs h-10 px-4"
                    >
                        <Plus className="h-4 w-4" />
                        Add Web Series
                    </Button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search series by title or synopsis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 text-sm"
                    />
                </div>
                <div className="text-xs text-zinc-400 shrink-0 px-2 font-medium">
                    Showing {filteredSeries.length} of {seriesList.length} series
                </div>
            </div>

            {/* Grid */}
            {filteredSeries.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-12 text-center">
                    <Tv className="mx-auto h-12 w-12 text-zinc-600" />
                    <h3 className="mt-4 text-lg font-semibold text-white">No Web Series Found</h3>
                    <p className="mt-1 text-sm text-zinc-400 max-w-sm mx-auto">
                        {searchTerm
                            ? "No web series match your search. Try another keyword."
                            : "Register your first web series to begin adding seasons and trailers."}
                    </p>
                    {!searchTerm && (
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Web Series
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredSeries.map((series) => {
                        const seasonCount = series.seasons?.length || 0;
                        return (
                            <div
                                key={series.id}
                                className="group relative rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-red-950/20"
                            >
                                <div className="relative aspect-[2/3] w-full bg-zinc-950 overflow-hidden">
                                    {series.posterUrl ? (
                                        <Image
                                            src={series.posterUrl}
                                            alt={series.title}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 25vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
                                            <Tv className="h-16 w-16" />
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white border border-white/10">
                                            <Layers className="h-3 w-3 text-red-500" />
                                            {seasonCount} {seasonCount === 1 ? "Season" : "Seasons"}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => setDeletingSeries(series)}
                                            title="Delete series"
                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                    <div>
                                        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-red-400 transition-colors">
                                            {series.title}
                                        </h3>

                                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                                            <span>{series.releaseYear}</span>
                                            {series.country && <span>· {series.country}</span>}
                                            <span className="ml-auto font-bold text-amber-400 flex items-center gap-0.5">
                                                <Star className="h-3 w-3 fill-current" />
                                                {series.averageRating > 0 ? series.averageRating.toFixed(1) : "—"}
                                            </span>
                                        </div>

                                        <p className="text-xs text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                                            {series.synopsis}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => setManagingSeries(series)}
                                        className="w-full bg-white/10 hover:bg-red-600 hover:text-white border border-white/10 text-white text-xs font-semibold gap-1.5 h-8 transition-colors"
                                    >
                                        <Layers className="h-3.5 w-3.5" />
                                        Manage Seasons & Trailers
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Series Dialog */}
            <CreateWebSeriesDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={() => router.refresh()}
            />

            {/* Manage Seasons & Episodes Dialog */}
            <ManageSeasonsDialog
                series={managingSeries}
                open={!!managingSeries}
                onOpenChange={(open) => !open && setManagingSeries(null)}
                onSuccess={() => router.refresh()}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingSeries}
                onOpenChange={(open: boolean) => !open && setDeletingSeries(null)}
            >
                <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Web Series</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-white">
                                {deletingSeries?.title}
                            </span>
                            ? This will delete all associated seasons, trailers, and episodes permanently.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-white/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDeletingSeries(null)}
                            className="bg-zinc-900 border-white/10 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
