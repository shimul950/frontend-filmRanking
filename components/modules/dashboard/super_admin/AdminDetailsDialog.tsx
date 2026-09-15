"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { IAdminListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/admin-management/_action/getAllAdmins.action";
import {
    Calendar,
    Check,
    Copy,
    Hash,
    Mail,
    Phone,
    Shield,
    Trash2,
    UserMinus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatAdminDate, getAdminAvatarGradient } from "./admin-helpers";

interface AdminDetailsDialogProps {
    admin: IAdminListItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onRequestDemote: (admin: IAdminListItem) => void;
    onRequestDelete: (admin: IAdminListItem) => void;
}

export default function AdminDetailsDialog({
    admin,
    open,
    onOpenChange,
    onRequestDemote,
    onRequestDelete,
}: AdminDetailsDialogProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!admin) return null;

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(label);
        toast.success(`Copied ${label}: ${text}`);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] rounded-2xl p-6">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-500">
                        <Shield className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Administrator Profile
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Staff Account Details
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Privileged administrative credentials and access control.
                    </DialogDescription>
                </DialogHeader>

                {/* Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card/90 to-card p-5 backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-amber-500/50 shadow-md">
                                <AvatarImage src={admin.image ?? undefined} alt={admin.name} />
                                <AvatarFallback
                                    className={cn(
                                        "text-lg font-bold text-white bg-gradient-to-br",
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

                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg font-bold text-foreground">
                                    {admin.name}
                                </h2>
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-500/15 text-amber-400 border-amber-500/30 px-2 py-0.5 text-xs font-semibold rounded-md border inline-flex items-center gap-1"
                                >
                                    <Shield className="h-3 w-3 fill-current text-amber-500" />
                                    <span>Administrator</span>
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                <span>{admin.email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Admin ID */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5">
                                <Hash className="h-3.5 w-3.5" />
                                Admin Record ID
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCopy(admin.id, "Admin ID")}
                                className="hover:text-foreground transition-colors cursor-pointer"
                            >
                                {copiedField === "Admin ID" ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </div>
                        <p className="font-mono text-[11px] text-foreground font-medium break-all">
                            {admin.id}
                        </p>
                    </div>

                    {/* Underlying User ID */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5">
                                <Hash className="h-3.5 w-3.5" />
                                Auth User ID
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCopy(admin.userId, "User ID")}
                                className="hover:text-foreground transition-colors cursor-pointer"
                            >
                                {copiedField === "User ID" ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </div>
                        <p className="font-mono text-[11px] text-foreground font-medium break-all">
                            {admin.userId}
                        </p>
                    </div>

                    {/* Contact Phone */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5" />
                                Contact Phone
                            </span>
                            {admin.contactNumber && (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(admin.contactNumber!, "Phone")}
                                    className="hover:text-foreground transition-colors cursor-pointer"
                                >
                                    {copiedField === "Phone" ? (
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    ) : (
                                        <Copy className="h-3.5 w-3.5" />
                                    )}
                                </button>
                            )}
                        </div>
                        <p className="text-foreground font-medium">
                            {admin.contactNumber || <span className="italic text-muted-foreground">Not provided</span>}
                        </p>
                    </div>

                    {/* Joined Date */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            Admin Since
                        </div>
                        <p className="text-foreground font-medium">
                            {formatAdminDate(admin.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Administrative Controls */}
                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            onOpenChange(false);
                            onRequestDemote(admin);
                        }}
                        className="rounded-xl gap-1.5 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 border-amber-500/30 cursor-pointer"
                    >
                        <UserMinus className="h-4 w-4" />
                        <span>Demote to User</span>
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => {
                            onOpenChange(false);
                            onRequestDelete(admin);
                        }}
                        className="rounded-xl gap-1.5 cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove Admin</span>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl cursor-pointer ml-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
