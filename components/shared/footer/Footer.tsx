"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Film,
    Heart,
    Mail,
    Send,
    CheckCircle2,
    Shield,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
            toast.error("Please provide a valid email address");
            return;
        }
        setIsSubscribed(true);
        toast.success("Thank you for subscribing to FilmRank Weekly!");
        setNewsletterEmail("");
    };

    return (
        <footer className="border-t border-border bg-card/80 text-card-foreground">
            {/* Newsletter Bar */}
            <div className="border-b border-border bg-muted/30">
                <div className="container mx-auto px-4 py-8 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-500">
                            <Sparkles className="h-4 w-4" />
                            <span>Stay in the Cinematic Loop</span>
                        </div>
                        <h4 className="text-lg font-black text-foreground">
                            Subscribe to the FilmRank Weekly Dispatch
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-md">
                            Get curated movie recommendations, upcoming trailer drops, and editor's picks delivered to your inbox every Friday.
                        </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
                        <div className="relative w-full sm:w-72">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="email"
                                placeholder="Enter your email address..."
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                className="pl-9 h-10 text-xs rounded-xl bg-background border-border"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold h-10 px-4 rounded-xl shrink-0"
                        >
                            {isSubscribed ? (
                                <CheckCircle2 className="h-4 w-4" />
                            ) : (
                                <>
                                    <Send className="h-3.5 w-3.5 mr-1.5" />
                                    Subscribe
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Main Links Area */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-lg shadow-red-600/30">
                                <Film className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-black tracking-tight text-foreground">
                                    FILM<span className="text-red-600">RANK</span>
                                </span>
                                <span className="text-[9px] uppercase tracking-[3px] text-muted-foreground font-semibold">
                                    Cinema Hub
                                </span>
                            </div>
                        </Link>

                        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                            FilmRank is the premier social platform for cinema lovers. Discover movies, track what you watch, read authentic critic reviews, and rank your all-time favorites.
                        </p>

                        <div className="pt-2 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                Catalog Live & Operational
                            </span>
                            <span>•</span>
                            <span>Powered by TMDB API</span>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                            Cinema Catalog
                        </h4>
                        <ul className="space-y-2.5 text-xs text-muted-foreground">
                            <li>
                                <Link href="/movies" className="hover:text-foreground transition">
                                    Browse All Movies
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="hover:text-foreground transition">
                                    Top 100 Highest Rated
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="hover:text-foreground transition">
                                    New & Upcoming Releases
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="hover:text-foreground transition">
                                    Free to Watch Collection
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="hover:text-foreground transition">
                                    Official Trailers Library
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                            Popular Genres
                        </h4>
                        <ul className="space-y-2.5 text-xs text-muted-foreground">
                            <li>
                                <Link href="/movies?genre=Sci-Fi" className="hover:text-foreground transition">
                                    Sci-Fi & Cyberpunk
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies?genre=Action" className="hover:text-foreground transition">
                                    Action & Adventure
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies?genre=Thriller" className="hover:text-foreground transition">
                                    Psychological Thrillers
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies?genre=Crime" className="hover:text-foreground transition">
                                    Crime & Mob Dramas
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies?genre=Animation" className="hover:text-foreground transition">
                                    Animated Masterpieces
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                            Community & Legal
                        </h4>
                        <ul className="space-y-2.5 text-xs text-muted-foreground">
                            <li>
                                <Link href="/login" className="hover:text-foreground transition">
                                    Sign In / Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/dashboard" className="hover:text-foreground transition">
                                    Admin Dashboard
                                </Link>
                            </li>
                            <li>
                                <span className="hover:text-foreground transition cursor-pointer">
                                    Reviewing Guidelines
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-foreground transition cursor-pointer">
                                    Privacy Policy
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-foreground transition cursor-pointer">
                                    Terms of Service
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} FilmRank Cinema Hub. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500 inline" /> for cinephiles
                        </span>
                        <span>•</span>
                        <Link href="/movies" className="hover:text-foreground transition">
                            Directory
                        </Link>
                        <span>•</span>
                        <Link href="/login" className="hover:text-foreground transition">
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
