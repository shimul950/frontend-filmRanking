import {
    Award,
    Bookmark,
    Eye,
    Flame,
    Heart,
    Popcorn,
    Sparkles,
    Star,
    Trophy,
    Zap,
    type LucideIcon,
} from "lucide-react";

export interface TagTheme {
    icon: LucideIcon;
    gradient: string;
    borderHover: string;
    bgAccent: string;
    textAccent: string;
    badgeStyle: string;
}

const TAG_THEMES: Record<string, TagTheme> = {
    oscar: {
        icon: Trophy,
        gradient: "from-amber-500/25 via-yellow-950/20 to-neutral-950/40",
        borderHover: "hover:border-amber-400/50 hover:shadow-amber-400/15",
        bgAccent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        textAccent: "text-amber-400",
        badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    award: {
        icon: Award,
        gradient: "from-amber-500/25 via-yellow-950/20 to-neutral-950/40",
        borderHover: "hover:border-amber-400/50 hover:shadow-amber-400/15",
        bgAccent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        textAccent: "text-amber-400",
        badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    classic: {
        icon: Star,
        gradient: "from-purple-500/25 via-indigo-950/20 to-neutral-950/40",
        borderHover: "hover:border-purple-400/50 hover:shadow-purple-400/15",
        bgAccent: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        textAccent: "text-purple-400",
        badgeStyle: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    },
    mind: {
        icon: Zap,
        gradient: "from-cyan-500/25 via-blue-950/20 to-neutral-950/40",
        borderHover: "hover:border-cyan-400/50 hover:shadow-cyan-400/15",
        bgAccent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        textAccent: "text-cyan-400",
        badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    },
    twist: {
        icon: Eye,
        gradient: "from-violet-500/25 via-fuchsia-950/20 to-neutral-950/40",
        borderHover: "hover:border-violet-400/50 hover:shadow-violet-400/15",
        bgAccent: "bg-violet-500/10 text-violet-400 border-violet-500/30",
        textAccent: "text-violet-400",
        badgeStyle: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    },
    dark: {
        icon: Flame,
        gradient: "from-red-600/25 via-zinc-900/30 to-black/40",
        borderHover: "hover:border-red-500/50 hover:shadow-red-500/15",
        bgAccent: "bg-red-500/10 text-red-400 border-red-500/30",
        textAccent: "text-red-400",
        badgeStyle: "bg-red-500/15 text-red-300 border-red-500/30",
    },
    heart: {
        icon: Heart,
        gradient: "from-rose-500/25 via-pink-950/20 to-neutral-950/40",
        borderHover: "hover:border-rose-400/50 hover:shadow-rose-400/15",
        bgAccent: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        textAccent: "text-rose-400",
        badgeStyle: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    },
    popcorn: {
        icon: Popcorn,
        gradient: "from-yellow-500/25 via-amber-950/20 to-neutral-950/40",
        borderHover: "hover:border-yellow-400/50 hover:shadow-yellow-400/15",
        bgAccent: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        textAccent: "text-yellow-400",
        badgeStyle: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    },
    masterpiece: {
        icon: Sparkles,
        gradient: "from-emerald-500/25 via-teal-950/20 to-neutral-950/40",
        borderHover: "hover:border-emerald-400/50 hover:shadow-emerald-400/15",
        bgAccent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        textAccent: "text-emerald-400",
        badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
};

const DEFAULT_TAG_THEME: TagTheme = {
    icon: Bookmark,
    gradient: "from-primary/15 via-muted/10 to-card/20",
    borderHover: "hover:border-primary/50 hover:shadow-primary/10",
    bgAccent: "bg-primary/10 text-primary border-primary/30",
    textAccent: "text-primary",
    badgeStyle: "bg-primary/15 text-primary border-primary/30",
};

export function getTagTheme(name?: string): TagTheme {
    if (!name) return DEFAULT_TAG_THEME;
    const clean = name.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

    for (const key in TAG_THEMES) {
        if (clean.includes(key)) {
            return TAG_THEMES[key];
        }
    }

    return DEFAULT_TAG_THEME;
}

export const POPULAR_TAGS = [
    "Oscar Winner",
    "Cult Classic",
    "Mind Bending",
    "Plot Twist",
    "Feel Good",
    "Dark & Gritty",
    "Cinematic Masterpiece",
    "Based on True Story",
    "Critically Acclaimed",
    "Hidden Gem",
    "Binge Worthy",
    "Popcorn Flick",
];
