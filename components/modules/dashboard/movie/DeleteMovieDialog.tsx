"use client";

import { useState } from "react";
import { toast } from "sonner";
import { IMovie } from "@/src/types/movie.types";
import { deleteMovieAction } from "@/src/app/(dashboardRoute)/admin/dashboard/movie-management/_action/deleteMovie.action";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteMovieDialogProps {
    isOpen: boolean;
    onClose: () => void;
    movie: IMovie | null;
    onSuccess: () => void;
}

export function DeleteMovieDialog({
    isOpen,
    onClose,
    movie,
    onSuccess,
}: DeleteMovieDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!movie) return;

        setIsDeleting(true);
        try {
            const res = await deleteMovieAction(movie.id);

            if (res.success) {
                toast.success(`"${movie.title}" deleted successfully`);
                onSuccess();
                onClose();
            } else {
                toast.error(res.messsage || "Failed to delete movie");
            }
        } catch (error) {
            console.error("Delete movie error:", error);
            toast.error("An unexpected error occurred while deleting the movie");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
            <DialogContent className="max-w-md border-red-500/20 bg-zinc-950 text-white shadow-2xl p-6">
                <DialogHeader className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                        <DialogTitle className="text-base font-bold text-white tracking-wide">
                            Delete Movie Permanently?
                        </DialogTitle>
                        <DialogDescription className="text-xs text-zinc-400 mt-1 leading-relaxed">
                            Are you sure you want to remove <span className="font-semibold text-white">&ldquo;{movie?.title}&rdquo;</span>? This action cannot be undone and will delete associated relations, reviews, comments, and rankings.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <DialogFooter className="border-t border-white/10 pt-4 gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="text-xs text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 text-white hover:bg-red-700 text-xs font-semibold px-4 shadow-lg shadow-red-600/30"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                                Deleting Movie...
                            </>
                        ) : (
                            "Confirm Delete"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
