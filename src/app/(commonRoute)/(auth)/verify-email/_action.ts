"use server"


import { httpClient } from "@/lib/axios/httpClient";
import { IVerifyEmailPayload } from "@/src/zod/auth.validation";
import { isAxiosError } from "axios";

export async function verifyEmailAction(payload: IVerifyEmailPayload) {
    try {
        const response = await httpClient.post("/auth/verify-email", payload);

        return {
            success: true,
            message: response.message ?? "Email verified",
        };
    } catch (error) {   
        console.error("verifyEmailAction error:", error);

        if (isAxiosError(error)) {
            return {
                success: false,
                message: error.response?.data?.message ?? "Verification failed",
            };
        }

        return { success: false, message: "Verification failed" };
    }
}