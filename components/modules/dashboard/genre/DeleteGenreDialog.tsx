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
import { deleteGenreAction } from "@/src/app/(dashboardRoute)/admin/dashboard/genre-management/_action/deleteGenre.action";
import { IGenre } from "@/src/types/genre.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteGenreDialogProps {
    genre: IGenre | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteGenreDialog({
    genre,
    open,
    onOpenChange,
}: DeleteGenreDialogProps) {
    const queryClient = useQueryClient();
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (genreId: string) => deleteGenreAction(genreId),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to delete genre");
                return;
            }
            toast.success(`Genre "${genre?.name}" has been deleted.`);
            onOpenChange(false);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["genres"] });
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || err?.message || "Failed to delete genre");
        },
    });

    const handleDelete = async () => {
        if (!genre) return;
        setServerError(null);
        await mutateAsync(genre.id);
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
                            Delete Genre Block
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                            Are you sure you want to permanently delete{" "}
                            <span className="font-semibold text-foreground">
                                &quot;{genre?.name}&quot;
                            </span>
                            ? This action cannot be undone and may affect movies tagged with this genre.
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
                        className="rounded-xl gap-2 font-medium"
                    >
                        {isPending ? (
                            <Spinner className="h-4 w-4" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                        <span>Delete Genre</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
