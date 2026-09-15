"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { createTagAction } from "@/src/app/(dashboardRoute)/admin/dashboard/tag-management/_action/createTag.action";
import { createTagSchema } from "@/src/zod/tag.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Hash, Plus, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getTagTheme, POPULAR_TAGS } from "./tag-helpers";

export default function CreateTagDialog() {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [clientError, setClientError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (tagName: string) => createTagAction({ name: tagName }),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to create tag");
                return;
            }
            toast.success(`Tag "${name.trim()}" created successfully!`);
            setOpen(false);
            setName("");
            setClientError(null);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to create tag");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);
        setServerError(null);

        const parsed = createTagSchema.safeParse({ name });
        if (!parsed.success) {
            setClientError(parsed.error.issues[0]?.message || "Invalid tag name");
            return;
        }

        await mutateAsync(name);
    };

    const previewTheme = getTagTheme(name || "Editorial Tag");
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
                <Button className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl h-10 px-4 cursor-pointer">
                    <Plus className="h-4 w-4" />
                    <span>Add Tag</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Tag className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Tag Taxonomy
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Create Editorial Tag
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Create descriptive badges and tropes used for user reviews and movie categorization.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                    {/* Live Preview Card */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            Live Badge Preview
                        </Label>
                        <div
                            className={cn(
                                "relative overflow-hidden rounded-xl border p-4 transition-all duration-300 backdrop-blur-sm bg-gradient-to-br bg-card/70",
                                previewTheme.gradient,
                                previewTheme.borderHover
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "flex h-11 w-11 items-center justify-center rounded-xl border backdrop-blur-md shadow-sm transition-transform",
                                        previewTheme.bgAccent
                                    )}
                                >
                                    <PreviewIcon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                                            Editorial Tag
                                        </span>
                                    </div>
                                    <p className="font-bold text-foreground text-base line-clamp-1">
                                        {name.trim() || "Tag Name Preview"}
                                    </p>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        "px-2.5 py-0.5 text-xs font-medium tracking-wide rounded-md border flex items-center gap-1",
                                        previewTheme.badgeStyle
                                    )}
                                >
                                    <Hash className="h-3 w-3 opacity-60" />
                                    <span>{(name.trim() || "tag").toLowerCase().replace(/\s+/g, "-")}</span>
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Quick Preset Chips */}
                    <div className="space-y-2">
                        <Label className="text-xs font-semibold text-muted-foreground">
                            Popular Movie Tags
                        </Label>
                        <div className="flex flex-wrap gap-1.5">
                            {POPULAR_TAGS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => {
                                        setName(preset);
                                        setClientError(null);
                                    }}
                                    className={cn(
                                        "text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer",
                                        name.toLowerCase() === preset.toLowerCase()
                                            ? "bg-primary text-primary-foreground border-primary font-medium"
                                            : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                                    )}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Field */}
                    <div className="space-y-2">
                        <Label htmlFor="create-tag-name" className="text-sm font-semibold">
                            Tag Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="create-tag-name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (clientError) setClientError(null);
                            }}
                            placeholder="e.g. Cult Classic, Mind Bending"
                            maxLength={50}
                            disabled={isPending}
                            className="rounded-xl h-11"
                            autoFocus
                        />
                        <div className="flex justify-between text-[11px] text-muted-foreground px-1">
                            <span>Unique catalog tag label</span>
                            <span>{name.length}/50</span>
                        </div>
                        {clientError && (
                            <p className="text-xs text-destructive font-medium">{clientError}</p>
                        )}
                    </div>

                    {serverError && (
                        <Alert variant="destructive">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

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
                            className="rounded-xl gap-2 font-medium bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                        >
                            {isPending ? (
                                <Spinner className="h-4 w-4" />
                            ) : (
                                <Plus className="h-4 w-4" />
                            )}
                            <span>{isPending ? "Creating..." : "Create Tag"}</span>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
