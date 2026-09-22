"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { createBannerInDb } from "@/lib/db";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IBanner, ICreateBannerPayload } from "@/src/types/banner.types";
import { createBannerSchema } from "@/src/zod/banner.validation";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createBannerAction(
    payload: ICreateBannerPayload
): Promise<{ success: true; data: IBanner } | ApiErrorResponse> {
    const parsed = createBannerSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            messsage: parsed.error.issues[0]?.message || "Invalid banner data",
        };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        const response = await axios.post<{ success: boolean; data: IBanner }>(
            `${API_BASE_URL}/banner`,
            parsed.data,
            {
                headers: {
                    Cookie: cookieHeader,
                    "Content-Type": "application/json",
                },
                timeout: 5000,
            }
        );

        revalidatePath("/admin/dashboard/banner-management");
        revalidatePath("/admin/dashboard");
        revalidatePath("/");

        const bannerData = response.data.data || (response.data as any);
        return { success: true, data: bannerData };
    } catch {
        // Fallback to direct DB operation if remote endpoint 404s
        try {
            const dbBanner = await createBannerInDb(parsed.data);
            revalidatePath("/admin/dashboard/banner-management");
            revalidatePath("/admin/dashboard");
            revalidatePath("/");
            return { success: true, data: dbBanner };
        } catch (dbError: any) {
            return {
                success: false,
                messsage: dbError?.message || "Failed to create banner",
            };
        }
    }
}
