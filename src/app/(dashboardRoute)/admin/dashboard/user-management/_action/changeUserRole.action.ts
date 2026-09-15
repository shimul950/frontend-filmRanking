"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function changeUserRoleAction(
    userId: string,
    newRole: "USER" | "ADMIN" | "SUPER_ADMIN"
): Promise<{ success: true } | ApiErrorResponse> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        await httpClient.patch(
            `/admins/change-user-role/${userId}`,
            { role: newRole },
            { headers: { Cookie: cookieHeader } }
        );
        revalidatePath("/admin/dashboard/user-management");
        revalidatePath("/admin/dashboard/admin-management");
        return { success: true };
    } catch (error: unknown) {
        let message = "Failed to update user role";
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