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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { createGenreAction } from "@/src/app/(dashboardRoute)/admin/dashboard/genre-management/_action/createGenre.action";
import { createGenreSchema } from "@/src/zod/genre.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getGenreTheme } from "./genre-helpers";
import { cn } from "@/lib/utils";

export default function CreateGenreDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [clientError, setClientError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (genreName: string) => createGenreAction({ name: genreName }),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to create genre");
                return;
            }
            toast.success(`Genre "${name.trim()}" created successfully!`);
            setOpen(false);
            setName("");
            setClientError(null);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["genres"] });
        },
        onError: (err: any) => {
            setServerError(err?.response?.data?.message || err?.message || "Failed to create genre");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);
        setServerError(null);

        const parsed = createGenreSchema.safeParse({ name });
        if (!parsed.success) {
            setClientError(parsed.error.issues[0]?.message || "Invalid genre name");
            return;
        }

        await mutateAsync(name);
    };

    const previewTheme = getGenreTheme(name || "Preview");
    const PreviewIcon = previewTheme.icon;

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                setOpen(val);
                if (!val) {
                    setName("");
                    setClientError(null);
                    setServerError(null);
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl h-10 px-4">
                    <Plus className="h-4 w-4" />
                    <span>Add Genre Block</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Tag className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Catalog Management
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Create New Genre Block
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Define a new genre classification. It will appear as an interactive block across the admin and browsing catalog.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="genre-name" className="text-sm font-semibold">
                            Genre Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="genre-name"
                            placeholder="e.g., Cyberpunk, Sci-Fi, Psychological Thriller"
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
                            <span>Live Block Preview</span>
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
                                    PREVIEW
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
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
                            <span>Create Genre</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
