"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { ITag } from "@/src/types/tag.types";
import { cookies } from "next/headers";

export async function getSingleTagAction(id: string): Promise<ITag | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<ITag>(`/tag/${id}`, {
            headers: { Cookie: cookieHeader },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to get tag with id ${id}:`, error);
        return null;
    }
}
