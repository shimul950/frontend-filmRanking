"use server";

import { buildCookieHeader } from "@/lib/cookie-relay";
import { deleteBannerInDb } from "@/lib/db";
import { ApiErrorResponse } from "@/src/types/api.types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteBannerAction(
    id: string
): Promise<{ success: true; message: string } | ApiErrorResponse> {
    if (!id) {
        return { success: false, messsage: "Banner ID is required" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be authenticated as admin" };
    }

    try {
        const response = await axios.delete<{ success: boolean; message: string }>(
            `${API_BASE_URL}/banner/${id}`,
            {
                headers: {
                    Cookie: cookieHeader,
                },
                timeout: 5000,
            }
        );

        revalidatePath("/admin/dashboard/banner-management");
        revalidatePath("/admin/dashboard");
        revalidatePath("/");

        return {
            success: true,
            message: response.data.message || "Banner deleted successfully",
        };
    } catch {
        // Fallback to direct DB delete if remote endpoint 404s
        try {
            const deleted = await deleteBannerInDb(id);
            if (!deleted) {
                return { success: false, messsage: "Banner not found in database" };
            }
            revalidatePath("/admin/dashboard/banner-management");
            revalidatePath("/admin/dashboard");
            revalidatePath("/");
            return { success: true, message: "Banner deleted successfully" };
        } catch (dbError: any) {
            return {
                success: false,
                messsage: dbError?.message || "Failed to delete banner",
            };
        }
    }
}
