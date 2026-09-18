"use client";

import Link from "next/link";
import {
    Flame,
    Sparkles,
    Clapperboard,
    Compass,
    Ghost,
    Smile,
    Heart,
    Tv,
    Sword,
    ArrowRight,
} from "lucide-react";

export function HomeGenreExplorer() {
    const genres = [
        {
            name: "Sci-Fi",
            description: "Mind-bending cosmic journeys & futuristic realms",
            icon: Sparkles,
            gradient: "from-cyan-600/30 to-blue-900/30",
            accentColor: "text-cyan-400",
            badgeColor: "border-cyan-500/30 bg-cyan-500/10",
        },
        {
            name: "Action",
            description: "High-octane thrillers, epic battles & stunts",
            icon: Flame,
            gradient: "from-red-600/30 to-amber-900/30",
            accentColor: "text-red-400",
            badgeColor: "border-red-500/30 bg-red-500/10",
        },
        {
            name: "Drama",
            description: "Emotional storytelling & character studies",
            icon: Clapperboard,
            gradient: "from-amber-600/30 to-orange-900/30",
            accentColor: "text-amber-400",
            badgeColor: "border-amber-500/30 bg-amber-500/10",
        },
        {
            name: "Crime / Thriller",
            description: "Mystery, detective suspense & mob syndicates",
            icon: Compass,
            gradient: "from-purple-600/30 to-indigo-900/30",
            accentColor: "text-purple-400",
            badgeColor: "border-purple-500/30 bg-purple-500/10",
        },
        {
            name: "Horror",
            description: "Chilling psychological tales & dark supernatural",
            icon: Ghost,
            gradient: "from-emerald-600/30 to-teal-900/30",
            accentColor: "text-emerald-400",
            badgeColor: "border-emerald-500/30 bg-emerald-500/10",
        },
        {
            name: "Animation",
            description: "Animated marvels for dreamers of all ages",
            icon: Smile,
            gradient: "from-pink-600/30 to-rose-900/30",
            accentColor: "text-pink-400",
            badgeColor: "border-pink-500/30 bg-pink-500/10",
        },
        {
            name: "Romance",
            description: "Unforgettable love stories & heartwarming tales",
            icon: Heart,
            gradient: "from-rose-600/30 to-red-900/30",
            accentColor: "text-rose-400",
            badgeColor: "border-rose-500/30 bg-rose-500/10",
        },
        {
            name: "Adventure",
            description: "Epic quests, uncharted worlds & wild frontiers",
            icon: Sword,
            gradient: "from-blue-600/30 to-sky-900/30",
            accentColor: "text-blue-400",
            badgeColor: "border-blue-500/30 bg-blue-500/10",
        },
    ];

    return (
        <section className="container mx-auto px-4 py-12 max-w-7xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500 mb-1">
                        <Compass className="h-4 w-4" />
                        <span>Cinema Mood Explorer</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        Browse by Category
                    </h2>
                </div>

                <Link
                    href="/movies"
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
                >
                    <span>Browse All 18 Genres</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {genres.map((g) => {
                    const Icon = g.icon;
                    return (
                        <Link
                            key={g.name}
                            href={`/movies?genre=${encodeURIComponent(g.name)}`}
                            className={`group relative flex flex-col justify-between p-5 rounded-2xl border border-border/80 bg-gradient-to-br ${g.gradient} hover:border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${g.badgeColor}`}>
                                    <Icon className={`h-5 w-5 ${g.accentColor}`} />
                                </div>
                                <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                                    <span>Explore</span>
                                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>

                            <div>
                                <h3 className="text-base font-bold text-foreground tracking-tight group-hover:text-red-500 transition-colors">
                                    {g.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {g.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
