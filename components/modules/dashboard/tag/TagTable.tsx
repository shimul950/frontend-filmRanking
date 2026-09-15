"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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

interface TagTableProps {
    tags: ITag[];
    onEdit: (tag: ITag) => void;
    onDelete: (tag: ITag) => void;
}

export default function TagTable({
    tags,
    onEdit,
    onDelete,
}: TagTableProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        toast.success(`Tag ID copied: ${id.slice(0, 8)}...`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent border-border/60">
                        <TableHead className="w-[80px] font-semibold text-xs uppercase tracking-wider">Badge</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Tag Name</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Catalog Slug</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Tag ID</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                        <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tags.map((tag) => {
                        const theme = getTagTheme(tag.name);
                        const Icon = theme.icon;
                        const isCopied = copiedId === tag.id;

                        return (
                            <TableRow
                                key={tag.id}
                                className="hover:bg-muted/30 border-border/40 transition-colors group"
                            >
                                <TableCell>
                                    <div
                                        className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-lg border",
                                            theme.bgAccent
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-foreground">
                                    <span className="group-hover:text-primary transition-colors">
                                        {tag.name}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "px-2 py-0.5 text-[11px] font-medium tracking-wide rounded-md border flex items-center gap-1 w-fit",
                                            theme.badgeStyle
                                        )}
                                    >
                                        <Hash className="h-3 w-3 opacity-60" />
                                        <span>{tag.name.toLowerCase().replace(/\s+/g, "-")}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyId(tag.id)}
                                        title="Click to copy full ID"
                                        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded bg-muted/40 hover:bg-muted cursor-pointer"
                                    >
                                        {isCopied ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5 opacity-60" />
                                        )}
                                        <span>{tag.id.slice(0, 10)}...</span>
                                    </button>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                                        <span className="text-xs font-medium text-muted-foreground">Active</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
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
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
