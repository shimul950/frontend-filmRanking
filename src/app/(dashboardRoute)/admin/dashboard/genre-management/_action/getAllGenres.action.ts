"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { IGenre } from "@/src/types/genre.types";
import { cookies } from "next/headers";

export async function getAllGenresAction(): Promise<IGenre[] | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<IGenre[]>("/genre", {
            headers: { Cookie: cookieHeader },
        });
        return response.data;
    } catch {
        return null;
    }
}
