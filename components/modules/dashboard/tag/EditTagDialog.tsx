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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { updateTagAction } from "@/src/app/(dashboardRoute)/admin/dashboard/tag-management/_action/updateTag.action";
import { ITag } from "@/src/types/tag.types";
import { updateTagSchema } from "@/src/zod/tag.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Hash, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getTagTheme } from "./tag-helpers";

interface EditTagDialogProps {
    tag: ITag | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface EditTagFormProps {
    tag: ITag;
    onClose: () => void;
}

function EditTagForm({ tag, onClose }: EditTagFormProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(tag.name);
    const [clientError, setClientError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, tagName }: { id: string; tagName: string }) =>
            updateTagAction(id, { name: tagName }),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to update tag");
                return;
            }
            toast.success(`Tag updated to "${name.trim()}" successfully!`);
            onClose();
            setClientError(null);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to update tag");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);
        setServerError(null);

        const parsed = updateTagSchema.safeParse({ name });
        if (!parsed.success) {
            setClientError(parsed.error.issues[0]?.message || "Invalid tag name");
            return;
        }

        await mutateAsync({ id: tag.id, tagName: name.trim() });
    };

    const previewTheme = getTagTheme(name || tag.name);
    const PreviewIcon = previewTheme.icon;
    const isUnchanged = tag.name === name.trim();

    return (
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
                                {name.trim() || tag.name}
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
                            <span>{(name.trim() || tag.name).toLowerCase().replace(/\s+/g, "-")}</span>
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
                <Label htmlFor="edit-tag-name" className="text-sm font-semibold">
                    Tag Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="edit-tag-name"
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
                    <span>ID: {tag.id}</span>
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
                    onClick={onClose}
                    disabled={isPending}
                    className="rounded-xl"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isPending || !name.trim() || isUnchanged}
                    className="rounded-xl gap-2 font-medium bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                >
                    {isPending ? (
                        <Spinner className="h-4 w-4" />
                    ) : (
                        <Edit3 className="h-4 w-4" />
                    )}
                    <span>{isPending ? "Saving..." : "Save Changes"}</span>
                </Button>
            </DialogFooter>
        </form>
    );
}

export default function EditTagDialog({
    tag,
    open,
    onOpenChange,
}: EditTagDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Edit3 className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Tag Editor
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Edit Editorial Tag
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Update the tag&apos;s title and associated catalog slug.
                    </DialogDescription>
                </DialogHeader>

                {tag && (
                    <EditTagForm
                        key={tag.id}
                        tag={tag}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
