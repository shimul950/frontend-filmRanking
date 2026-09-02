"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader, relaySetCookies } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IChangePasswordPayload, changePasswordSchema } from "@/src/zod/auth.validation";
import { cookies } from "next/headers";

export const changePasswordAction = async (
    payload: IChangePasswordPayload
): Promise<{ success: true } | ApiErrorResponse> => {
    const parsed = changePasswordSchema.safeParse(payload);
    if (!parsed.success) {
        return { success: false, messsage: parsed.error.issues[0].message || "Invalid input" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        const response = await httpClient.postRaw(
            "/auth/change-password",
            {
                currentPassword: parsed.data.currentPassword,
                newPassword: parsed.data.newPassword,
            },
            { headers: { Cookie: cookieHeader } }
        );

        relaySetCookies(response.headers?.["set-cookie"], cookieStore);
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            messsage: error?.response?.data?.message || "Failed to change password",
        };
    }
};