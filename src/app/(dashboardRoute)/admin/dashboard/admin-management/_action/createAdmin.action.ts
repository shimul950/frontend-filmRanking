"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { createAdminSchema, ICreateAdminForm } from "@/src/zod/auth.validation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createAdminAction(
    payload: ICreateAdminForm
): Promise<{ success: true } | ApiErrorResponse> {
    const parsed = createAdminSchema.safeParse(payload);
    if (!parsed.success) {
        return { success: false, messsage: parsed.error.issues[0].message || "Invalid input" };
    }

    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) {
        return { success: false, messsage: "You must be logged in" };
    }

    try {
        await httpClient.post(
            "/users/create-admin",
            {
                password: parsed.data.password,
                admin: {
                    name: parsed.data.name,
                    email: parsed.data.email,
                    image: parsed.data.image || undefined,
                    contactNumber: parsed.data.contactNumber,
                },
            },
            { headers: { Cookie: cookieHeader } }
        );
        revalidatePath("/admin/dashboard/admin-management");
        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            messsage: error?.response?.data?.message || "Failed to create admin",
        };
    }
}