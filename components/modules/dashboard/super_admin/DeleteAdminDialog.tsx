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
import { softDeleteAdminAction } from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/softDeleteAdmin.action";
import { IAdminListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/getAllAdmins.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteAdminDialogProps {
    admin: IAdminListItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteAdminDialog({
    admin,
    open,
    onOpenChange,
}: DeleteAdminDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (adminId: string) => softDeleteAdminAction(adminId),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to remove admin");
                return;
            }
            toast.success(`Admin record for "${admin?.name}" has been removed.`);
            onOpenChange(false);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to remove admin");
        },
    });

    const handleConfirm = async () => {
        if (!admin) return;
        setServerError(null);
        await mutateAsync(admin.id);
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold">
                            Remove Administrator
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            Are you sure you want to remove administrator{" "}
                            <span className="font-semibold text-foreground">
                                &quot;{admin?.name}&quot;
                            </span>
                            ? This soft-deletes the admin profile and revokes their administrative privileges.
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
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="rounded-xl gap-2 font-medium cursor-pointer"
                    >
                        {isPending ? (
                            <Spinner className="h-4 w-4" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        <span>{isPending ? "Removing..." : "Remove Administrator"}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
