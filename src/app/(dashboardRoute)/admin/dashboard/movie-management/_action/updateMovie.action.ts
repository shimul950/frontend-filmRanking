"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IMovie } from "@/src/types/movie.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateMovieAction(
    id: string,
    formData: FormData
): Promise<{ success: true; data: IMovie } | ApiErrorResponse> {
    if (!id) {
        return { success: false, messsage: "Movie ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        const response = await axios.put<{ success: boolean; data: IMovie }>(
            `${API_BASE_URL}/media/${id}`,
            formData,
            {
                headers: {
                    Cookie: cookieHeader,
                },
            }
        );

        revalidatePath("/admin/dashboard/movie-management");
        revalidatePath(`/movies/${id}`);
        revalidatePath("/movies");

        return { success: true, data: response.data.data };
    } catch (error: unknown) {
        let message = "Failed to update movie";
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
