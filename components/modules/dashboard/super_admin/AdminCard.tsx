"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IAdminListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/getAllAdmins.action";
import {
    Calendar,
    Check,
    Copy,
    Eye,
    Mail,
    MoreVertical,
    Phone,
    Shield,
    Trash2,
    UserMinus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatAdminDate, getAdminAvatarGradient } from "./admin-helpers";

interface AdminCardProps {
    admin: IAdminListItem;
    onViewDetails: (admin: IAdminListItem) => void;
    onRequestDemote: (admin: IAdminListItem) => void;
    onRequestDelete: (admin: IAdminListItem) => void;
}

export default function AdminCard({
    admin,
    onViewDetails,
    onRequestDemote,
    onRequestDelete,
}: AdminCardProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (text: string, label: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        toast.success(`Copied ${label}: ${text}`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-card/90 to-card/95 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5">
            {/* Ambient top-right glow */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-amber-500/15 via-red-500/10 to-transparent blur-2xl transition-all duration-500 group-hover:scale-125" />

            <div className="relative flex flex-col justify-between h-full gap-4">
                {/* Header: Avatar, Role Badge & Menu */}
                <div className="flex items-start justify-between">
                    <div className="relative">
                        <Avatar className="h-13 w-13 border-2 border-amber-500/40 shadow-md">
                            <AvatarImage src={admin.image ?? undefined} alt={admin.name} />
                            <AvatarFallback
                                className={cn(
                                    "text-sm font-bold text-white bg-gradient-to-br",
                                    getAdminAvatarGradient(admin.name)
                                )}
                            >
                                {admin.name?.charAt(0).toUpperCase() || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-amber-950 ring-2 ring-background">
                            <Shield className="h-3 w-3 fill-current" />
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => onViewDetails(admin)}
                                    className="h-8 w-8 rounded-lg hover:bg-amber-500/10 hover:text-amber-500 transition-colors cursor-pointer"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Inspect profile</p>
                            </TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl">
                                <DropdownMenuItem
                                    onClick={() => onViewDetails(admin)}
                                    className="rounded-lg gap-2 cursor-pointer"
                                >
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span>View Details</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => onRequestDemote(admin)}
                                    className="rounded-lg gap-2 text-amber-500 focus:text-amber-500 cursor-pointer"
                                >
                                    <UserMinus className="h-4 w-4" />
                                    <span>Demote to User</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => onRequestDelete(admin)}
                                    className="rounded-lg gap-2 text-destructive focus:text-destructive cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Remove Admin</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <h3
                            className="font-bold text-base text-foreground tracking-tight line-clamp-1 group-hover:text-amber-500 transition-colors cursor-pointer"
                            onClick={() => onViewDetails(admin)}
                        >
                            {admin.name}
                        </h3>
                    </div>

                    {/* Email with copy */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate max-w-[200px]" title={admin.email}>
                            {admin.email}
                        </span>
                        <button
                            type="button"
                            onClick={(e) => handleCopy(admin.email, "email", e)}
                            title="Copy email address"
                            className="opacity-60 hover:opacity-100 hover:text-foreground transition-opacity cursor-pointer ml-auto"
                        >
                            {copiedField === "email" ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </button>
                    </div>

                    {/* Contact Number with copy */}
                    {admin.contactNumber && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 shrink-0 opacity-70" />
                            <span className="truncate">{admin.contactNumber}</span>
                            <button
                                type="button"
                                onClick={(e) => handleCopy(admin.contactNumber!, "phone", e)}
                                title="Copy contact number"
                                className="opacity-60 hover:opacity-100 hover:text-foreground transition-opacity cursor-pointer ml-auto"
                            >
                                {copiedField === "phone" ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <Copy className="h-3 w-3" />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Badges & Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <Badge
                        variant="secondary"
                        className="bg-amber-500/15 text-amber-400 border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide rounded-md border inline-flex items-center gap-1"
                    >
                        <Shield className="h-3 w-3 fill-current text-amber-500" />
                        <span>Administrator</span>
                    </Badge>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                        <Calendar className="h-3 w-3 opacity-60" />
                        <span>{formatAdminDate(admin.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
