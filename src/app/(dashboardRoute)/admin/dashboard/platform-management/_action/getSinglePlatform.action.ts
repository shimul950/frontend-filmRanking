"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { IPlatform } from "@/src/types/platform.types";
import { cookies } from "next/headers";

export async function getSinglePlatformAction(id: string): Promise<IPlatform | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<IPlatform>(`/platform/${id}`, {
            headers: { Cookie: cookieHeader },
        });
        return response.data;
    } catch (error) {
        console.error(`Failed to get platform with id ${id}:`, error);
        return null;
    }
}
