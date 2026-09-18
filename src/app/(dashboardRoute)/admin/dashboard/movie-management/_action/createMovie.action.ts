"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IMovie } from "@/src/types/movie.types";
import { createMovieSchema } from "@/src/zod/movie.validation";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createMovieAction(
    formData: FormData
): Promise<{ success: true; data: IMovie } | ApiErrorResponse> {
    const rawDataString = formData.get("data");
    if (!rawDataString || typeof rawDataString !== "string") {
        return { success: false, messsage: "Movie data is missing" };
    }

    let parsedPayload: unknown;
    try {
        parsedPayload = JSON.parse(rawDataString);
    } catch {
        return { success: false, messsage: "Invalid JSON movie data format" };
    }

    const validationResult = createMovieSchema.safeParse(parsedPayload);
    if (!validationResult.success) {
        return {
            success: false,
            messsage: validationResult.error.issues[0]?.message || "Invalid movie fields",
        };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        const response = await axios.post<{ success: boolean; data: IMovie }>(
            `${API_BASE_URL}/media`,
            formData,
            {
                headers: {
                    Cookie: cookieHeader,
                },
            }
        );

        revalidatePath("/admin/dashboard/movie-management");
        revalidatePath("/movies");

        return { success: true, data: response.data.data };
    } catch (error: unknown) {
        let message = "Failed to create movie";
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
