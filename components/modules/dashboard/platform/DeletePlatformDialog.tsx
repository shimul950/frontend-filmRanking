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
import { deletePlatformAction } from "@/src/app/(dashboardRoute)/admin/dashboard/platform-management/_action/deletePlatform.action";
import { IPlatform } from "@/src/types/platform.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeletePlatformDialogProps {
    platform: IPlatform | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeletePlatformDialog({
    platform,
    open,
    onOpenChange,
}: DeletePlatformDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (platformId: string) => deletePlatformAction(platformId),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to delete platform");
                return;
            }
            toast.success(`Platform "${platform?.name}" has been deleted.`);
            onOpenChange(false);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["platforms"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to delete platform");
        },
    });

    const handleDelete = async () => {
        if (!platform) return;
        setServerError(null);
        await mutateAsync(platform.id);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val);
                if (!val) setServerError(null);
            }}
        >
            <DialogContent className="sm:max-w-[440px] rounded-2xl p-6">
                <DialogHeader className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <DialogTitle className="text-xl font-bold">
                            Delete Platform
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-semibold text-foreground">
                                &quot;{platform?.name}&quot;
                            </span>
                            ? This action cannot be undone and will unlink any films associated with this streaming channel.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {serverError && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="gap-2 sm:gap-0 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                        className="rounded-xl gap-2 font-medium cursor-pointer"
                    >
                        {isPending ? (
                            <Spinner className="h-4 w-4" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        <span>Delete Platform</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
