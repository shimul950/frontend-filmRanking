"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IReview } from "@/src/types/movie.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateReviewStatusAdminAction(
    reviewId: string,
    status: "APPROVED" | "REJECTED" | "PENDING"
): Promise<{ success: true; data: IReview } | ApiErrorResponse> {
    if (!reviewId) {
        return { success: false, messsage: "Review ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in as an administrator" };
    }

    try {
        const response = await httpClient.patch<IReview>(
            `/review/${reviewId}/status`,
            { status },
            { headers: { Cookie: cookieHeader } }
        );

        revalidatePath("/admin/dashboard/review-management");
        revalidatePath("/reviews");
        revalidatePath("/movies");
        revalidatePath("/");

        const data = ((response.data as unknown as { data?: IReview })?.data || response.data) as IReview;
        return { success: true, data };
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
