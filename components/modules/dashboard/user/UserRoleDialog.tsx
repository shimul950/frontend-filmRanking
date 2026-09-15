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
import { changeUserRoleAction } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/changeUserRole.action";
import { IUserListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/getUser.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserRoleDialogProps {
    user: IUserListItem | null;
    targetRole: "ADMIN" | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UserRoleDialog({
    user,
    targetRole,
    open,
    onOpenChange,
}: UserRoleDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, newRole }: { id: string; newRole: "ADMIN" }) =>
            changeUserRoleAction(id, newRole),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to update user role");
                return;
            }
            toast.success(`User "${user?.name}" has been promoted to Admin.`);
            onOpenChange(false);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["admins"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to update user role");
        },
    });

    const handleConfirm = async () => {
        if (!user || !targetRole) return;
        setServerError(null);
        await mutateAsync({ id: user.id, newRole: targetRole });
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold">
                            Promote to Administrator
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            Are you sure you want to promote{" "}
                            <span className="font-semibold text-foreground">
                                &quot;{user?.name}&quot;
                            </span>{" "}
                            to an <span className="font-semibold text-primary">Admin</span>?
                            They will be granted management permissions to moderate movies, genres, platforms, and community reviews.
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
                        className="rounded-xl gap-2 font-medium bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                    >
                        {isPending ? (
                            <Spinner className="h-4 w-4" />
                        ) : (
                            <ShieldCheck className="h-4 w-4" />
                        )}
                        <span>{isPending ? "Promoting..." : "Confirm Promotion"}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
