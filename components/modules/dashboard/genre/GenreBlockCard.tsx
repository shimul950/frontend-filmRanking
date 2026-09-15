"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IGenre } from "@/src/types/genre.types";
import { Edit2, Trash2 } from "lucide-react";
import { getGenreTheme } from "./genre-helpers";

interface GenreBlockCardProps {
    genre: IGenre;
    onEdit: (genre: IGenre) => void;
    onDelete: (genre: IGenre) => void;
    isDeleting?: boolean;
}

export default function GenreBlockCard({
    genre,
    onEdit,
    onDelete,
    isDeleting = false,
}: GenreBlockCardProps) {
    const theme = getGenreTheme(genre.name);
    const Icon = theme.icon;

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br bg-card/80 p-5 backdrop-blur-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20",
                theme.borderHover,
                theme.gradient
            )}
        >
            {/* Top decorative glow effect */}
            <div className="absolute -top-12 -right-12 h-28 w-28 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl transition-all duration-500 group-hover:scale-125" />

            <div className="relative flex flex-col justify-between h-full gap-4">
                {/* Header: Icon & Action Buttons */}
                <div className="flex items-start justify-between">
                    <div
                        className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl border backdrop-blur-md transition-transform duration-300 group-hover:scale-105",
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
                                    onClick={() => onEdit(genre)}
                                    aria-label={`Edit ${genre.name}`}
                                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Edit genre</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    disabled={isDeleting}
                                    onClick={() => onDelete(genre)}
                                    aria-label={`Delete ${genre.name}`}
                                    className="h-8 w-8 rounded-lg hover:bg-destructive/15 hover:text-destructive text-muted-foreground transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Delete genre</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>

                {/* Genre Info */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 animate-pulse" />
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                            Genre Block
                        </span>
                    </div>
                    <h3
                        className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors"
                        title={genre.name}
                    >
                        {genre.name}
                    </h3>
                </div>

                {/* Footer Chip & Slug / ID */}
                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <Badge
                        variant="secondary"
                        className={cn(
                            "px-2 py-0.5 text-[11px] font-medium tracking-wide rounded-md border",
                            theme.bgAccent
                        )}
                    >
                        {genre.name.toLowerCase().replace(/\s+/g, "-")}
                    </Badge>
                    <span
                        className="font-mono text-[10px] text-muted-foreground/60 tracking-wider"
                        title={genre.id}
                    >
                        #{genre.id.slice(0, 8)}
                    </span>
                </div>
            </div>
        </div>
    );
}
