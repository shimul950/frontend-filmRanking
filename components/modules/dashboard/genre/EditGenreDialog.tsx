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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { updateGenreAction } from "@/src/app/(dashboardRoute)/admin/dashboard/genre-management/_action/updateGenre.action";
import { IGenre } from "@/src/types/genre.types";
import { updateGenreSchema } from "@/src/zod/genre.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getGenreTheme } from "./genre-helpers";
import { cn } from "@/lib/utils";

interface EditGenreDialogProps {
    genre: IGenre | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EditGenreDialog({
    genre,
    open,
    onOpenChange,
}: EditGenreDialogProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [clientError, setClientError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (genre) {
            setName(genre.name);
            setClientError(null);
            setServerError(null);
        }
    }, [genre, open]);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, genreName }: { id: string; genreName: string }) =>
            updateGenreAction(id, { name: genreName }),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to update genre");
                return;
            }
            toast.success(`Genre updated to "${name.trim()}" successfully!`);
            onOpenChange(false);
            setClientError(null);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["genres"] });
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || err?.message || "Failed to update genre");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!genre) return;

        setClientError(null);
        setServerError(null);

        const parsed = updateGenreSchema.safeParse({ name });
        if (!parsed.success) {
            setClientError(parsed.error.issues[0]?.message || "Invalid genre name");
            return;
        }

        if (name.trim() === genre.name) {
            onOpenChange(false);
            return;
        }

        await mutateAsync({ id: genre.id, genreName: name });
    };

    const previewTheme = getGenreTheme(name || genre?.name || "Preview");
    const PreviewIcon = previewTheme.icon;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Edit3 className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Modify Block
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Edit Genre Block
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Update the name and classification for this genre block across the catalog.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="edit-genre-name" className="text-sm font-semibold">
                            Genre Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="edit-genre-name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (clientError) setClientError(null);
                                if (serverError) setServerError(null);
                            }}
                            maxLength={50}
                            autoFocus
                            className="rounded-xl h-11"
                        />
                        {clientError && (
                            <p className="text-xs font-medium text-destructive">{clientError}</p>
                        )}
                        <div className="flex justify-between text-[11px] text-muted-foreground">
                            <span>Maximum 50 characters</span>
                            <span>{name.length}/50</span>
                        </div>
                    </div>

                    {/* Live Preview Card */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                            <span>Updated Block Preview</span>
                        </div>

                        <div
                            className={cn(
                                "relative overflow-hidden rounded-xl border border-border/80 p-4 transition-all duration-300",
                                previewTheme.gradient
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-lg border",
                                            previewTheme.bgAccent
                                        )}
                                    >
                                        <PreviewIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">
                                            {name.trim() || "Genre Name"}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground">
                                            {name.trim()
                                                ? name.toLowerCase().trim().replace(/\s+/g, "-")
                                                : "slug-preview"}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono rounded bg-muted/60 px-2 py-0.5 text-muted-foreground">
                                    {genre ? `#${genre.id.slice(0, 8)}` : "ID"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
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
                            type="submit"
                            disabled={isPending || !name.trim()}
                            className="rounded-xl gap-2 font-medium"
                        >
                            {isPending && <Spinner className="h-4 w-4" />}
                            <span>Save Changes</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
