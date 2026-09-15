"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteGenreAction(
    id: string
): Promise<{ success: true } | ApiErrorResponse> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        await httpClient.delete(`/genre/${id}`, {
            headers: { Cookie: cookieHeader },
        });
        revalidatePath("/admin/dashboard/genre-management");
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            messsage: error?.response?.data?.message || "Failed to delete genre",
        };
    }
}
