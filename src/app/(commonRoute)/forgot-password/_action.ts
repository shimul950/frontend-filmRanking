"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IForgotPasswordPayload, forgotPasswordSchema } from "@/src/zod/auth.validation";
import { redirect } from "next/navigation";

export const forgotPasswordAction = async (
    payload: IForgotPasswordPayload
): Promise<ApiErrorResponse | never> => {
    const parsed = forgotPasswordSchema.safeParse(payload);
    if (!parsed.success) {
        return { success: false, messsage: parsed.error.issues[0].message || "Invalid email" };
    }

    try {
        await httpClient.post("/auth/forget-password", parsed.data);
        redirect(`/reset-password?email=${encodeURIComponent(parsed.data.email)}`);
    } catch (error: any) {
        if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
        return {
            success: false,
            messsage: error?.response?.data?.message || "Failed to send reset code",
        };
    }
};