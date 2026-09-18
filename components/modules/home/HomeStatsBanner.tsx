"use client";

import { Film, Star, MessageSquare, Tv, ShieldCheck, Award } from "lucide-react";

interface HomeStatsBannerProps {
    movieCount?: number;
}

export function HomeStatsBanner({ movieCount = 50 }: HomeStatsBannerProps) {
    const stats = [
        {
            icon: Film,
            label: "Curated Cinema",
            value: movieCount > 0 ? `${movieCount}+ Titles` : "50+ Titles",
            subtext: "Handpicked masterpieces",
            color: "text-red-500",
        },
        {
            icon: Star,
            label: "Audience Index",
            value: "4.8 / 5.0",
            subtext: "Verified user ratings",
            color: "text-amber-500",
        },
        {
            icon: MessageSquare,
            label: "Community Reviews",
            value: "15,000+",
            subtext: "In-depth film essays",
            color: "text-cyan-500",
        },
        {
            icon: Tv,
            label: "Streaming Hub",
            value: "6 Major Platforms",
            subtext: "Netflix, Prime, Max & more",
            color: "text-purple-500",
        },
    ];

    return (
        <section className="border-y border-border bg-card/60 backdrop-blur-md">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-center gap-4 group"
                            >
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted/80 border border-border transition-transform group-hover:scale-110`}>
                                    <Icon className={`h-6 w-6 ${item.color}`} />
                                </div>
                                <div>
                                    <div className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                                        {item.value}
                                    </div>
                                    <div className="text-xs font-semibold text-muted-foreground">
                                        {item.label}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground/70 hidden sm:block">
                                        {item.subtext}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
