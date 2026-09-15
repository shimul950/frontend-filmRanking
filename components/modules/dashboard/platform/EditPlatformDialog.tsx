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
import { updatePlatformAction } from "@/src/app/(dashboardRoute)/admin/dashboard/platform-management/_action/updatePlatform.action";
import { IPlatform } from "@/src/types/platform.types";
import { updatePlatformSchema } from "@/src/zod/platform.validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getPlatformTheme } from "./platform-helpers";

interface EditPlatformDialogProps {
    platform: IPlatform | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface EditPlatformFormProps {
    platform: IPlatform;
    onClose: () => void;
}

function EditPlatformForm({ platform, onClose }: EditPlatformFormProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(platform.name);
    const [clientError, setClientError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: ({ id, platformName }: { id: string; platformName: string }) =>
            updatePlatformAction(id, { name: platformName }),
        onSuccess: (result) => {
            if (!result.success) {
                setServerError(result.messsage || "Failed to update platform");
                return;
            }
            toast.success(`Platform updated to "${name.trim()}" successfully!`);
            onClose();
            setClientError(null);
            setServerError(null);
            queryClient.invalidateQueries({ queryKey: ["platforms"] });
        },
        onError: (err: Error) => {
            setServerError(err.message || "Failed to update platform");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setClientError(null);
        setServerError(null);

        const parsed = updatePlatformSchema.safeParse({ name });
        if (!parsed.success) {
            setClientError(parsed.error.issues[0]?.message || "Invalid platform name");
            return;
        }

        await mutateAsync({ id: platform.id, platformName: name.trim() });
    };

    const previewTheme = getPlatformTheme(name || platform.name);
    const PreviewIcon = previewTheme.icon;
    const isUnchanged = platform.name === name.trim();

    return (
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Live Preview Card */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    Live Brand Preview
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
                                    Streaming Provider
                                </span>
                            </div>
                            <p className="font-bold text-foreground text-base line-clamp-1">
                                {name.trim() || platform.name}
                            </p>
                        </div>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "px-2.5 py-0.5 text-xs font-medium tracking-wide rounded-md border",
                                previewTheme.badgeStyle
                            )}
                        >
                            {(name.trim() || platform.name)
                                .toLowerCase()
                                .replace(/\s+/g, "-")}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Input Field */}
            <div className="space-y-2">
                <Label htmlFor="edit-platform-name" className="text-sm font-semibold">
                    Platform Name <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="edit-platform-name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (clientError) setClientError(null);
                    }}
                    placeholder="e.g. Netflix, Prime Video"
                    maxLength={50}
                    disabled={isPending}
                    className="rounded-xl h-11"
                    autoFocus
                />
                <div className="flex justify-between text-[11px] text-muted-foreground px-1">
                    <span>ID: {platform.id}</span>
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
                    className="rounded-xl gap-2 font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
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

export default function EditPlatformDialog({
    platform,
    open,
    onOpenChange,
}: EditPlatformDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-primary">
                        <Edit3 className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Platform Editor
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Edit Streaming Platform
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Update the platform&apos;s display name and branding identifier.
                    </DialogDescription>
                </DialogHeader>

                {platform && (
                    <EditPlatformForm
                        key={platform.id}
                        platform={platform}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
