import { CheckCircle2, ShieldAlert, ShieldCheck, UserX } from "lucide-react";

export function formatMemberDate(dateString?: string): string {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date);
    } catch {
        return "Invalid date";
    }
}

export function getUserStatusConfig(status: "ACTIVE" | "BLOCKED" | "DELETED") {
    switch (status) {
        case "ACTIVE":
            return {
                label: "Active",
                badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                dotClass: "bg-emerald-500 ring-emerald-500/20",
                icon: ShieldCheck,
                gradient: "from-emerald-500/10 via-transparent to-transparent",
                borderHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
            };
        case "BLOCKED":
            return {
                label: "Blocked",
                badgeClass: "bg-destructive/15 text-destructive border-destructive/30",
                dotClass: "bg-destructive ring-destructive/20",
                icon: ShieldAlert,
                gradient: "from-destructive/10 via-transparent to-transparent",
                borderHover: "hover:border-destructive/40 hover:shadow-destructive/10",
            };
        case "DELETED":
        default:
            return {
                label: "Deleted",
                badgeClass: "bg-muted text-muted-foreground border-border",
                dotClass: "bg-muted-foreground ring-muted/20",
                icon: UserX,
                gradient: "from-muted/20 via-transparent to-transparent",
                borderHover: "hover:border-border",
            };
    }
}

export function getVerificationConfig(isVerified: boolean) {
    if (isVerified) {
        return {
            label: "Verified",
            badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
            icon: CheckCircle2,
        };
    }
    return {
        label: "Unverified",
        badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        icon: ShieldAlert,
    };
}

export function getAvatarColor(name?: string): string {
    if (!name) return "from-indigo-600 to-violet-700";
    const colors = [
        "from-blue-600 to-indigo-700",
        "from-purple-600 to-pink-700",
        "from-emerald-600 to-teal-700",
        "from-amber-600 to-orange-700",
        "from-rose-600 to-red-700",
        "from-cyan-600 to-blue-700",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
}
