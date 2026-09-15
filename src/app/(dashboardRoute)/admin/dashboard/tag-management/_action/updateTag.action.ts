"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ApiErrorResponse } from "@/src/types/api.types";
import { ITag } from "@/src/types/tag.types";
import { updateTagSchema, IUpdateTagForm } from "@/src/zod/tag.validation";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateTagAction(
    id: string,
    payload: IUpdateTagForm
): Promise<{ success: true; data: ITag } | ApiErrorResponse> {
    const parsed = updateTagSchema.safeParse(payload);
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
        const response = await httpClient.patch<ITag>(
            `/tag/${id}`,
            { name: parsed.data.name?.trim() },
            { headers: { Cookie: cookieHeader } }
        );
        revalidatePath("/admin/dashboard/tag-management");
        return { success: true, data: response.data };
    } catch (error: unknown) {
        let message = "Failed to update tag";
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
