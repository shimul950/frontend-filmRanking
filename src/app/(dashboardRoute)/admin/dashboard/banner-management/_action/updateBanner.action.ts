"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { updateBannerInDb } from "@/lib/db";
import { ApiErrorResponse } from "@/src/types/api.types";
import { IBanner, IUpdateBannerPayload } from "@/src/types/banner.types";
import { updateBannerSchema } from "@/src/zod/banner.validation";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateBannerAction(
    id: string,
    payload: IUpdateBannerPayload
): Promise<{ success: true; data: IBanner } | ApiErrorResponse> {
    const parsed = updateBannerSchema.safeParse(payload);
    if (!parsed.success) {
        return {
            success: false,
            messsage: parsed.error.issues[0]?.message || "Invalid banner update data",
        };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        const response = await axios.patch<{ success: boolean; data: IBanner }>(
            `${API_BASE_URL}/banner/${id}`,
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
        // Fallback to direct DB update if remote endpoint 404s
        try {
            const dbBanner = await updateBannerInDb(id, parsed.data);
            if (!dbBanner) {
                return { success: false, messsage: "Banner not found in database" };
            }
            revalidatePath("/admin/dashboard/banner-management");
            revalidatePath("/admin/dashboard");
            revalidatePath("/");
            return { success: true, data: dbBanner };
        } catch (dbError: any) {
            return {
                success: false,
                messsage: dbError?.message || "Failed to update banner",
            };
        }
    }
}
