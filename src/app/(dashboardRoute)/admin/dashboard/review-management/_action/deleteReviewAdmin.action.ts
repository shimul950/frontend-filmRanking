"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteReviewAdminAction(
    reviewId: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    if (!reviewId) {
        return { success: false, messsage: "Review ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in as an administrator" };
    }

    try {
        await httpClient.delete(`/review/${reviewId}`, {
            headers: { Cookie: cookieHeader },
        });

        revalidatePath("/admin/dashboard/review-management");
        revalidatePath("/reviews");
        revalidatePath("/movies");
        revalidatePath("/");

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
