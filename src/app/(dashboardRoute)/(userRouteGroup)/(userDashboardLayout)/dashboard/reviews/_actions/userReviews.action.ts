"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IReview } from "@/src/types/movie.types";
import { getMeAction } from "@/src/app/(commonRoute)/(auth)/_actions/getme.action";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface IUpdateUserReviewPayload {
    rating?: number;
    content?: string;
    spoiler?: boolean;
    tagIds?: string[];
}

/**
 * Fetch all reviews written by the currently authenticated user
 */
export async function getUserReviewsAction(): Promise<IReview[]> {
    const user = await getMeAction();
    if (!user) return [];

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    try {
        const response = await httpClient.get<{ data: IReview[] } | IReview[]>("/review", {
            params: {
                userId: user.id,
                include: "user,media,tags",
                limit: 100,
            },
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        });

        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (Array.isArray(response.data)) return response.data;
        const nested = (response.data as unknown as { data?: IReview[] })?.data;
        if (Array.isArray(nested)) return nested;
        return [];
    } catch (error) {
        console.error("Failed to fetch user reviews:", error);
        return [];
    }
}

/**
 * Update an existing review authored by the user
 */
export async function updateUserReviewAction(
    reviewId: string,
    payload: IUpdateUserReviewPayload
): Promise<{ success: true; data: IReview } | ApiErrorResponse> {
    if (!reviewId) {
        return { success: false, messsage: "Review ID is required" };
    }

    if (payload.content !== undefined && payload.content.trim().length < 5) {
        return { success: false, messsage: "Review must be at least 5 characters long" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to update your review" };
    }

    try {
        const response = await httpClient.patch<IReview>(
            `/review/${reviewId}`,
            payload,
            { headers: { Cookie: cookieHeader } }
        );

        revalidatePath("/dashboard/reviews");
        revalidatePath("/dashboard");
        revalidatePath("/movies");

        const updatedData = ((response.data as unknown as { data?: IReview })?.data || response.data) as IReview;
        return { success: true, data: updatedData };
    } catch (error: unknown) {
        let message = "Failed to update review";
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

/**
 * Delete a review authored by the user
 */
export async function deleteUserReviewAction(
    reviewId: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    if (!reviewId) {
        return { success: false, messsage: "Review ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to delete your review" };
    }

    try {
        await httpClient.delete(`/review/${reviewId}`, {
            headers: { Cookie: cookieHeader },
        });

        revalidatePath("/dashboard/reviews");
        revalidatePath("/dashboard");
        revalidatePath("/movies");

        return { success: true, message: "Review deleted successfully" };
    } catch (error: unknown) {
        let message = "Failed to delete review";
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
