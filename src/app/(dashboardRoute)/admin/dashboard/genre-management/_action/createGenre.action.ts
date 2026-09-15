"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IGenre } from "@/src/types/genre.types";
import { createGenreSchema, ICreateGenreForm } from "@/src/zod/genre.validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createGenreAction(
    payload: ICreateGenreForm
): Promise<{ success: true; data: IGenre } | ApiErrorResponse> {
    const parsed = createGenreSchema.safeParse(payload);
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
        const response = await httpClient.post<IGenre>(
            "/genre",
            { name: parsed.data.name.trim() },
            { headers: { Cookie: cookieHeader } }
        );
        revalidatePath("/admin/dashboard/genre-management");
        return { success: true, data: response.data };
    } catch (error: any) {
        return {
            success: false,
            messsage: error?.response?.data?.message || "Failed to create genre",
        };
    }
}
