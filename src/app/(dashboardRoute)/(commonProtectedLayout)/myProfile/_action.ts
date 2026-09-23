"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateProfileAction(
    formData: FormData
): Promise<{ success: true; data?: any } | ApiErrorResponse> {
    const name = formData.get("name")?.toString();
    if (!name || name.trim().length < 2) {
        return { success: false, messsage: "Name must be at least 2 characters long" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        const response = await axios.patch(
            `${API_BASE_URL}/auth/update-profile`,
            formData,
            {
                headers: {
                    Cookie: cookieHeader,
                },
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            }
        );

        revalidatePath("/myProfile");
        revalidatePath("/my-profile");
        revalidatePath("/dashboard");

        return { success: true, data: response.data?.data };
    } catch (error: unknown) {
        let message = "Failed to update profile";
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