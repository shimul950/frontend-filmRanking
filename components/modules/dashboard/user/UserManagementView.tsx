"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
    getUsersAction,
    IUserListItem,
} from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/getUser.action";
import { useQuery } from "@tanstack/react-query";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List,
    RotateCcw,
    Search,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
    Users,
    X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import UserCard from "./UserCard";
import UserDetailsDialog from "./UserDetailsDialog";
import UserRoleDialog from "./UserRoleDialog";
import UserStatusDialog from "./UserStatusDialog";
import UserTable from "./UserTable";

export default function UserManagementView() {
    const { user: currentUser } = useAuth();
    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<string>("ALL");
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [page, setPage] = useState(1);
    const limit = 12;

    // Modal states
    const [selectedUser, setSelectedUser] = useState<IUserListItem | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const [statusTargetUser, setStatusTargetUser] = useState<IUserListItem | null>(null);
    const [targetStatus, setTargetStatus] = useState<"ACTIVE" | "BLOCKED" | null>(null);
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

    const [roleTargetUser, setRoleTargetUser] = useState<IUserListItem | null>(null);
    const [targetRole, setTargetRole] = useState<"ADMIN" | null>(null);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

    // Debounce search input
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            setSearchTerm(value);
            setPage(1);
        }, 400);
    };

    const handleClearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
        setPage(1);
    };

    // Query users
    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["users", { searchTerm, status, page, limit }],
        queryFn: () =>
            getUsersAction({
                searchTerm,
                status: status === "ALL" ? undefined : status,
                page,
                limit,
            }),
        placeholderData: (prev) => prev,
    });

    const users = useMemo(() => data?.users ?? [], [data?.users]);
    const meta = data?.meta;

    // Aggregates for current view
    const activeCount = useMemo(
        () => users.filter((u) => u.status === "ACTIVE").length,
        [users]
    );
    const blockedCount = useMemo(
        () => users.filter((u) => u.status === "BLOCKED").length,
        [users]
    );
    const verifiedCount = useMemo(
        () => users.filter((u) => u.emailVerified).length,
        [users]
    );

    const handleViewDetails = (user: IUserListItem) => {
        setSelectedUser(user);
        setIsDetailsOpen(true);
    };

    const handleRequestStatusChange = (
        user: IUserListItem,
        newStatus: "ACTIVE" | "BLOCKED"
    ) => {
        setStatusTargetUser(user);
        setTargetStatus(newStatus);
        setIsStatusDialogOpen(true);
    };

    const handleRequestRoleChange = (
        user: IUserListItem,
        newRole: "ADMIN"
    ) => {
        setRoleTargetUser(user);
        setTargetRole(newRole);
        setIsRoleDialogOpen(true);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Users className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Directory & Access Control
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        User Management
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-2xl">
                        Monitor member accounts, inspect user profiles, and manage access statuses and administrative roles.
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
                                isFetching ? "animate-spin text-primary" : ""
                            }`}
                        />
                        <span>Refresh Data</span>
                    </Button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Total Registered</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : meta?.total ?? users.length}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Active Accounts</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : activeCount}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                        <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Restricted / Blocked</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : blockedCount}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm shadow-sm">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground font-medium">Email Verified</p>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                            {isLoading ? "--" : verifiedCount}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Filter & Toolbar Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchInput}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search by name or email address..."
                            className="pl-9 pr-9 h-11 rounded-xl bg-card/50 border-border/60 focus-visible:ring-1 focus-visible:ring-primary"
                        />
                        {searchInput && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <Select
                        value={status}
                        onValueChange={(val) => {
                            setStatus(val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="sm:w-44 h-11 rounded-xl bg-card/50 border-border/60">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="ACTIVE">Active Only</SelectItem>
                            <SelectItem value="BLOCKED">Blocked Only</SelectItem>
                        </SelectContent>
                    </Select>
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
                        <span>Failed to fetch user directory from server.</span>
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
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-3 w-40" />
                            </div>
                            <div className="pt-2 flex justify-between border-t border-border/30">
                                <Skeleton className="h-5 w-16 rounded-md" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && users.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/70 p-12 text-center bg-card/30 backdrop-blur-sm space-y-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <UserCheck className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight">No accounts found</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            {searchTerm
                                ? `No users match "${searchTerm}". Try adjusting your keywords.`
                                : "No user accounts are registered under this filter."}
                        </p>
                    </div>
                    {searchTerm && (
                        <Button
                            variant="outline"
                            onClick={handleClearSearch}
                            className="rounded-xl text-xs"
                        >
                            Reset Search Filters
                        </Button>
                    )}
                </div>
            )}

            {/* User Content: Grid vs Table */}
            {!isLoading && users.length > 0 && (
                <>
                    {viewMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                            {users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    isSuperAdmin={isSuperAdmin}
                                    onViewDetails={handleViewDetails}
                                    onRequestStatusChange={handleRequestStatusChange}
                                    onRequestRoleChange={handleRequestRoleChange}
                                />
                            ))}
                        </div>
                    ) : (
                        <UserTable
                            users={users}
                            isSuperAdmin={isSuperAdmin}
                            onViewDetails={handleViewDetails}
                            onRequestStatusChange={handleRequestStatusChange}
                            onRequestRoleChange={handleRequestRoleChange}
                        />
                    )}

                    {/* Pagination */}
                    {meta && meta.totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                            <p>
                                Showing page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
                                <span className="font-semibold text-foreground">{meta.totalPages}</span> (
                                {meta.total} total users)
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page <= 1 || isFetching}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="rounded-xl h-9 gap-1 cursor-pointer"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    <span>Previous</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={page >= meta.totalPages || isFetching}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-xl h-9 gap-1 cursor-pointer"
                                >
                                    <span>Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Modals */}
            <UserDetailsDialog
                user={selectedUser}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                isSuperAdmin={isSuperAdmin}
                onRequestStatusChange={handleRequestStatusChange}
                onRequestRoleChange={handleRequestRoleChange}
            />

            <UserStatusDialog
                user={statusTargetUser}
                targetStatus={targetStatus}
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
            />

            <UserRoleDialog
                user={roleTargetUser}
                targetRole={targetRole}
                open={isRoleDialogOpen}
                onOpenChange={setIsRoleDialogOpen}
            />
        </div>
    );
}
