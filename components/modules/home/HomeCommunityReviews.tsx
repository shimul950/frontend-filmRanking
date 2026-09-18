"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MessageSquare, Quote, ArrowRight, Film, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCommunityReviews() {
    const featuredReviews = [
        {
            author: "Elena Rostova",
            role: "Verified Critic",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
            movieTitle: "Dune: Part Two",
            rating: 5,
            comment:
                "Villeneuve has crafted an operatic triumph of sound and spectacle. The scale of the desert warfare combined with Zimmer's visceral score sets a new benchmark for modern science fiction.",
            date: "May 2026",
        },
        {
            author: "Marcus Vance",
            role: "Film Historian",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
            movieTitle: "Oppenheimer",
            rating: 5,
            comment:
                "Murphy's eyes carry the weight of an epoch. A relentless, three-hour chamber drama masquerading as an epic biographical thriller that refuses to let the viewer breathe.",
            date: "April 2026",
        },
        {
            author: "Sophia Chen",
            role: "Cinema Enthusiast",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
            movieTitle: "Spider-Man: Across the Spider-Verse",
            rating: 5,
            comment:
                "Every single frame is a museum-grade painting. The emotional core between Miles and Gwen grounds a multidimensional adventure of staggering visual audacity.",
            date: "April 2026",
        },
    ];

    return (
        <section className="container mx-auto px-4 py-12 max-w-7xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border pb-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-500 mb-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Critic & Audience Spotlight</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                        What Cinephiles Are Saying
                    </h2>
                </div>

                <Link
                    href="/movies"
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
                >
                    <span>Read More Reviews</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            {/* Review Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredReviews.map((rev, idx) => (
                    <div
                        key={idx}
                        className="relative flex flex-col justify-between p-6 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-md shadow-sm space-y-4 hover:border-red-500/30 transition-all duration-300"
                    >
                        <Quote className="h-8 w-8 text-muted-foreground/20 absolute top-4 right-4" />

                        <div className="space-y-3">
                            <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(rev.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-current" />
                                ))}
                            </div>

                            <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
                                "{rev.comment}"
                            </p>
                        </div>

                        <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative h-9 w-9 rounded-full overflow-hidden bg-muted">
                                    <Image
                                        src={rev.avatar}
                                        alt={rev.author}
                                        fill
                                        className="object-cover"
                                        sizes="36px"
                                    />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-foreground">{rev.author}</div>
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                        <span>{rev.role}</span>
                                    </div>
                                </div>
                            </div>

                            <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                                {rev.movieTitle}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Community Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-black p-8 sm:p-12">
                <div className="relative z-10 max-w-2xl space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-500 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                        <Film className="h-3.5 w-3.5" />
                        <span>Cinema Lovers Community</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        Rate, Review, and Build Your Cinematic Legacy.
                    </h3>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        Log films as you watch them, write insightful reviews, organize custom watchlists, and connect with fellow cinephiles around the globe.
                    </p>

                    <div className="pt-3 flex flex-wrap items-center gap-3">
                        <Button
                            asChild
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-lg shadow-red-600/30"
                        >
                            <Link href="/register">Create Free Account</Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/20 bg-black/40 text-white hover:bg-white/10 text-xs h-10 px-6 rounded-xl"
                        >
                            <Link href="/movies">Explore All Movies</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
