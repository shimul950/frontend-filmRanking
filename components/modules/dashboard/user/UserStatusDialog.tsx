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
import { changeUserStatusAction } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/changeUserStatus.action";
import { IUserListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/getUser.action";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface UserStatusDialogProps {
    user: IUserListItem | null;
    targetStatus: "ACTIVE" | "BLOCKED" | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UserStatusDialog({
    user,
    targetStatus,
    open,
    onOpenChange,
}: UserStatusDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const isBlocking = targetStatus === "BLOCKED";

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, newStatus }: { id: string; newStatus: "ACTIVE" | "BLOCKED" }) =>
            changeUserStatusAction(id, newStatus),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to update user status");
                return;
            }
            toast.success(
                isBlocking
                    ? `User "${user?.name}" has been blocked.`
                    : `User "${user?.name}" has been activated.`
            );
            onOpenChange(false);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to update user status");
        },
    });

    const handleConfirm = async () => {
        if (!user || !targetStatus) return;
        setServerError(null);
        await mutateAsync({ id: user.id, newStatus: targetStatus });
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
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                            isBlocking
                                ? "bg-destructive/10 text-destructive"
                                : "bg-emerald-500/10 text-emerald-500"
                        }`}
                    >
                        {isBlocking ? (
                            <ShieldOff className="h-6 w-6" />
                        ) : (
                            <ShieldCheck className="h-6 w-6" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold">
                            {isBlocking ? "Block User Account" : "Activate User Account"}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            {isBlocking ? (
                                <>
                                    Are you sure you want to block{" "}
                                    <span className="font-semibold text-foreground">
                                        &quot;{user?.name}&quot;
                                    </span>
                                    ? This will prevent them from signing in, leaving reviews, or rating films.
                                </>
                            ) : (
                                <>
                                    Are you sure you want to restore access for{" "}
                                    <span className="font-semibold text-foreground">
                                        &quot;{user?.name}&quot;
                                    </span>
                                    ? Their account privileges will be reactivated immediately.
                                </>
                            )}
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
                        variant={isBlocking ? "destructive" : "default"}
                        onClick={handleConfirm}
                        disabled={isPending}
                        className={`rounded-xl gap-2 font-medium cursor-pointer ${
                            !isBlocking ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                        }`}
                    >
                        {isPending ? (
                            <Spinner className="h-4 w-4" />
                        ) : isBlocking ? (
                            <ShieldOff className="h-4 w-4" />
                        ) : (
                            <ShieldCheck className="h-4 w-4" />
                        )}
                        <span>
                            {isPending
                                ? "Updating..."
                                : isBlocking
                                ? "Block Account"
                                : "Activate Account"}
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
