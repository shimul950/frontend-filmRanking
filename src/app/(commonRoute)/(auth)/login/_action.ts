import { httpClient } from "@/lib/axios/httpClient";
import { ILoginResponse } from "@/src/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";

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
        return response.data;
    }catch(error :any){
        return{
            success: false,
            messsage: `Login failed: ${error.message || "Unknown error"}`
        }
    }
} 