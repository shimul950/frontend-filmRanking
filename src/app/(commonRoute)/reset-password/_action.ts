"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IResetPasswordPayload, resetPasswordSchema } from "@/src/zod/auth.validation";
import { redirect } from "next/navigation";

export const resetPasswordAction = async (
    payload: IResetPasswordPayload & { email: string }
): Promise<ApiErrorResponse | never> => {
    const { email, ...rest } = payload;
    const parsed = resetPasswordSchema.safeParse(rest);
    if (!parsed.success) {
        return { success: false, messsage: parsed.error.issues[0].message || "Invalid input" };
    }

    try {
        await httpClient.post("/auth/reset-password", {
            email,
            otp: parsed.data.otp,
            newPassword: parsed.data.newPassword,
        });
        redirect("/login");
    } catch (error: any) {
        if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
        return {
            success: false,
            messsage: error?.response?.data?.message || "Reset failed — check your code",
        };
    }
};