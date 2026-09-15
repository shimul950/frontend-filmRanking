"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ITag } from "@/src/types/tag.types";
import { Check, Copy, Edit2, Hash, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getTagTheme } from "./tag-helpers";

interface TagCardProps {
    tag: ITag;
    onEdit: (tag: ITag) => void;
    onDelete: (tag: ITag) => void;
    isDeleting?: boolean;
}

export default function TagCard({
    tag,
    onEdit,
    onDelete,
    isDeleting = false,
}: TagCardProps) {
    const [copied, setCopied] = useState(false);
    const theme = getTagTheme(tag.name);
    const Icon = theme.icon;

    const handleCopyId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(tag.id);
        setCopied(true);
        toast.success(`Tag ID copied: ${tag.id.slice(0, 8)}...`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br bg-card/85 p-5 backdrop-blur-md transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20",
                theme.borderHover,
                theme.gradient
            )}
        >
            {/* Top decorative glow */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl transition-all duration-500 group-hover:scale-125" />

            <div className="relative flex flex-col justify-between h-full gap-4">
                {/* Header: Icon & Action Buttons */}
                <div className="flex items-start justify-between">
                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur-md transition-transform duration-300 group-hover:scale-105 shadow-sm",
                            theme.bgAccent
                        )}
                    >
                        <Icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                    </div>

                    <div className="flex items-center gap-1 opacity-90 sm:opacity-75 sm:group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => onEdit(tag)}
                                    aria-label={`Edit ${tag.name}`}
                                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Edit tag</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    disabled={isDeleting}
                                    onClick={() => onDelete(tag)}
                                    aria-label={`Delete ${tag.name}`}
                                    className="h-8 w-8 rounded-lg hover:bg-destructive/15 hover:text-destructive text-muted-foreground transition-colors cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Delete tag</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Tag Info */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                            Editorial Tag
                        </span>
                    </div>
                    <h3
                        className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors"
                        title={tag.name}
                    >
                        {tag.name}
                    </h3>
                </div>

                {/* Footer Chip & Quick ID Copy */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <Badge
                        variant="secondary"
                        className={cn(
                            "px-2.5 py-0.5 text-[11px] font-medium tracking-wide rounded-md border flex items-center gap-1",
                            theme.badgeStyle
                        )}
                    >
                        <Hash className="h-3 w-3 opacity-60" />
                        <span>{tag.name.toLowerCase().replace(/\s+/g, "-")}</span>
                    </Badge>

                    <button
                        type="button"
                        onClick={handleCopyId}
                        title="Click to copy full ID"
                        className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted/50 cursor-pointer"
                    >
                        {copied ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                            <Copy className="h-3 w-3 opacity-60" />
                        )}
                        <span>#{tag.id.slice(0, 6)}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
