"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { IMovie } from "@/src/types/movie.types";
import { MovieTrailerModal } from "@/components/modules/dashboard/movie/MovieTrailerModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    Star,
    ChevronLeft,
    ChevronRight,
    Clapperboard,
    Sparkles,
    Calendar,
    Clock,
    Flame,
} from "lucide-react";

export interface IBannerSlide {
    id: string;
    title: string;
    synopsis: string;
    backdropUrl: string;
    posterUrl: string;
    rating: number;
    releaseYear: number;
    duration: number;
    genre: string;
    pricing: "FREE" | "PREMIUM";
    youtubeLink: string;
    director: string;
}

const DEFAULT_BANNER_SLIDES: IBannerSlide[] = [
    {
        id: "banner-1",
        title: "Dune: Part Two",
        synopsis:
            "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
        backdropUrl: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
        posterUrl: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
        rating: 4.9,
        releaseYear: 2024,
        duration: 166,
        genre: "Sci-Fi / Adventure",
        pricing: "PREMIUM",
        youtubeLink: "https://www.youtube.com/watch?v=Way9Dexny3w",
        director: "Denis Villeneuve",
    },
    {
        id: "banner-2",
        title: "Oppenheimer",
        synopsis:
            "The gripping story of American scientist J. Robert Oppenheimer and his profound role in the development of the atomic bomb during World War II, exploring the moral and geopolitical aftermath of Trinity.",
        backdropUrl: "https://image.tmdb.org/t/p/original/nb3xI8XI3w4pMVZ38VijbsyBqP4.jpg",
        posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        rating: 4.8,
        releaseYear: 2023,
        duration: 180,
        genre: "Biography / Drama",
        pricing: "PREMIUM",
        youtubeLink: "https://www.youtube.com/watch?v=uYPbbksJxIg",
        director: "Christopher Nolan",
    },
    {
        id: "banner-3",
        title: "Interstellar",
        synopsis:
            "A team of explorers undertake the most important mission in human history; traveling beyond this galaxy to discover whether mankind has a future among the stars in a stunning cosmic odyssey.",
        backdropUrl: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
        posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        rating: 4.9,
        releaseYear: 2014,
        duration: 169,
        genre: "Sci-Fi / Adventure",
        pricing: "FREE",
        youtubeLink: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        director: "Christopher Nolan",
    },
    {
        id: "banner-4",
        title: "The Dark Knight",
        synopsis:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        backdropUrl: "https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
        posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        rating: 5.0,
        releaseYear: 2008,
        duration: 152,
        genre: "Action / Crime",
        pricing: "FREE",
        youtubeLink: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
        director: "Christopher Nolan",
    },
    {
        id: "banner-5",
        title: "Spider-Man: Across the Spider-Verse",
        synopsis:
            "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. A visual masterpiece of contemporary animation.",
        backdropUrl: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
        posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
        rating: 4.8,
        releaseYear: 2023,
        duration: 140,
        genre: "Animation / Action",
        pricing: "PREMIUM",
        youtubeLink: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
        director: "Joaquim Dos Santos",
    },
];

interface HomeHeroBannerProps {
    databaseMovies?: IMovie[];
}

