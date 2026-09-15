import {
    Film,
    Flame,
    Ghost,
    Heart,
    Rocket,
    Smile,
    Swords,
    Sparkles,
    Clapperboard,
    Compass,
    Eye,
    Music,
    ShieldAlert,
    Tv,
    BookOpen,
    Zap,
    type LucideIcon,
} from "lucide-react";

interface GenreTheme {
    icon: LucideIcon;
    gradient: string;
    borderHover: string;
    bgAccent: string;
    textAccent: string;
}

const GENRE_THEMES: Record<string, GenreTheme> = {
    action: {
        icon: Swords,
        gradient: "from-amber-500/20 via-orange-500/10 to-red-500/20",
        borderHover: "hover:border-orange-500/50 hover:shadow-orange-500/10",
        bgAccent: "bg-orange-500/10 text-orange-400 border-orange-500/30",
        textAccent: "text-orange-400",
    },
    adventure: {
        icon: Compass,
        gradient: "from-emerald-500/20 via-teal-500/10 to-cyan-500/20",
        borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
        bgAccent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        textAccent: "text-emerald-400",
    },
    animation: {
        icon: Sparkles,
        gradient: "from-fuchsia-500/20 via-pink-500/10 to-purple-500/20",
        borderHover: "hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/10",
        bgAccent: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30",
        textAccent: "text-fuchsia-400",
    },
    comedy: {
        icon: Smile,
        gradient: "from-yellow-500/20 via-amber-500/10 to-orange-500/20",
        borderHover: "hover:border-yellow-500/50 hover:shadow-yellow-500/10",
        bgAccent: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        textAccent: "text-yellow-400",
    },
    crime: {
        icon: ShieldAlert,
        gradient: "from-zinc-500/20 via-neutral-500/10 to-stone-500/20",
        borderHover: "hover:border-zinc-500/50 hover:shadow-zinc-500/10",
        bgAccent: "bg-zinc-500/10 text-zinc-300 border-zinc-500/30",
        textAccent: "text-zinc-300",
    },
    documentary: {
        icon: BookOpen,
        gradient: "from-blue-500/20 via-sky-500/10 to-indigo-500/20",
        borderHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
        bgAccent: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        textAccent: "text-blue-400",
    },
    drama: {
        icon: Clapperboard,
        gradient: "from-violet-500/20 via-purple-500/10 to-pink-500/20",
        borderHover: "hover:border-violet-500/50 hover:shadow-violet-500/10",
        bgAccent: "bg-violet-500/10 text-violet-400 border-violet-500/30",
        textAccent: "text-violet-400",
    },
    fantasy: {
        icon: Sparkles,
        gradient: "from-purple-500/20 via-indigo-500/10 to-violet-500/20",
        borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
        bgAccent: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        textAccent: "text-purple-400",
    },
    horror: {
        icon: Ghost,
        gradient: "from-red-600/20 via-rose-600/10 to-crimson-600/20",
        borderHover: "hover:border-red-600/50 hover:shadow-red-600/10",
        bgAccent: "bg-red-500/10 text-red-400 border-red-500/30",
        textAccent: "text-red-400",
    },
    mystery: {
        icon: Eye,
        gradient: "from-indigo-500/20 via-blue-500/10 to-cyan-500/20",
        borderHover: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
        bgAccent: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        textAccent: "text-indigo-400",
    },
    musical: {
        icon: Music,
        gradient: "from-pink-500/20 via-rose-500/10 to-fuchsia-500/20",
        borderHover: "hover:border-pink-500/50 hover:shadow-pink-500/10",
        bgAccent: "bg-pink-500/10 text-pink-400 border-pink-500/30",
        textAccent: "text-pink-400",
    },
    romance: {
        icon: Heart,
        gradient: "from-rose-500/20 via-pink-500/10 to-red-500/20",
        borderHover: "hover:border-rose-500/50 hover:shadow-rose-500/10",
        bgAccent: "bg-rose-500/10 text-rose-400 border-rose-500/30",
        textAccent: "text-rose-400",
    },
    "sci-fi": {
        icon: Rocket,
        gradient: "from-cyan-500/20 via-teal-500/10 to-blue-500/20",
        borderHover: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
        bgAccent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        textAccent: "text-cyan-400",
    },
    scifi: {
        icon: Rocket,
        gradient: "from-cyan-500/20 via-teal-500/10 to-blue-500/20",
        borderHover: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
        bgAccent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        textAccent: "text-cyan-400",
    },
    thriller: {
        icon: Flame,
        gradient: "from-amber-600/20 via-red-500/10 to-rose-600/20",
        borderHover: "hover:border-amber-600/50 hover:shadow-amber-600/10",
        bgAccent: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        textAccent: "text-amber-400",
    },
    war: {
        icon: Zap,
        gradient: "from-stone-600/20 via-zinc-600/10 to-amber-700/20",
        borderHover: "hover:border-stone-500/50 hover:shadow-stone-500/10",
        bgAccent: "bg-stone-500/10 text-stone-300 border-stone-500/30",
        textAccent: "text-stone-300",
    },
};

const DEFAULT_THEME: GenreTheme = {
    icon: Film,
    gradient: "from-red-500/15 via-zinc-800/10 to-red-950/20",
    borderHover: "hover:border-red-500/50 hover:shadow-red-500/10",
    bgAccent: "bg-red-500/10 text-red-400 border-red-500/30",
    textAccent: "text-red-400",
};

export function getGenreTheme(name?: string): GenreTheme {
    if (!name) return DEFAULT_THEME;
    const clean = name.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
    for (const key in GENRE_THEMES) {
        if (clean.includes(key)) {
            return GENRE_THEMES[key];
        }
    }
    return DEFAULT_THEME;
}
