"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "./useAuth";
import {
    getWishlistAction,
    toggleWishlistAction,
} from "@/src/app/(dashboardRoute)/(commonProtectedLayout)/wishlist/_actions/wishlist.action";
import { IMovie, IWatchlistItem } from "@/src/types/movie.types";

export function useWishlist() {
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    // Query for user's wishlist
    const {
        data: wishlist = [],
        isLoading,
        refetch,
    } = useQuery<IWatchlistItem[]>({
        queryKey: ["wishlist", user?.id],
        queryFn: async () => {
            if (!isAuthenticated) return [];
            return await getWishlistAction();
        },
        enabled: !!isAuthenticated,
        staleTime: 60 * 1000,
    });

    // Fast O(1) membership check
    const isWishlisted = (movieId: string): boolean => {
        if (!movieId || !wishlist) return false;
        return wishlist.some((item) => item.mediaId === movieId || item.media?.id === movieId);
    };

    // Toggle wishlist mutation with optimistic updates
    const toggleMutation = useMutation({
        mutationFn: async ({ movie }: { movie: IMovie }) => {
            const res = await toggleWishlistAction(movie.id);
            if (!res.success) {
                throw new Error(res.messsage || "Failed to update wishlist");
            }
            return res.data;
        },
        onMutate: async ({ movie }) => {
            await queryClient.cancelQueries({ queryKey: ["wishlist", user?.id] });
            const previousWishlist = queryClient.getQueryData<IWatchlistItem[]>(["wishlist", user?.id]) || [];

            const exists = previousWishlist.some(
                (item) => item.mediaId === movie.id || item.media?.id === movie.id
            );

            if (exists) {
                // Optimistically remove
                queryClient.setQueryData<IWatchlistItem[]>(
                    ["wishlist", user?.id],
                    previousWishlist.filter(
                        (item) => item.mediaId !== movie.id && item.media?.id !== movie.id
                    )
                );
            } else {
                // Optimistically add
                const optimisticItem: IWatchlistItem = {
                    id: `temp-${Date.now()}`,
                    userId: user?.id || "",
                    mediaId: movie.id,
                    media: movie,
                    createdAt: new Date().toISOString(),
                };
                queryClient.setQueryData<IWatchlistItem[]>(
                    ["wishlist", user?.id],
                    [optimisticItem, ...previousWishlist]
                );
            }

            return { previousWishlist, exists };
        },
        onError: (err: unknown, _vars, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(["wishlist", user?.id], context.previousWishlist);
            }
            const msg = err instanceof Error ? err.message : "Error updating wishlist";
            toast.error(msg);
        },
        onSuccess: (result, vars, context) => {
            const added = result?.added ?? !context?.exists;
            if (added) {
                toast.success(`"${vars.movie.title}" added to your wishlist`);
            } else {
                toast.info(`"${vars.movie.title}" removed from your wishlist`);
            }
            queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] });
        },
    });

    const handleToggle = (movie: IMovie) => {
        if (!isAuthenticated) {
            toast.error("Please sign in to add movies to your wishlist", {
                action: {
                    label: "Login",
                    onClick: () => {
                        window.location.href = "/login";
                    },
                },
            });
            return;
        }

        toggleMutation.mutate({ movie });
    };

    return {
        wishlist,
        isLoading,
        isWishlisted,
        toggleWishlist: handleToggle,
        isToggling: toggleMutation.isPending,
        refetch,
    };
}
