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
import { IUserListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/getUser.action";
import {
    Check,
    Copy,
    Eye,
    Mail,
    MoreHorizontal,
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

interface UserTableProps {
    users: IUserListItem[];
    isSuperAdmin: boolean;
    onViewDetails: (user: IUserListItem) => void;
    onRequestStatusChange: (user: IUserListItem, targetStatus: "ACTIVE" | "BLOCKED") => void;
    onRequestRoleChange: (user: IUserListItem, targetRole: "ADMIN") => void;
}

export default function UserTable({
    users,
    isSuperAdmin,
    onViewDetails,
    onRequestStatusChange,
    onRequestRoleChange,
}: UserTableProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const handleCopy = (text: string, type: "id" | "email") => {
        navigator.clipboard.writeText(text);
        if (type === "id") {
            setCopiedId(text);
            toast.success(`User ID copied: ${text.slice(0, 8)}...`);
            setTimeout(() => setCopiedId(null), 2000);
        } else {
            setCopiedEmail(text);
            toast.success(`Email copied: ${text}`);
            setTimeout(() => setCopiedEmail(null), 2000);
        }
    };

    return (
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent border-border/60">
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">User</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Email & Contact</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Email Verified</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Joined Date</TableHead>
                        <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const statusCfg = getUserStatusConfig(user.status);
                        const verifyCfg = getVerificationConfig(user.emailVerified);
                        const VerifyIcon = verifyCfg.icon;
                        const isCopied = copiedId === user.id;
                        const isEmailCopied = copiedEmail === user.email;

                        return (
                            <TableRow
                                key={user.id}
                                className="hover:bg-muted/30 border-border/40 transition-colors group"
                            >
                                {/* User Info */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0">
                                            <Avatar className="h-10 w-10 border border-background shadow-xs">
                                                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                                                <AvatarFallback
                                                    className={cn(
                                                        "text-xs font-bold text-white bg-gradient-to-br",
                                                        getAvatarColor(user.name)
                                                    )}
                                                >
                                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span
                                                className={cn(
                                                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                                                    statusCfg.dotClass
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div
                                                onClick={() => onViewDetails(user)}
                                                className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors cursor-pointer"
                                            >
                                                {user.name}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(user.id, "id")}
                                                className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                                                title="Copy User ID"
                                            >
                                                {isCopied ? (
                                                    <Check className="h-3 w-3 text-emerald-500" />
                                                ) : (
                                                    <Copy className="h-3 w-3 opacity-60" />
                                                )}
                                                <span>#{user.id.slice(0, 8)}</span>
                                            </button>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Email */}
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5 opacity-60 shrink-0" />
                                        <span className="font-medium">{user.email}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(user.email, "email")}
                                            className="opacity-40 group-hover:opacity-100 hover:text-foreground transition-opacity cursor-pointer ml-1"
                                            title="Copy Email"
                                        >
                                            {isEmailCopied ? (
                                                <Check className="h-3 w-3 text-emerald-500" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </button>
                                    </div>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "px-2.5 py-0.5 text-[11px] font-semibold tracking-wide rounded-md border inline-flex items-center gap-1.5",
                                            statusCfg.badgeClass
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                statusCfg.dotClass,
                                                user.status === "ACTIVE" && "animate-pulse"
                                            )}
                                        />
                                        <span>{statusCfg.label}</span>
                                    </Badge>
                                </TableCell>

                                {/* Verified */}
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "px-2.5 py-0.5 text-[11px] font-medium tracking-wide rounded-md border inline-flex items-center gap-1.5",
                                            verifyCfg.badgeClass
                                        )}
                                    >
                                        <VerifyIcon className="h-3.5 w-3.5" />
                                        <span>{verifyCfg.label}</span>
                                    </Badge>
                                </TableCell>

                                {/* Joined Date */}
                                <TableCell className="text-xs text-muted-foreground">
                                    {formatMemberDate(user.createdAt)}
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
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
                                                <p>View Profile</p>
                                            </TooltipContent>
                                        </Tooltip>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 shadow-xl">
                                                <DropdownMenuItem
                                                    onClick={() => onViewDetails(user)}
                                                    className="rounded-lg gap-2 cursor-pointer"
                                                >
                                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                                    <span>View Details</span>
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                {user.status === "ACTIVE" ? (
                                                    <DropdownMenuItem
                                                        onClick={() => onRequestStatusChange(user, "BLOCKED")}
                                                        className="rounded-lg gap-2 text-destructive focus:text-destructive cursor-pointer"
                                                    >
                                                        <ShieldAlert className="h-4 w-4" />
                                                        <span>Block User</span>
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        onClick={() => onRequestStatusChange(user, "ACTIVE")}
                                                        className="rounded-lg gap-2 text-emerald-500 focus:text-emerald-500 cursor-pointer"
                                                    >
                                                        <ShieldCheck className="h-4 w-4" />
                                                        <span>Activate User</span>
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
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
