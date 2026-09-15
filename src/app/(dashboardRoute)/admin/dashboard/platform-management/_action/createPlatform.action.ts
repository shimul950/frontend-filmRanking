"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IPlatform } from "@/src/types/platform.types";
import { createPlatformSchema, ICreatePlatformForm } from "@/src/zod/platform.validation";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createPlatformAction(
    payload: ICreatePlatformForm
): Promise<{ success: true; data: IPlatform } | ApiErrorResponse> {
    const parsed = createPlatformSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            messsage: parsed.error.issues[0]?.message || "Invalid input",
        };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        const response = await httpClient.post<IPlatform>(
            "/platform",
            { name: parsed.data.name.trim() },
            { headers: { Cookie: cookieHeader } }
        );
        revalidatePath("/admin/dashboard/platform-management");
        return { success: true, data: response.data };
    } catch (error: unknown) {
        let message = "Failed to create platform";
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
