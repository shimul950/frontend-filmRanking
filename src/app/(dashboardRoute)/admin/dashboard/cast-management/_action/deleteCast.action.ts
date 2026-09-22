"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function deleteCastAction(
    id: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    if (!id) {
        return { success: false, messsage: "Cast ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        await httpClient.delete(`/cast/${id}`, {
            headers: { Cookie: cookieHeader },
        });

        revalidatePath("/admin/dashboard/cast-management");

        return { success: true, message: "Cast deleted successfully" };
    } catch (error: unknown) {
        let message = "Failed to delete cast";
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
