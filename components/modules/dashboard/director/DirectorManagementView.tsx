"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IDirector } from "@/src/types/director.types";
import { CreateDirectorDialog } from "./CreateDirectorDialog";
import { EditDirectorDialog } from "./EditDirectorDialog";
import { deleteDirectorAction } from "@/src/app/(dashboardRoute)/admin/dashboard/director-management/_action/deleteDirector.action";
import { createDirectorAction } from "@/src/app/(dashboardRoute)/admin/dashboard/director-management/_action/createDirector.action";
import { SEED_DIRECTORS } from "@/src/data/director-seed-data";
import { toast } from "sonner";
import {
    Search,
    Plus,
    Video,
    Globe,
    Calendar,
    Pencil,
    Trash2,
    Film,
    Sparkles,
    User,
    Loader2,
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

interface DirectorManagementViewProps {
    initialDirectors: IDirector[];
}

export function DirectorManagementView({ initialDirectors }: DirectorManagementViewProps) {
    const router = useRouter();
    const [directors, setDirectors] = useState<IDirector[]>(initialDirectors);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingDirector, setEditingDirector] = useState<IDirector | null>(null);
    const [deletingDirector, setDeletingDirector] = useState<IDirector | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);

    const handleSeedDirectors = async () => {
        setIsSeeding(true);
        let added = 0;
        try {
            const existingNames = new Set(directors.map((d) => d.name.toLowerCase().trim()));
            for (const dir of SEED_DIRECTORS) {
                if (!existingNames.has(dir.name.toLowerCase().trim())) {
                    const res = await createDirectorAction({
                        name: dir.name,
                        bio: dir.bio,
                        nationality: dir.nationality,
                        birthDate: dir.birthDate,
                        imageUrl: dir.imageUrl,
                    });
                    if (res.success && "data" in res) {
                        added++;
                        setDirectors((prev) => [...prev, res.data]);
                    }
                }
            }
            if (added > 0) {
                toast.success(`Successfully seeded ${added} visionary directors!`);
                router.refresh();
            } else {
                toast.info("All curated directors already exist in database.");
            }
        } catch {
            toast.error("Error seeding directors catalog");
        } finally {
            setIsSeeding(false);
        }
    };

    const filteredDirectors = useMemo(() => {
        if (!searchTerm.trim()) return directors;
        const term = searchTerm.toLowerCase();
        return directors.filter(
            (d) =>
                d.name.toLowerCase().includes(term) ||
                d.nationality?.toLowerCase().includes(term) ||
                d.bio?.toLowerCase().includes(term)
        );
    }, [directors, searchTerm]);

    const handleDelete = async () => {
        if (!deletingDirector) return;
        setIsDeleting(true);
        try {
            const res = await deleteDirectorAction(deletingDirector.id);
            if (res.success) {
                toast.success(`Director "${deletingDirector.name}" deleted`);
                setDirectors((prev) => prev.filter((d) => d.id !== deletingDirector.id));
                setDeletingDirector(null);
                router.refresh();
            } else {
                toast.error(res.messsage || "Failed to delete director");
            }
        } catch {
            toast.error("Failed to delete director");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                            <Video className="h-5 w-5" />
                        </div>
                        Director Management
                    </h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        Manage movie and series directors, upload profile photos with ImageKit, and track their cinematic catalog.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleSeedDirectors}
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
                                Seed Curated Directors
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold gap-2 shadow-lg shadow-red-600/20 text-xs h-10 px-4"
                    >
                        <Plus className="h-4 w-4" />
                        Add Director
                    </Button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search director by name, nationality, or bio..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-500 text-sm"
                    />
                </div>
                <div className="text-xs text-zinc-400 shrink-0 px-2 font-medium">
                    Showing {filteredDirectors.length} of {directors.length} directors
                </div>
            </div>

            {/* Directors Cards Grid */}
            {filteredDirectors.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-zinc-900/30 p-12 text-center">
                    <Video className="mx-auto h-12 w-12 text-zinc-600" />
                    <h3 className="mt-4 text-lg font-semibold text-white">No Directors Found</h3>
                    <p className="mt-1 text-sm text-zinc-400 max-w-sm mx-auto">
                        {searchTerm
                            ? "No directors match your search criteria. Try a different query."
                            : "No directors have been added yet. Add your first director to get started."}
                    </p>
                    {!searchTerm && (
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Director
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredDirectors.map((director) => (
                        <div
                            key={director.id}
                            className="group relative rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-red-950/20"
                        >
                            {/* Photo Aspect Ratio 3:4 */}
                            <div className="relative aspect-[3/4] w-full bg-zinc-950 overflow-hidden">
                                {director.imageUrl ? (
                                    <Image
                                        src={director.imageUrl}
                                        alt={director.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 20vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
                                        <User className="h-16 w-16" />
                                    </div>
                                )}

                                {/* ImageKit Badge if present */}
                                {director.imageUrl?.includes("ik.imagekit.io") && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/70 border border-emerald-500/40 text-[9px] font-semibold text-emerald-400 backdrop-blur-md">
                                        <Sparkles className="h-2 w-2" />
                                        CDN
                                    </div>
                                )}

                                {/* Quick action buttons overlay */}
                                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={() => setEditingDirector(director)}
                                        title="Edit director"
                                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 transition-colors shadow-md"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeletingDirector(director)}
                                        title="Delete director"
                                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/10 transition-colors shadow-md"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                                <div>
                                    <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-red-400 transition-colors">
                                        {director.name}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                                        {director.nationality && (
                                            <span className="flex items-center gap-1">
                                                <Globe className="h-3 w-3 text-red-500/80" />
                                                {director.nationality}
                                            </span>
                                        )}
                                        {director.birthDate && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3 text-zinc-500" />
                                                {new Date(director.birthDate).getFullYear()}
                                            </span>
                                        )}
                                    </div>

                                    {director.bio && (
                                        <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                                            {director.bio}
                                        </p>
                                    )}
                                </div>

                                {director.media && director.media.length > 0 && (
                                    <div className="pt-2 border-t border-white/5 flex items-center gap-1 text-[10px] text-zinc-400">
                                        <Film className="h-3 w-3 text-red-500" />
                                        <span>
                                            {director.media.length} {director.media.length === 1 ? "directed film" : "directed films"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Dialog */}
            <CreateDirectorDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                onSuccess={() => router.refresh()}
            />

            {/* Edit Dialog */}
            <EditDirectorDialog
                director={editingDirector}
                open={!!editingDirector}
                onOpenChange={(open) => !open && setEditingDirector(null)}
                onSuccess={() => router.refresh()}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deletingDirector}
                onOpenChange={(open: boolean) => !open && setDeletingDirector(null)}
            >
                <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Director</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-sm">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-white">
                                {deletingDirector?.name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-white/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDeletingDirector(null)}
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
