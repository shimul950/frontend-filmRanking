"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteTagAction(
    id: string
): Promise<{ success: true } | ApiErrorResponse> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        await httpClient.delete(`/tag/${id}`, {
            headers: { Cookie: cookieHeader },
        });
        revalidatePath("/admin/dashboard/tag-management");
        return { success: true };
    } catch (error: unknown) {
        let message = "Failed to delete tag";
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
