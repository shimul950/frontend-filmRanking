"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { IAdminListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/getAllAdmins.action";
import { changeUserRoleAction } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/changeUserRole.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, UserMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DemoteAdminDialogProps {
    admin: IAdminListItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DemoteAdminDialog({
    admin,
    open,
    onOpenChange,
}: DemoteAdminDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (userId: string) => changeUserRoleAction(userId, "USER"),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to demote admin");
                return;
            }
            toast.success(`Admin "${admin?.name}" has been demoted to regular user.`);
            onOpenChange(false);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["admins"] });
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to demote admin");
        },
    });

    const handleConfirm = async () => {
        if (!admin) return;
        setServerError(null);
        await mutateAsync(admin.userId);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val);
                if (!val) setServerError(null);
            }}
        >
            <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
                <DialogHeader className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                        <UserMinus className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold">
                            Demote Administrator
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            Are you sure you want to demote{" "}
                            <span className="font-semibold text-foreground">
                                &quot;{admin?.name}&quot;
                            </span>{" "}
                            to a regular user? They will immediately lose access to the Admin Dashboard and all staff management controls.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {serverError && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="gap-2 sm:gap-0 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="rounded-xl cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="rounded-xl gap-2 font-medium bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                    >
                        {isPending ? (
                            <Spinner className="h-4 w-4" />
                        ) : (
                            <UserMinus className="h-4 w-4" />
                        )}
                        <span>{isPending ? "Demoting..." : "Confirm Demotion"}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
