"use server"
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ILoginResponse } from "@/src/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (payload: ILoginPayload): Promise<ILoginResponse | ApiErrorResponse> => {
    const parsedPayload = loginZodSchema.safeParse(payload);
    if (!parsedPayload.success) {
        const firstError = parsedPayload.error.issues[0].message || "Invalid payload";
        return{
            success: false,
            messsage: firstError
        }

    }
    try{
        const response = await httpClient.post<ILoginResponse>("/auth/login", parsedPayload.data);

        const {accessToken, refreshToken, token, user} =response.data;

        await setTokenInCookies("accessToken", accessToken);
        await setTokenInCookies("refreshToken", refreshToken);
        await setTokenInCookies("better-auth.session_token", token);

        redirect("/dashboard");
    }catch(error :any){
        return{
            success: false,
            messsage: `Login failed: ${error.message || "Unknown error"}`
        }
    }
} 