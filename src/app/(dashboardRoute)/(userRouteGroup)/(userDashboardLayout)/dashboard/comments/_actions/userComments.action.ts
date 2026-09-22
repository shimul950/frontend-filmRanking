"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IComment } from "@/src/types/movie.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

/**
 * Fetch all comments authored by the current authenticated user
 */
export async function getUserCommentsAction(): Promise<IComment[]> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return [];

    try {
        const response = await httpClient.get<IComment[] | { data: IComment[] }>("/comment/my-comments", {
            headers: { Cookie: cookieHeader },
        });

        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (Array.isArray(response.data)) return response.data;
        const nested = (response.data as unknown as { data?: IComment[] })?.data;
        if (Array.isArray(nested)) return nested;
        return [];
    } catch (error) {
        console.error("Failed to fetch user comments:", error);
        return [];
    }
}

/**
 * Update an existing comment
 */
export async function updateUserCommentAction(
    commentId: string,
    content: string
): Promise<{ success: true; data: IComment } | ApiErrorResponse> {
    if (!commentId) {
        return { success: false, messsage: "Comment ID is required" };
    }

    if (!content || content.trim().length === 0) {
        return { success: false, messsage: "Comment content cannot be empty" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to update your comment" };
    }

    try {
        const response = await httpClient.patch<IComment>(
            `/comment/${commentId}`,
            { content: content.trim() },
            { headers: { Cookie: cookieHeader } }
        );

        revalidatePath("/dashboard/comments");
        revalidatePath("/dashboard");
        revalidatePath("/movies");

        const updatedData = ((response.data as unknown as { data?: IComment })?.data || response.data) as IComment;
        return { success: true, data: updatedData };
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

/**
 * Delete a comment authored by the user
 */
export async function deleteUserCommentAction(
    commentId: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    if (!commentId) {
        return { success: false, messsage: "Comment ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in to delete comments" };
    }

    try {
        await httpClient.delete(`/comment/${commentId}`, {
            headers: { Cookie: cookieHeader },
        });

        revalidatePath("/dashboard/comments");
        revalidatePath("/dashboard");
        revalidatePath("/movies");

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
