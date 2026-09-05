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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllAdminsAction } from '@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/getAllAdmins.action';
import { softDeleteAdminAction } from '@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/softDeleteAdmin.action';
import { changeUserRoleAction } from '@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/changeUserRole.action';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MoreHorizontal, Trash2, UserMinus } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminManagementTable() {

    const searchParams = useSearchParams();
    const shouldAutoOpenCreate = searchParams.get('create') === 'true';

    const queryClient = useQueryClient();
    const [actionError, setActionError] = useState<string | null>(null);

    const { data: admins, isLoading } = useQuery({
        queryKey: ["admins"],
        queryFn: () => getAllAdminsAction(),
    });

    const { mutateAsync: mutateDelete, isPending: isDeletePending } = useMutation({
        mutationFn: (adminId: string) => softDeleteAdminAction(adminId),
        onSuccess: (result: any) => {
            if (!result.success) {
                setActionError(result.messsage || "Failed to remove admin");
                return;
            }
            setActionError(null);
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
        onError: (error: any) => {
            setActionError(error?.response?.data?.message || "Failed to remove admin");
        },
    });

    const { mutateAsync: mutateDemote, isPending: isDemotePending } = useMutation({
        mutationFn: (targetUserId: string) => changeUserRoleAction(targetUserId, "USER"),
        onSuccess: (result: any) => {
            if (!result.success) {
                setActionError(result.messsage || "Failed to demote admin");
                return;
            }
            setActionError(null);
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error: any) => {
            setActionError(error?.response?.data?.message || "Failed to demote admin");
        },
    });

    const list = admins ?? [];

    return (
        <div className="space-y-4">
            {actionError && (
                <Alert variant="destructive">
                    <AlertDescription>{actionError}</AlertDescription>
                </Alert>
            )}

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Admin</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={5}>
                                        <Skeleton className="h-8 w-full" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No admins found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            list.map((admin) => (
                                <TableRow key={admin.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={admin.image ?? undefined} alt={admin.name} />
                                                <AvatarFallback className="text-xs">
                                                    {admin.name?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{admin.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{admin.email}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {admin.contactNumber ?? "—"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    disabled={isDemotePending}
                                                    onClick={() => mutateDemote(admin.userId)}
                                                >
                                                    <UserMinus className="size-4 mr-2" />
                                                    Demote to User
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    disabled={isDeletePending}
                                                    onClick={() => mutateDelete(admin.id)}
                                                    className="text-red-500 focus:text-red-500"
                                                >
                                                    <Trash2 className="size-4 mr-2" />
                                                    Remove admin
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}