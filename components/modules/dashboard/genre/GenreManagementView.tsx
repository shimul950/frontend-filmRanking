"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllGenresAction } from "@/src/app/(dashboardRoute)/admin/dashboard/genre-management/_action/getAllGenres.action";
import { IGenre } from "@/src/types/genre.types";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowDownAZ,
    ArrowUpAZ,
    Film,
    Layers,
    RotateCcw,
    Search,
    Tags,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import CreateGenreDialog from "./CreateGenreDialog";
import DeleteGenreDialog from "./DeleteGenreDialog";
import EditGenreDialog from "./EditGenreDialog";
import GenreBlockCard from "./GenreBlockCard";

export default function GenreManagementView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Modal states
    const [editingGenre, setEditingGenre] = useState<IGenre | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [deletingGenre, setDeletingGenre] = useState<IGenre | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Fetch genres
    const {
        data: genres,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["genres"],
        queryFn: () => getAllGenresAction(),
    });

    const allGenres = useMemo(() => genres ?? [], [genres]);

    // Filter and sort genres
    const filteredGenres = useMemo(() => {
        let result = allGenres;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((g) => g.name.toLowerCase().includes(query));
        }

        return [...result].sort((a, b) => {
            const comp = a.name.localeCompare(b.name);
            return sortOrder === "asc" ? comp : -comp;
        });
    }, [allGenres, searchQuery, sortOrder]);

    const handleOpenEdit = (genre: IGenre) => {
        setEditingGenre(genre);
        setIsEditDialogOpen(true);
    };

    const handleOpenDelete = (genre: IGenre) => {
        setDeletingGenre(genre);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Tags className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Catalog Management
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Genre Management
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Manage and structure film categories. Genres are rendered as interactive visual blocks for categorization and discovery.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <CreateGenreDialog />
                </div>
            </div>

            {/* Filter & Toolbar Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search genre blocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-9 rounded-xl h-11 bg-card/60 border-border/80 focus-visible:ring-primary/20"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Right controls: Counter & Sort */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border/80 text-xs font-medium text-muted-foreground">
                        <Layers className="h-4 w-4 text-primary" />
                        <span>
                            {isLoading ? "..." : `${filteredGenres.length} of ${allGenres.length}`} Blocks
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="h-10 rounded-xl gap-2 text-xs font-medium border-border/80 bg-card hover:bg-muted/50"
                        title={sortOrder === "asc" ? "Sort Z to A" : "Sort A to Z"}
                    >
                        {sortOrder === "asc" ? (
                            <>
                                <ArrowDownAZ className="h-4 w-4 text-primary" />
                                <span>A-Z</span>
                            </>
                        ) : (
                            <>
                                <ArrowUpAZ className="h-4 w-4 text-primary" />
                                <span>Z-A</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {isError && (
                <Alert variant="destructive" className="rounded-xl">
                    <AlertDescription className="flex items-center justify-between">
                        <span>Failed to load genres. Please check your connection or server status.</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="h-8 gap-1.5 ml-4"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Retry</span>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Block Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-border/50 bg-card/50 p-5 space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-12 w-12 rounded-xl" />
                                <div className="flex gap-1">
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                    <Skeleton className="h-8 w-8 rounded-lg" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-6 w-3/4" />
                            </div>
                            <div className="pt-2 flex justify-between border-t border-border/30">
                                <Skeleton className="h-5 w-16 rounded-md" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredGenres.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {filteredGenres.map((genre) => (
                        <GenreBlockCard
                            key={genre.id}
                            genre={genre}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                        />
                    ))}
                </div>
            ) : allGenres.length === 0 ? (
                /* Empty Database State */
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/30 p-12 text-center space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                        <Film className="h-8 w-8" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                        <h3 className="text-lg font-bold text-foreground">
                            No genre blocks yet
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Get started by creating your first movie genre block to categorize films.
                        </p>
                    </div>
                    <CreateGenreDialog />
                </div>
            ) : (
                /* No Search Results */
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/30 p-12 text-center space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                        <Search className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-foreground">
                            No matching genre blocks
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            No genres matched &quot;{searchQuery}&quot;. Try adjusting your search query.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="rounded-xl"
                    >
                        Clear Search
                    </Button>
                </div>
            )}

            {/* Edit Genre Modal */}
            <EditGenreDialog
                genre={editingGenre}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />

            {/* Delete Confirmation Modal */}
            <DeleteGenreDialog
                genre={deletingGenre}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
        </div>
    );
}
