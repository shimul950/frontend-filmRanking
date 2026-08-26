"use server"
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IRegisterResponse } from "@/src/types/auth.types";

import { IRegisterPayload, registerZodSchema } from "@/src/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (payload: IRegisterPayload): Promise<IRegisterResponse | ApiErrorResponse> => {
    const parsedPayload = registerZodSchema.safeParse(payload);
    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid payload";
        return {
            success: false,
            messsage: firstError
        }
    }

    const { confirmPassword, ...body } = parsedPayload.data;

    try {
        const response = await httpClient.post<IRegisterResponse>("/auth/register", body);

        redirect(`/verify-email?email=${encodeURIComponent(body.email)}`);
    }
    catch (error: any) {
        if (error && typeof error === 'object' && 'digest' in error && typeof error.digest === 'string' && error.digest.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        return {
            success: false,
            messsage: `Registration failed: ${error.message || "Unknown error"}`
        }
    }
}