"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IWebSeries } from "@/src/types/webSeries.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateWebSeriesAction(
    id: string,
    payload: Partial<IWebSeries>
): Promise<{ success: true; data: IWebSeries } | ApiErrorResponse> {
    if (!id) {
        return { success: false, messsage: "Series ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        const response = await axios.patch<{ success: boolean; data: IWebSeries }>(
            `${API_BASE_URL}/web-series/${id}`,
            payload,
            {
                headers: {
                    Cookie: cookieHeader,
                    "Content-Type": "application/json",
                },
            }
        );

        revalidatePath("/admin/dashboard/web-series-management");
        revalidatePath("/web-series");
        revalidatePath(`/web-series/${id}`);

        return { success: true, data: response.data.data };
    } catch (error: unknown) {
        let message = "Failed to update web series";
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