export function HomeHeroBanner({ databaseMovies = [] }: HomeHeroBannerProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [activeTrailer, setActiveTrailer] = useState<{ title: string; url: string } | null>(null);

    // Merge database movies if any have trailers & posters, or use curated cinematic slides
    const slides: IBannerSlide[] = DEFAULT_BANNER_SLIDES;

    const currentSlide = slides[currentIdx];

    const nextSlide = useCallback(() => {
        setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentIdx((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Auto-advance timer every 6 seconds unless user is hovering
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(nextSlide, 6000);
        return () => clearInterval(interval);
    }, [isPaused, nextSlide]);

    return (
        <div
            className="relative w-full h-[600px] sm:h-[680px] lg:h-[750px] overflow-hidden select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Backdrop Images with Crossfade */}
            {slides.map((slide, idx) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === currentIdx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                    }`}
                >
                    <Image
                        src={slide.backdropUrl}
                        alt={slide.title}
                        fill
                        priority={idx === 0}
                        className="object-cover object-top filter brightness-[0.75]"
                    />
                </div>
            ))}

            {/* Cinema Vignette Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent lg:w-3/4" />

            {/* Slide Content */}
            <div className="relative container mx-auto h-full max-w-7xl px-4 sm:px-6 flex flex-col justify-end pb-16 lg:pb-20">
                <div className="max-w-2xl space-y-4">
                    {/* Badge Row */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-red-600/30">
                            <Flame className="h-3 w-3 fill-current" />
                            <span>Spotlight Feature</span>
                        </div>

                        <Badge
                            variant="outline"
                            className="bg-black/60 border-amber-500/40 text-amber-300 font-bold text-xs px-2.5 py-0.5 backdrop-blur-md"
                        >
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                            {currentSlide.rating} / 5.0
                        </Badge>

                        <Badge
                            variant="outline"
                            className={
                                currentSlide.pricing === "PREMIUM"
                                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300 text-[11px] backdrop-blur-md"
                                    : "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 text-[11px] backdrop-blur-md"
                            }
                        >
                            {currentSlide.pricing}
                        </Badge>

                        <span className="text-xs text-zinc-300 font-medium hidden sm:inline-flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-red-500" />
                            {currentSlide.releaseYear}
                        </span>

                        <span className="text-xs text-zinc-300 font-medium hidden sm:inline-flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-cyan-400" />
                            {Math.floor(currentSlide.duration / 60)}h {currentSlide.duration % 60}m
                        </span>
                    </div>

                    {/* Movie Title */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md leading-[1.08]">
                        {currentSlide.title}
                    </h1>

                    {/* Metadata & Director */}
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium">
                        <span className="text-red-400 font-semibold">{currentSlide.genre}</span>
                        <span>•</span>
                        <span>Directed by {currentSlide.director}</span>
                    </div>

                    {/* Synopsis */}
                    <p className="text-xs sm:text-sm text-zinc-200/90 line-clamp-3 leading-relaxed max-w-xl drop-shadow">
                        {currentSlide.synopsis}
                    </p>

                    {/* Interactive Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button
                            size="lg"
                            onClick={() =>
                                setActiveTrailer({
                                    title: currentSlide.title,
                                    url: currentSlide.youtubeLink,
                                })
                            }
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm h-11 px-5 rounded-xl shadow-xl shadow-red-600/40 transition-transform hover:scale-105"
                        >
                            <Play className="h-4 w-4 fill-current mr-2" />
                            Watch Official Trailer
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/20 bg-black/40 hover:bg-white/10 text-white text-sm h-11 px-5 rounded-xl backdrop-blur-md"
                        >
                            <Link href="/movies">
                                <Clapperboard className="h-4 w-4 mr-2" />
                                Explore Catalog
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Bottom Navigation Strip / Slide Thumbnails */}
                <div className="mt-8 flex items-center justify-between gap-4">
                    {/* Thumbnail cards for each slide */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                        {slides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                onClick={() => setCurrentIdx(idx)}
                                className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left transition-all duration-300 backdrop-blur-md ${
                                    idx === currentIdx
                                        ? "bg-white/20 border-red-500 shadow-lg scale-105"
                                        : "bg-black/40 border-white/10 opacity-70 hover:opacity-100 hover:bg-black/60"
                                }`}
                            >
                                <div className="relative h-8 w-6 rounded overflow-hidden bg-zinc-800 shrink-0">
                                    <Image
                                        src={slide.posterUrl}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        sizes="24px"
                                    />
                                </div>
                                <div className="hidden sm:block text-left pr-1">
                                    <div className="text-[11px] font-bold text-white leading-tight truncate max-w-[100px]">
                                        {slide.title}
                                    </div>
                                    <div className="text-[9px] text-zinc-300">{slide.releaseYear}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Prev / Next Arrows */}
                    <div className="hidden sm:flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevSlide}
                            className="h-10 w-10 rounded-full border-white/20 bg-black/50 hover:bg-black/80 text-white backdrop-blur-md"
                            aria-label="Previous banner"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextSlide}
                            className="h-10 w-10 rounded-full border-white/20 bg-black/50 hover:bg-black/80 text-white backdrop-blur-md"
                            aria-label="Next banner"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            <MovieTrailerModal
                isOpen={!!activeTrailer}
                onClose={() => setActiveTrailer(null)}
                title={activeTrailer?.title || ""}
                trailerUrl={activeTrailer?.url}
            />
        </div>
    );
}
