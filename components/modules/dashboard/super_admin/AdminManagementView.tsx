"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    getAllAdminsAction,
    IAdminListItem,
} from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/getAllAdmins.action";
import { useQuery } from "@tanstack/react-query";
import {
    LayoutGrid,
    List,
    Phone,
    RotateCcw,
    Search,
    Shield,
    ShieldCheck,
    Users,
    X,
} from "lucide-react";
import { useMemo, useState } from "react";
import AdminCard from "./AdminCard";
import AdminDetailsDialog from "./AdminDetailsDialog";
import AdminTable from "./AdminTable";
import CreateAdminDialog from "./CreateAdminDialogue";
import DeleteAdminDialog from "./DeleteAdminDialog";
import DemoteAdminDialog from "./DemoteAdminDialog";

export default function AdminManagementView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

    // Modal states
    const [selectedAdmin, setSelectedAdmin] = useState<IAdminListItem | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [demoteTarget, setDemoteTarget] = useState<IAdminListItem | null>(null);
    const [isDemoteOpen, setIsDemoteOpen] = useState(false);

    const [deleteTarget, setDeleteTarget] = useState<IAdminListItem | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Query admins
    const {
        data: adminsData,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["admins"],
        queryFn: () => getAllAdminsAction(),
    });

    const admins = useMemo(() => adminsData ?? [], [adminsData]);

    // Filter admins
    const filteredAdmins = useMemo(() => {
        if (!searchQuery.trim()) return admins;
        const q = searchQuery.toLowerCase().trim();
        return admins.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.email.toLowerCase().includes(q) ||
                (a.contactNumber && a.contactNumber.toLowerCase().includes(q))
        );
    }, [admins, searchQuery]);

    // Metrics
    const phoneCount = useMemo(
        () => admins.filter((a) => Boolean(a.contactNumber)).length,
        [admins]
    );

    const handleViewDetails = (admin: IAdminListItem) => {
        setSelectedAdmin(admin);
        setIsDetailsOpen(true);
    };

    const handleRequestDemote = (admin: IAdminListItem) => {
        setDemoteTarget(admin);
        setIsDemoteOpen(true);
    };

    const handleRequestDelete = (admin: IAdminListItem) => {
        setDeleteTarget(admin);
        setIsDeleteOpen(true);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                            <Shield className="h-4 w-4 fill-current" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Super Admin Clearance
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        Administrator Management
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Oversee system administrators, manage staff credentials, and enforce administrative permissions.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="gap-2 rounded-xl h-10 border-border/60 bg-card/50 hover:bg-card text-xs font-medium cursor-pointer"
                    >
                        <RotateCcw
                            className={`h-4 w-4 text-muted-foreground ${
                                isFetching ? "animate-spin text-amber-500" : ""
                            }`}
                        />
                        <span>Refresh</span>
                    </Button>
                    <CreateAdminDialog />
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Total Administrators</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : admins.length}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Phone Connected</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : phoneCount}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Filtered Results</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : filteredAdmins.length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Filter & Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, email, or phone..."
                        className="pl-9 pr-9 h-11 rounded-xl bg-card/50 border-border/60 focus-visible:ring-1 focus-visible:ring-amber-500"
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

                {/* View Switcher: Grid vs Table */}
                <div className="flex items-center gap-2 self-end md:self-auto">
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
                </div>
            </div>

            {/* Error Message */}
            {isError && (
                <Alert variant="destructive" className="rounded-2xl border-destructive/30">
                    <AlertDescription className="flex items-center justify-between">
                        <span>Failed to fetch administrator directory.</span>
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
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-amber-500/20 bg-card/50 p-5 space-y-4"
                        >
                            <div className="flex justify-between items-start">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <div className="pt-2 flex justify-between border-t border-border/30">
                                <Skeleton className="h-5 w-20 rounded-md" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && admins.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 p-12 text-center bg-card/30 backdrop-blur-sm space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
                        <Shield className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">No administrators configured</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Click &quot;Add Administrator&quot; to provision a new staff account.
                        </p>
                    </div>
                    <CreateAdminDialog />
                </div>
            )}

            {!isLoading && admins.length > 0 && filteredAdmins.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 p-10 text-center bg-card/30 space-y-3">
                    <Search className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-semibold">No administrators match &quot;{searchQuery}&quot;</p>
                    <Button
                        variant="link"
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-amber-500"
                    >
                        Clear search filter
                    </Button>
                </div>
            )}

            {/* Main Content: Grid vs Table */}
            {!isLoading && filteredAdmins.length > 0 && (
                <>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {filteredAdmins.map((admin) => (
                                <AdminCard
                                    key={admin.id}
                                    admin={admin}
                                    onViewDetails={handleViewDetails}
                                    onRequestDemote={handleRequestDemote}
                                    onRequestDelete={handleRequestDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <AdminTable
                            admins={filteredAdmins}
                            onViewDetails={handleViewDetails}
                            onRequestDemote={handleRequestDemote}
                            onRequestDelete={handleRequestDelete}
                        />
                    )}
                </>
            )}

            {/* Dialogs */}
            <AdminDetailsDialog
                admin={selectedAdmin}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onRequestDemote={handleRequestDemote}
                onRequestDelete={handleRequestDelete}
            />

            <DemoteAdminDialog
                admin={demoteTarget}
                open={isDemoteOpen}
                onOpenChange={setIsDemoteOpen}
            />

            <DeleteAdminDialog
                admin={deleteTarget}
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
            />
        </div>
    );
}
