"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllTagsAction } from "@/src/app/(dashboardRoute)/admin/dashboard/tag-management/_action/getAllTags.action";
import { ITag } from "@/src/types/tag.types";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowDownAZ,
    ArrowUpAZ,
    Bookmark,
    Hash,
    LayoutGrid,
    List,
    RotateCcw,
    Search,
    Sparkles,
    Tag,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import CreateTagDialog from "./CreateTagDialog";
import DeleteTagDialog from "./DeleteTagDialog";
import EditTagDialog from "./EditTagDialog";
import TagCard from "./TagCard";
import TagTable from "./TagTable";

export default function TagManagementView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    // Modal states
    const [editingTag, setEditingTag] = useState<ITag | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const [deletingTag, setDeletingTag] = useState<ITag | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Fetch tags
    const {
        data: tags,
        isLoading,
        isError,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: () => getAllTagsAction(),
    });

    const allTags = useMemo(() => tags ?? [], [tags]);

    // Filter and sort tags
    const filteredTags = useMemo(() => {
        let result = allTags;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter((t) => t.name.toLowerCase().includes(query));
        }

        return [...result].sort((a, b) => {
            const comp = a.name.localeCompare(b.name);
            return sortOrder === "asc" ? comp : -comp;
        });
    }, [allTags, searchQuery, sortOrder]);

    const handleOpenEdit = (tag: ITag) => {
        setEditingTag(tag);
        setIsEditDialogOpen(true);
    };

    const handleOpenDelete = (tag: ITag) => {
        setDeletingTag(tag);
        setIsDeleteDialogOpen(true);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Tag className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Taxonomy & Catalog
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Tag Management
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Manage descriptive tags, film tropes, and badge identifiers used across community reviews and catalog discovery.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <CreateTagDialog />
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Bookmark className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Total Tags</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : allTags.length}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Active Badges</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : allTags.length}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <Search className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Filtered Results</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : filteredTags.length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Filter & Toolbar Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tags by keyword..."
                        className="pl-9 pr-9 h-11 rounded-xl bg-card/50 border-border/60 focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* View Mode & Sort Controls */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                    {/* View Switcher: Grid vs Table */}
                    <div className="flex items-center rounded-xl border border-border/60 bg-card/50 p-1">
                        <Button
                            variant={viewMode === "grid" ? "secondary" : "ghost"}
                            size="icon-sm"
                            onClick={() => setViewMode("grid")}
                            className="h-8 w-8 rounded-lg cursor-pointer"
                            title="Grid View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "table" ? "secondary" : "ghost"}
                            size="icon-sm"
                            onClick={() => setViewMode("table")}
                            className="h-8 w-8 rounded-lg cursor-pointer"
                            title="Table View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Sort Order */}
                    <Button
                        variant="outline"
                        onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                        className="gap-2 rounded-xl h-10 border-border/60 bg-card/50 hover:bg-card text-xs font-medium cursor-pointer"
                    >
                        {sortOrder === "asc" ? (
                            <>
                                <ArrowDownAZ className="h-4 w-4 text-primary" />
                                <span>A to Z</span>
                            </>
                        ) : (
                            <>
                                <ArrowUpAZ className="h-4 w-4 text-primary" />
                                <span>Z to A</span>
                            </>
                        )}
                    </Button>

                    {/* Refresh Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="rounded-xl h-10 w-10 border-border/60 bg-card/50 hover:bg-card cursor-pointer"
                        title="Reload tags"
                    >
                        <RotateCcw
                            className={`h-4 w-4 text-muted-foreground ${
                                isFetching ? "animate-spin text-primary" : ""
                            }`}
                        />
                    </Button>
                </div>
            </div>

            {/* Error Message */}
            {isError && (
                <Alert variant="destructive" className="rounded-2xl border-destructive/30">
                    <AlertDescription className="flex items-center justify-between">
                        <span>Failed to load tags directory from server.</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="h-8 border-destructive/40 hover:bg-destructive/10"
                        >
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
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
            )}

            {/* Empty States */}
            {!isLoading && allTags.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 p-12 text-center bg-card/30 backdrop-blur-sm space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Hash className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">No tags registered</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Create editorial tags (e.g., Cult Classic, Mind Bending, Oscar Winner) to enrich review categorization.
                        </p>
                    </div>
                    <CreateTagDialog />
                </div>
            )}

            {!isLoading && allTags.length > 0 && filteredTags.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 p-10 text-center bg-card/30 space-y-3">
                    <Search className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-semibold">No tags match &quot;{searchQuery}&quot;</p>
                    <Button
                        variant="link"
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-primary"
                    >
                        Clear search filters
                    </Button>
                </div>
            )}

            {/* Content Display: Grid vs Table */}
            {!isLoading && filteredTags.length > 0 && (
                <>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {filteredTags.map((tag) => (
                                <TagCard
                                    key={tag.id}
                                    tag={tag}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleOpenDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <TagTable
                            tags={filteredTags}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                        />
                    )}
                </>
            )}

            {/* Modals */}
            <EditTagDialog
                tag={editingTag}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />

            <DeleteTagDialog
                tag={deletingTag}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            />
        </div>
    );
}
