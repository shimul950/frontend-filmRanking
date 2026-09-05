"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function softDeleteAdminAction(
    adminId: string
): Promise<{ success: true } | ApiErrorResponse> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        await httpClient.delete(`/admins/${adminId}`, {
            headers: { Cookie: cookieHeader },
        });
        revalidatePath("/admin/dashboard/admin-management");
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            messsage: error?.response?.data?.message || "Failed to remove admin",
        };
    }
}