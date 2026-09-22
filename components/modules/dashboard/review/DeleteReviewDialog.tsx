"use client";

import { Trash2 } from "lucide-react";
import { IReview } from "@/src/types/movie.types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface DeleteReviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    review: IReview | null;
    onConfirm: () => void;
    isDeleting: boolean;
}

export default function DeleteReviewDialog({
    isOpen,
    onClose,
    review,
    onConfirm,
    isDeleting,
}: DeleteReviewDialogProps) {
    if (!review) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-500">
                        <Trash2 className="h-5 w-5" />
                        <span>Delete Review Permanently?</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground pt-1">
                        Are you sure you want to delete this review for <strong>{review.media?.title || "this movie"}</strong> written by <strong>{review.user?.name || "the user"}</strong>? This action cannot be undone and will recalculate the movie's scores.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0 mt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="text-xs h-9 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 px-4 rounded-xl font-bold"
                    >
                        {isDeleting ? "Deleting..." : "Permanently Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
