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
import { IAdminListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/getAllAdmins.action";
import {
    Check,
    Copy,
    Eye,
    Mail,
    MoreHorizontal,
    Phone,
    Shield,
    Trash2,
    UserMinus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatAdminDate, getAdminAvatarGradient } from "./admin-helpers";

interface AdminTableProps {
    admins: IAdminListItem[];
    onViewDetails: (admin: IAdminListItem) => void;
    onRequestDemote: (admin: IAdminListItem) => void;
    onRequestDelete: (admin: IAdminListItem) => void;
}

export default function AdminTable({
    admins,
    onViewDetails,
    onRequestDemote,
    onRequestDelete,
}: AdminTableProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    const handleCopy = (text: string, type: "id" | "email") => {
        navigator.clipboard.writeText(text);
        if (type === "id") {
            setCopiedId(text);
            toast.success(`Admin ID copied: ${text.slice(0, 8)}...`);
            setTimeout(() => setCopiedId(null), 2000);
        } else {
            setCopiedEmail(text);
            toast.success(`Email copied: ${text}`);
            setTimeout(() => setCopiedEmail(null), 2000);
        }
    };

    return (
        <div className="rounded-2xl border border-amber-500/20 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-muted/40">
                    <TableRow className="hover:bg-transparent border-border/60">
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Administrator</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Email Address</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Contact Phone</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Security Clearance</TableHead>
                        <TableHead className="font-semibold text-xs uppercase tracking-wider">Assigned Date</TableHead>
                        <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {admins.map((admin) => {
                        const isCopied = copiedId === admin.id;
                        const isEmailCopied = copiedEmail === admin.email;

                        return (
                            <TableRow
                                key={admin.id}
                                className="hover:bg-muted/30 border-border/40 transition-colors group"
                            >
                                {/* Admin Info */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="relative shrink-0">
                                            <Avatar className="h-10 w-10 border border-amber-500/30 shadow-xs">
                                                <AvatarImage src={admin.image ?? undefined} alt={admin.name} />
                                                <AvatarFallback
                                                    className={cn(
                                                        "text-xs font-bold text-white bg-gradient-to-br",
                                                        getAdminAvatarGradient(admin.name)
                                                    )}
                                                >
                                                    {admin.name?.charAt(0).toUpperCase() || "A"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-amber-950 ring-2 ring-background">
                                                <Shield className="h-2.5 w-2.5 fill-current" />
                                            </span>
                                        </div>
                                        <div className="space-y-0.5">
                                            <div
                                                onClick={() => onViewDetails(admin)}
                                                className="font-semibold text-sm text-foreground group-hover:text-amber-500 transition-colors cursor-pointer"
                                            >
                                                {admin.name}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(admin.id, "id")}
                                                className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                                                title="Copy Admin Record ID"
                                            >
                                                {isCopied ? (
                                                    <Check className="h-3 w-3 text-emerald-500" />
                                                ) : (
                                                    <Copy className="h-3 w-3 opacity-60" />
                                                )}
                                                <span>#{admin.id.slice(0, 8)}</span>
                                            </button>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Email */}
                                <TableCell>
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5 opacity-60 shrink-0" />
                                        <span className="font-medium">{admin.email}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(admin.email, "email")}
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

                                {/* Contact Phone */}
                                <TableCell>
                                    {admin.contactNumber ? (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Phone className="h-3.5 w-3.5 opacity-60 shrink-0" />
                                            <span>{admin.contactNumber}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground/60 italic">Not set</span>
                                    )}
                                </TableCell>

                                {/* Security Badge */}
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className="bg-amber-500/15 text-amber-400 border-amber-500/30 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide rounded-md border inline-flex items-center gap-1"
                                    >
                                        <Shield className="h-3 w-3 fill-current text-amber-500" />
                                        <span>Administrator</span>
                                    </Badge>
                                </TableCell>

                                {/* Joined Date */}
                                <TableCell className="text-xs text-muted-foreground">
                                    {formatAdminDate(admin.createdAt)}
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
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
                                                <p>Inspect Profile</p>
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
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
