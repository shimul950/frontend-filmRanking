import {
    MonitorPlay,
    Tv,
    Film,
    Play,
    Radio,
    Sparkles,
    Flame,
    Zap,
    Video,
    Compass,
    Layers,
    type LucideIcon,
} from "lucide-react";

export interface PlatformTheme {
    icon: LucideIcon;
    gradient: string;
    borderHover: string;
    bgAccent: string;
    textAccent: string;
    badgeStyle: string;
    brandColor: string;
}

const PLATFORM_THEMES: Record<string, PlatformTheme> = {
    netflix: {
        icon: Tv,
        gradient: "from-red-600/20 via-neutral-900/40 to-black/40",
        borderHover: "hover:border-red-500/50 hover:shadow-red-500/15",
        bgAccent: "bg-red-500/10 text-red-400 border-red-500/30",
        textAccent: "text-red-400",
        badgeStyle: "bg-red-500/15 text-red-300 border-red-500/30",
        brandColor: "#E50914",
    },
    prime: {
        icon: Play,
        gradient: "from-sky-500/20 via-blue-900/30 to-neutral-950/40",
        borderHover: "hover:border-sky-500/50 hover:shadow-sky-500/15",
        bgAccent: "bg-sky-500/10 text-sky-400 border-sky-500/30",
        textAccent: "text-sky-400",
        badgeStyle: "bg-sky-500/15 text-sky-300 border-sky-500/30",
        brandColor: "#00A8E1",
    },
    disney: {
        icon: Sparkles,
        gradient: "from-indigo-600/25 via-blue-900/30 to-purple-950/40",
        borderHover: "hover:border-indigo-400/50 hover:shadow-indigo-400/15",
        bgAccent: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        textAccent: "text-indigo-400",
        badgeStyle: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        brandColor: "#113CCF",
    },
    hbo: {
        icon: Layers,
        gradient: "from-purple-600/25 via-violet-950/30 to-neutral-950/40",
        borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/15",
        bgAccent: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        textAccent: "text-purple-400",
        badgeStyle: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        brandColor: "#741D82",
    },
    max: {
        icon: Layers,
        gradient: "from-blue-600/25 via-indigo-950/30 to-neutral-950/40",
        borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/15",
        bgAccent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        textAccent: "text-blue-400",
        badgeStyle: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        brandColor: "#002BE7",
    },
    apple: {
        icon: MonitorPlay,
        gradient: "from-zinc-500/20 via-neutral-800/30 to-zinc-950/40",
        borderHover: "hover:border-zinc-400/50 hover:shadow-zinc-400/15",
        bgAccent: "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
        textAccent: "text-zinc-200",
        badgeStyle: "bg-zinc-500/15 text-zinc-200 border-zinc-500/30",
        brandColor: "#FFFFFF",
    },
    hulu: {
        icon: Radio,
        gradient: "from-emerald-600/20 via-green-950/30 to-neutral-950/40",
        borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/15",
        bgAccent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        textAccent: "text-emerald-400",
        badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        brandColor: "#1CE783",
    },
    paramount: {
        icon: Compass,
        gradient: "from-cyan-600/25 via-blue-950/30 to-neutral-950/40",
        borderHover: "hover:border-cyan-500/50 hover:shadow-cyan-500/15",
        bgAccent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        textAccent: "text-cyan-400",
        badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
        brandColor: "#0064FF",
    },
    peacock: {
        icon: Flame,
        gradient: "from-amber-500/20 via-teal-900/20 to-emerald-950/30",
        borderHover: "hover:border-amber-400/50 hover:shadow-amber-400/15",
        bgAccent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        textAccent: "text-amber-400",
        badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        brandColor: "#FFAE00",
    },
    crunchyroll: {
        icon: Zap,
        gradient: "from-orange-600/25 via-amber-950/30 to-neutral-950/40",
        borderHover: "hover:border-orange-500/50 hover:shadow-orange-500/15",
        bgAccent: "bg-orange-500/10 text-orange-400 border-orange-500/30",
        textAccent: "text-orange-400",
        badgeStyle: "bg-orange-500/15 text-orange-300 border-orange-500/30",
        brandColor: "#F47521",
    },
    youtube: {
        icon: Video,
        gradient: "from-red-600/25 via-rose-950/30 to-neutral-950/40",
        borderHover: "hover:border-red-500/50 hover:shadow-red-500/15",
        bgAccent: "bg-red-500/10 text-red-400 border-red-500/30",
        textAccent: "text-red-400",
        badgeStyle: "bg-red-500/15 text-red-300 border-red-500/30",
        brandColor: "#FF0000",
    },
    mubi: {
        icon: Film,
        gradient: "from-blue-700/25 via-slate-900/30 to-neutral-950/40",
        borderHover: "hover:border-blue-400/50 hover:shadow-blue-400/15",
        bgAccent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        textAccent: "text-blue-400",
        badgeStyle: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        brandColor: "#002060",
    },
};

const DEFAULT_PLATFORM_THEME: PlatformTheme = {
    icon: MonitorPlay,
    gradient: "from-primary/15 via-muted/10 to-card/20",
    borderHover: "hover:border-primary/50 hover:shadow-primary/10",
    bgAccent: "bg-primary/10 text-primary border-primary/30",
    textAccent: "text-primary",
    badgeStyle: "bg-primary/15 text-primary border-primary/30",
    brandColor: "currentColor",
};

export function getPlatformTheme(name?: string): PlatformTheme {
    if (!name) return DEFAULT_PLATFORM_THEME;
    const clean = name.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

    for (const key in PLATFORM_THEMES) {
        if (clean.includes(key)) {
            return PLATFORM_THEMES[key];
        }
    }

    return DEFAULT_PLATFORM_THEME;
}

export const POPULAR_PLATFORMS = [
    "Netflix",
    "Prime Video",
    "Disney+",
    "Apple TV+",
    "HBO Max",
    "Hulu",
    "Paramount+",
    "Peacock",
    "Crunchyroll",
    "YouTube",
    "MUBI",
];
