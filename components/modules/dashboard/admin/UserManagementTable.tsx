"use client"

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { changeUserRoleAction } from '@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/changeUserRole.action';
import { changeUserStatusAction } from '@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/changeUserStatus.action';
import { getUsersAction } from '@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/getUser.action';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, MoreHorizontal, ShieldCheck, ShieldOff } from 'lucide-react';
import { useRef, useState } from 'react';


export default function UserManagementTable() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();

    // Only SUPER_ADMIN can change a user's role — matches the backend's
    // change-user-role route, which is checkAuth(Role.SUPER_ADMIN) only.
    // A plain ADMIN can still change user status (block/activate), since
    // that route allows both ADMIN and SUPER_ADMIN.
    const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

    const [actionError, setActionError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState<string>("ALL");
    const [page, setPage] = useState(1);
    const limit = 10;

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const debouncedSetSearch = (value: string) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            setSearchTerm(value);
            setPage(1);
        }, 400);
    };

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["users", { searchTerm, status, page }],
        queryFn: () =>
            getUsersAction({
                searchTerm,
                status: status === "ALL" ? undefined : status,
                page,
                limit,
            }),
        placeholderData: (prev) => prev,
    });

    const { mutateAsync: mutateStatus, isPending: isStatusPending } = useMutation({
        mutationFn: ({ id, newStatus }: { id: string; newStatus: "ACTIVE" | "BLOCKED" }) =>
            changeUserStatusAction(id, newStatus),
        onSuccess: (result: any) => {
            if (!result.success) {
                setActionError(result.messsage || "Failed to update user status");
                return;
            }
            setActionError(null);
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            setActionError(error?.response?.data?.message || "Failed to update user status");
        },
    });

    const { mutateAsync: mutateRole, isPending: isRolePending } = useMutation({
        mutationFn: ({ id, newRole }: { id: string; newRole: "USER" | "ADMIN" }) =>
            changeUserRoleAction(id, newRole),
        onSuccess: (result: any) => {
            if (!result.success) {
                setActionError(result.messsage || "Failed to update user role");
                return;
            }
            setActionError(null);
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            setActionError(error?.response?.data?.message || "Failed to update user role");
        },
    });

    const users = data?.users ?? [];
    const meta = data?.meta;

    return (
        <div className="space-y-4">
            {actionError && (
                <Alert variant="destructive">
                    <AlertDescription>{actionError}</AlertDescription>
                </Alert>
            )}


            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    placeholder="Search by name or email..."
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                    className="sm:max-w-xs"
                />
                <Select
                    value={status}
                    onValueChange={(value) => { setStatus(value); setPage(1); }}
                >
                    <SelectTrigger className="sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All statuses</SelectItem>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6}>
                                        <Skeleton className="h-8 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={u.image ?? undefined} alt={u.name} />
                                                <AvatarFallback className="text-xs">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{u.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={u.status === "ACTIVE" ? "default" : "destructive"}>
                                            {u.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={u.emailVerified ? "secondary" : "outline"}>
                                            {u.emailVerified ? "Verified" : "Unverified"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {/* Status change — any ADMIN or SUPER_ADMIN */}
                                                {u.status === "ACTIVE" ? (
                                                    <DropdownMenuItem
                                                        disabled={isStatusPending}
                                                        onClick={() => mutateStatus({ id: u.id, newStatus: "BLOCKED" })}
                                                        className="text-red-500 focus:text-red-500"
                                                    >
                                                        <ShieldOff className="size-4 mr-2" />
                                                        Block user
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        disabled={isStatusPending}
                                                        onClick={() => mutateStatus({ id: u.id, newStatus: "ACTIVE" })}
                                                    >
                                                        <ShieldCheck className="size-4 mr-2" />
                                                        Activate user
                                                    </DropdownMenuItem>
                                                )}

                                                {/* Role change — SUPER_ADMIN only */}
                                                {isSuperAdmin && (
                                                    <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            disabled={isRolePending}
                                                            onClick={() => mutateRole({ id: u.id, newRole: "ADMIN" })}
                                                        >
                                                            Promote to Admin
                                                        </DropdownMenuItem>
                                                    </>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Page {meta.page} of {meta.totalPages} · {meta.total} users
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1 || isFetching}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="size-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= meta.totalPages || isFetching}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}