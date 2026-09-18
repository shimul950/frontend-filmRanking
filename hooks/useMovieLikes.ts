"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

const LIKES_STORAGE_KEY_PREFIX = "filmrank_movie_likes_";

export function useMovieLikes() {
    const { user, isAuthenticated } = useAuth();
    const storageKey = `${LIKES_STORAGE_KEY_PREFIX}${user?.id || "guest"}`;

    const [likedMovieIds, setLikedMovieIds] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);

    // Load from local storage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setLikedMovieIds(new Set(parsed));
                }
            } else {
                setLikedMovieIds(new Set());
            }
        } catch {
            setLikedMovieIds(new Set());
        }
        setMounted(true);
    }, [storageKey]);

    // Save to local storage
    const persistLikes = useCallback(
        (newSet: Set<string>) => {
            setLikedMovieIds(newSet);
            try {
                localStorage.setItem(storageKey, JSON.stringify(Array.from(newSet)));
            } catch (e) {
                console.error("Failed to persist liked movies", e);
            }
        },
        [storageKey]
    );

    const isLiked = useCallback(
        (movieId: string): boolean => {
            if (!mounted || !movieId) return false;
            return likedMovieIds.has(movieId);
        },
        [mounted, likedMovieIds]
    );

    const toggleLike = useCallback(
        (movieId: string, movieTitle?: string) => {
            if (!isAuthenticated) {
                toast.error("Please sign in to like movies", {
                    action: {
                        label: "Login",
                        onClick: () => {
                            window.location.href = "/login";
                        },
                    },
                });
                return;
            }

            const newSet = new Set(likedMovieIds);
            const currentlyLiked = newSet.has(movieId);

            if (currentlyLiked) {
                newSet.delete(movieId);
                persistLikes(newSet);
                toast.info(`Unliked ${movieTitle ? `"${movieTitle}"` : "movie"}`);
            } else {
                newSet.add(movieId);
                persistLikes(newSet);
                toast.success(`Liked ${movieTitle ? `"${movieTitle}"` : "movie"}! ❤️`);
            }
        },
        [isAuthenticated, likedMovieIds, persistLikes]
    );

    return {
        isLiked,
        toggleLike,
        likedCount: likedMovieIds.size,
    };
}
