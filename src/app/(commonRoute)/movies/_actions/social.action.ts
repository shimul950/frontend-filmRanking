"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IComment, ILikeResult, IReview } from "@/src/types/movie.types";
import {
    createCommentSchema,
    createReviewSchema,
    updateCommentSchema,
    ICreateCommentForm,
    ICreateReviewForm,
    IUpdateCommentForm,
} from "@/src/zod/review.validation";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Fetch all reviews for a movie
export async function getMovieReviewsAction(mediaId: string): Promise<IReview[]> {
    if (!mediaId) return [];

    try {
        const response = await httpClient.get<{ data: IReview[] } | IReview[]>("/review", {
            params: { mediaId },
        });

        if (!response.data) return [];
        if (Array.isArray(response.data)) return response.data;
        const raw = response.data as { data: IReview[] };
        return Array.isArray(raw.data) ? raw.data : [];
    } catch (error) {
        console.error(`Failed to get reviews for media ${mediaId}:`, error);
        return [];
    }
}

// Create a review
export async function createReviewAction(
    payload: ICreateReviewForm
): Promise<{ success: true; data: IReview } | ApiErrorResponse> {
    const parsed = createReviewSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            messsage: parsed.error.issues[0]?.message || "Invalid review data",
        };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to leave a review" };
    }

    try {
        const response = await httpClient.post<IReview>(
            "/review",
            parsed.data,
            { headers: { Cookie: cookieHeader } }
        );

        revalidatePath(`/movies/${payload.mediaId}`);
        revalidatePath("/movies");
        revalidatePath("/admin/dashboard/movie-management");

        return { success: true, data: response.data };
    } catch (error: unknown) {
        let message = "Failed to submit review";
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

// Toggle like on a review
export async function toggleReviewLikeAction(
    reviewId: string
): Promise<{ success: true; data: ILikeResult } | ApiErrorResponse> {
    if (!reviewId) {
        return { success: false, messsage: "Review ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to like reviews" };
    }

    try {
        const response = await httpClient.post<ILikeResult>(
            `/like/like/${reviewId}`,
            {},
            { headers: { Cookie: cookieHeader } }
        );

        return { success: true, data: response.data };
    } catch (error: unknown) {
        let message = "Failed to toggle like";
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

// Fetch comments for a review
export async function getReviewCommentsAction(reviewId: string): Promise<IComment[]> {
    if (!reviewId) return [];

    try {
        const response = await httpClient.get<IComment[] | { data: IComment[] }>(
            `/comment/review/${reviewId}`
        );

        if (!response.data) return [];
        if (Array.isArray(response.data)) return response.data;
        const raw = response.data as { data: IComment[] };
        return Array.isArray(raw.data) ? raw.data : [];
    } catch (error) {
        console.error(`Failed to get comments for review ${reviewId}:`, error);
        return [];
    }
}

// Create comment on a review
export async function createCommentAction(
    payload: ICreateCommentForm
): Promise<{ success: true; data: IComment } | ApiErrorResponse> {
    const parsed = createCommentSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            messsage: parsed.error.issues[0]?.message || "Invalid comment",
        };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to comment" };
    }

    try {
        const response = await httpClient.post<IComment>(
            "/comment",
            parsed.data,
            { headers: { Cookie: cookieHeader } }
        );

        const commentData = ((response.data as unknown as { data: IComment })?.data || response.data) as IComment;
        return { success: true, data: commentData };
    } catch (error: unknown) {
        let message = "Failed to post comment";
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

// Update comment
export async function updateCommentAction(
    commentId: string,
    payload: IUpdateCommentForm
): Promise<{ success: true; data: IComment } | ApiErrorResponse> {
    const parsed = updateCommentSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            messsage: parsed.error.issues[0]?.message || "Invalid comment",
        };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to update comments" };
    }

    try {
        const response = await httpClient.patch<IComment>(
            `/comment/${commentId}`,
            parsed.data,
            { headers: { Cookie: cookieHeader } }
        );

        const commentData = ((response.data as unknown as { data: IComment })?.data || response.data) as IComment;
        return { success: true, data: commentData };
    } catch (error: unknown) {
        let message = "Failed to update comment";
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

// Delete comment
export async function deleteCommentAction(
    commentId: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to delete comments" };
    }

    try {
        await httpClient.delete(`/comment/${commentId}`, {
            headers: { Cookie: cookieHeader },
        });

        return { success: true, message: "Comment deleted successfully" };
    } catch (error: unknown) {
        let message = "Failed to delete comment";
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

// Moderate review status (ADMIN/SUPER_ADMIN)
export async function updateReviewStatusAction(
    reviewId: string,
    status: "APPROVED" | "REJECTED"
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        await httpClient.patch(
            `/review/${reviewId}/status`,
            { status },
            { headers: { Cookie: cookieHeader } }
        );

        revalidatePath("/admin/dashboard/movie-management");
        revalidatePath("/movies");

        return { success: true, message: `Review ${status.toLowerCase()} successfully` };
    } catch (error: unknown) {
        let message = "Failed to update review status";
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

// Delete review (ADMIN/SUPER_ADMIN)
export async function deleteReviewAction(
    reviewId: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        await httpClient.delete(`/review/${reviewId}`, {
            headers: { Cookie: cookieHeader },
        });

        revalidatePath("/admin/dashboard/movie-management");
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
