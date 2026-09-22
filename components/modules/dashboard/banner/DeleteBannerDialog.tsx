"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteBannerAction } from "@/src/app/(dashboardRoute)/admin/dashboard/banner-management/_action/deleteBanner.action";
import { IBanner } from "@/src/types/banner.types";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

interface DeleteBannerDialogProps {
    banner: IBanner | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export function DeleteBannerDialog({
    banner,
    open,
    onOpenChange,
    onSuccess,
}: DeleteBannerDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!banner) return;

        setIsDeleting(true);
        try {
            const res = await deleteBannerAction(banner.id);
            if (res.success) {
                toast.success(`Banner "${banner.title}" deleted successfully`);
                onOpenChange(false);
                onSuccess?.();
            } else {
                toast.error(res.messsage || "Failed to delete banner");
            }
        } catch (err: any) {
            toast.error(err.message || "An unexpected error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card/95 p-6 backdrop-blur-2xl shadow-2xl">
                <DialogHeader className="space-y-2 text-left">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <DialogTitle className="text-xl font-black text-foreground">
                        Delete Spotlight Banner?
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Are you sure you want to delete <span className="font-bold text-foreground">&ldquo;{banner?.title}&rdquo;</span>? This will permanently remove it from the database and the homepage hero slider.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/60">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isDeleting}
                        className="rounded-xl text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded-xl text-xs font-bold gap-1.5"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                Delete Banner
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
