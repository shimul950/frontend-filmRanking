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
import { IUserListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/getUser.action";
import {
    Calendar,
    Check,
    Copy,
    Eye,
    Mail,
    MoreVertical,
    Shield,
    ShieldAlert,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    formatMemberDate,
    getAvatarColor,
    getUserStatusConfig,
    getVerificationConfig,
} from "./user-helpers";

interface UserCardProps {
    user: IUserListItem;
    isSuperAdmin: boolean;
    onViewDetails: (user: IUserListItem) => void;
    onRequestStatusChange: (user: IUserListItem, targetStatus: "ACTIVE" | "BLOCKED") => void;
    onRequestRoleChange: (user: IUserListItem, targetRole: "ADMIN") => void;
}

export default function UserCard({
    user,
    isSuperAdmin,
    onViewDetails,
    onRequestStatusChange,
    onRequestRoleChange,
}: UserCardProps) {
    const [copiedEmail, setCopiedEmail] = useState(false);
    const statusCfg = getUserStatusConfig(user.status);
    const verifyCfg = getVerificationConfig(user.emailVerified);
    const VerifyIcon = verifyCfg.icon;

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(user.email);
        setCopiedEmail(true);
        toast.success(`Copied email: ${user.email}`);
        setTimeout(() => setCopiedEmail(false), 2000);
    };

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br bg-card/85 p-5 backdrop-blur-md transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20",
                statusCfg.borderHover,
                statusCfg.gradient
            )}
        >
            {/* Top ambient glow */}
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl transition-all duration-500 group-hover:scale-125" />

            <div className="relative flex flex-col justify-between h-full gap-4">
                {/* Header: Avatar, Status & Menu */}
                <div className="flex items-start justify-between">
                    <div className="relative">
                        <Avatar className="h-13 w-13 border-2 border-background/80 shadow-md">
                            <AvatarImage src={user.image ?? undefined} alt={user.name} />
                            <AvatarFallback
                                className={cn(
                                    "text-sm font-bold text-white bg-gradient-to-br",
                                    getAvatarColor(user.name)
                                )}
                            >
                                {user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                        {/* Status beacon */}
                        <span
                            className={cn(
                                "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-background",
                                statusCfg.dotClass,
                                user.status === "ACTIVE" && "animate-pulse"
                            )}
                            title={`Status: ${statusCfg.label}`}
                        />
                    </div>

                    <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => onViewDetails(user)}
                                    className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                <p>Inspect account</p>
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
                                    onClick={() => onViewDetails(user)}
                                    className="rounded-lg gap-2 cursor-pointer"
                                >
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                    <span>View Profile</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {user.status === "ACTIVE" ? (
                                    <DropdownMenuItem
                                        onClick={() => onRequestStatusChange(user, "BLOCKED")}
                                        className="rounded-lg gap-2 text-destructive focus:text-destructive cursor-pointer"
                                    >
                                        <ShieldAlert className="h-4 w-4" />
                                        <span>Block Account</span>
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() => onRequestStatusChange(user, "ACTIVE")}
                                        className="rounded-lg gap-2 text-emerald-500 focus:text-emerald-500 cursor-pointer"
                                    >
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Activate Account</span>
                                    </DropdownMenuItem>
                                )}

                                {isSuperAdmin && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onRequestRoleChange(user, "ADMIN")}
                                            className="rounded-lg gap-2 text-primary focus:text-primary cursor-pointer font-medium"
                                        >
                                            <Shield className="h-4 w-4" />
                                            <span>Promote to Admin</span>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <h3
                            className="font-bold text-base text-foreground tracking-tight line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
                            onClick={() => onViewDetails(user)}
                        >
                            {user.name}
                        </h3>
                    </div>

                    {/* Email with copy button */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0 opacity-70" />
                        <span className="truncate max-w-[200px]" title={user.email}>
                            {user.email}
                        </span>
                        <button
                            type="button"
                            onClick={handleCopyEmail}
                            title="Copy email address"
                            className="opacity-60 hover:opacity-100 hover:text-foreground transition-opacity cursor-pointer ml-auto"
                        >
                            {copiedEmail ? (
                                <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Badges & Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Badge
                            variant="secondary"
                            className={cn(
                                "px-2 py-0.5 text-[10px] font-semibold tracking-wide rounded-md border",
                                statusCfg.badgeClass
                            )}
                        >
                            {statusCfg.label}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "px-2 py-0.5 text-[10px] font-medium tracking-wide rounded-md border flex items-center gap-1",
                                verifyCfg.badgeClass
                            )}
                        >
                            <VerifyIcon className="h-3 w-3" />
                            <span>{verifyCfg.label}</span>
                        </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70" title={`Joined on ${user.createdAt}`}>
                        <Calendar className="h-3 w-3 opacity-60" />
                        <span>{formatMemberDate(user.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
