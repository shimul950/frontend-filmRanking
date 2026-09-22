"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ICast } from "@/src/types/cast.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ICreateCastPayload {
    name: string;
    bio?: string;
    imageUrl?: string;
    birthDate?: string;
    nationality?: string;
}

export async function createCastAction(
    payload: ICreateCastPayload
): Promise<{ success: true; data: ICast } | ApiErrorResponse> {
    if (!payload.name?.trim()) {
        return { success: false, messsage: "Cast name is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        const response = await axios.post<{ success: boolean; data: ICast }>(
            `${API_BASE_URL}/cast`,
            payload,
            {
                headers: {
                    Cookie: cookieHeader,
                    "Content-Type": "application/json",
                },
            }
        );

        revalidatePath("/admin/dashboard/cast-management");

        return { success: true, data: response.data.data };
    } catch (error: unknown) {
        let message = "Failed to create cast";
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
