"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IWatchlistItem, IWishlistToggleResult } from "@/src/types/movie.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Fetch the authenticated user's wishlist
 */
export async function getWishlistAction(): Promise<IWatchlistItem[]> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return [];
    }

    try {
        const response = await httpClient.get<{ data: IWatchlistItem[] } | IWatchlistItem[]>(
            "/watchlist",
            {
                headers: { Cookie: cookieHeader },
            }
        );

        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (Array.isArray(response.data)) return response.data;
        const nested = (response as unknown as { data: { data: IWatchlistItem[] } })?.data;
        if (Array.isArray(nested?.data)) return nested.data;
        return [];
    } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        return [];
    }
}

/**
 * Toggle a movie in or out of the user's wishlist
 */
export async function toggleWishlistAction(
    mediaId: string
): Promise<{ success: true; data: IWishlistToggleResult } | ApiErrorResponse> {
    if (!mediaId) {
        return { success: false, messsage: "Media ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to manage your wishlist" };
    }

    try {
        const response = await httpClient.post<IWishlistToggleResult>(
            "/watchlist/toggle",
            { mediaId },
            {
                headers: { Cookie: cookieHeader },
            }
        );

        revalidatePath("/wishlist");
        revalidatePath("/movies");
        revalidatePath(`/movies/${mediaId}`);
        revalidatePath("/");

        const payload = (response as unknown as { data?: IWishlistToggleResult })?.data || (response as unknown as IWishlistToggleResult);

        return {
            success: true,
            data: payload,
        };
    } catch (error: unknown) {
        let message = "Failed to update wishlist";
        if (axios.isAxiosError(error)) {
            message = error.response?.data?.message || error.message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        return {
            success: false,
            messsage: message,
        };
    }
}
