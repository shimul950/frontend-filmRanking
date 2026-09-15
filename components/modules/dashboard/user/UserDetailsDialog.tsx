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
import { IUserListItem } from "@/src/app/(dashboardRoute)/admin/dashboard/user-management/_action/getUser.action";
import {
    Calendar,
    Check,
    Copy,
    Hash,
    Mail,
    Shield,
    ShieldAlert,
    ShieldCheck,
    UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    formatMemberDate,
    getAvatarColor,
    getUserStatusConfig,
    getVerificationConfig,
} from "./user-helpers";

interface UserDetailsDialogProps {
    user: IUserListItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isSuperAdmin: boolean;
    onRequestStatusChange: (user: IUserListItem, targetStatus: "ACTIVE" | "BLOCKED") => void;
    onRequestRoleChange: (user: IUserListItem, targetRole: "ADMIN") => void;
}

export default function UserDetailsDialog({
    user,
    open,
    onOpenChange,
    isSuperAdmin,
    onRequestStatusChange,
    onRequestRoleChange,
}: UserDetailsDialogProps) {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    if (!user) return null;

    const statusCfg = getUserStatusConfig(user.status);
    const verifyCfg = getVerificationConfig(user.emailVerified);
    const VerifyIcon = verifyCfg.icon;

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
                    <div className="flex items-center gap-2 text-primary">
                        <UserCheck className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            Account Profile
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        User Profile Details
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">
                        Detailed account information and administrative controls.
                    </DialogDescription>
                </DialogHeader>

                {/* Profile Hero Card */}
                <div
                    className={cn(
                        "relative overflow-hidden rounded-2xl border p-5 bg-gradient-to-br bg-card/70 backdrop-blur-md transition-all duration-300",
                        statusCfg.gradient,
                        statusCfg.borderHover
                    )}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                                <AvatarFallback
                                    className={cn(
                                        "text-lg font-bold text-white bg-gradient-to-br",
                                        getAvatarColor(user.name)
                                    )}
                                >
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <span
                                className={cn(
                                    "absolute bottom-0 right-0 h-4 w-4 rounded-full ring-2 ring-background",
                                    statusCfg.dotClass,
                                    user.status === "ACTIVE" && "animate-pulse"
                                )}
                            />
                        </div>

                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg font-bold text-foreground">
                                    {user.name}
                                </h2>
                                <Badge
                                    variant="secondary"
                                    className={cn("px-2 py-0.5 text-xs font-semibold rounded-md border", statusCfg.badgeClass)}
                                >
                                    {statusCfg.label}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className={cn("px-2 py-0.5 text-xs font-medium rounded-md border inline-flex items-center gap-1", verifyCfg.badgeClass)}
                                >
                                    <VerifyIcon className="h-3 w-3" />
                                    <span>{verifyCfg.label}</span>
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                <span>{user.email}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Account Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* User ID */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5">
                                <Hash className="h-3.5 w-3.5" />
                                User ID
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCopy(user.id, "User ID")}
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
                            {user.id}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                Email Address
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCopy(user.email, "Email")}
                                className="hover:text-foreground transition-colors cursor-pointer"
                            >
                                {copiedField === "Email" ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                )}
                            </button>
                        </div>
                        <p className="text-foreground font-medium truncate" title={user.email}>
                            {user.email}
                        </p>
                    </div>

                    {/* Registration Date */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                            <Calendar className="h-3.5 w-3.5" />
                            Joined Platform
                        </div>
                        <p className="text-foreground font-medium">
                            {formatMemberDate(user.createdAt)}
                        </p>
                    </div>

                    {/* Security & Verification */}
                    <div className="rounded-xl border border-border/50 bg-muted/30 p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                            <Shield className="h-3.5 w-3.5" />
                            Email Status
                        </div>
                        <p className="text-foreground font-medium">
                            {user.emailVerified ? "Verified Account" : "Unconfirmed Email"}
                        </p>
                    </div>
                </div>

                {/* Administrative Actions */}
                <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
                    {user.status === "ACTIVE" ? (
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                onOpenChange(false);
                                onRequestStatusChange(user, "BLOCKED");
                            }}
                            className="rounded-xl gap-1.5 cursor-pointer font-medium"
                        >
                            <ShieldAlert className="h-4 w-4" />
                            <span>Block User</span>
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false);
                                onRequestStatusChange(user, "ACTIVE");
                            }}
                            className="rounded-xl gap-1.5 cursor-pointer text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30"
                        >
                            <ShieldCheck className="h-4 w-4" />
                            <span>Activate User</span>
                        </Button>
                    )}

                    {isSuperAdmin && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                onOpenChange(false);
                                onRequestRoleChange(user, "ADMIN");
                            }}
                            className="rounded-xl gap-1.5 cursor-pointer font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                        >
                            <Shield className="h-4 w-4" />
                            <span>Promote to Admin</span>
                        </Button>
                    )}

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
