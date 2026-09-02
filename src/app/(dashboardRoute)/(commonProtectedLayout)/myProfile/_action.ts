"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { cookies } from "next/headers";

import FormData from "form-data";
import { revalidatePath } from "next/cache";

export const updateProfileAction = async (
    payload: { name: string; image?: File }
): Promise<{ success: true } | ApiErrorResponse> => {
    if (!payload.name || payload.name.trim().length < 2) {
        return { success: false, messsage: "Name is too short" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        const form = new FormData();
        form.append("name", payload.name);

        if (payload.image && payload.image.size > 0) {
            const buffer = Buffer.from(await payload.image.arrayBuffer());
            form.append("file", buffer, {
                filename: payload.image.name,
                contentType: payload.image.type,
            });
        }

        await httpClient.patchRaw("/auth/update-profile", form, {
            headers: {
                Cookie: cookieHeader,
                ...form.getHeaders(), // sets multipart/form-data + boundary
            },
        });

        revalidatePath("/my-profile");
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            messsage: error?.response?.data?.message || "Failed to update profile",
        };
    }
};