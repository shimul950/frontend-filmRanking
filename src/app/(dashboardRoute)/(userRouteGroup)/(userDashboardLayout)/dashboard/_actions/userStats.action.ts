"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { cookies } from "next/headers";
import { IUserStatsData, IUserStatsResponse } from "@/src/types/stats.types";

export async function getUserStatsAction(): Promise<IUserStatsData | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<IUserStatsData | IUserStatsResponse>("/stats", {
            headers: { Cookie: cookieHeader },
        });

        if (!response) return null;

        // Handles raw response, Axios response, or ApiResponse unwrapped by httpClient
        const payload = ((response as unknown as { data?: unknown })?.data || response) as Record<string, unknown>;
        if (payload && typeof payload === "object") {
            if ("userData" in payload) {
                return payload as unknown as IUserStatsData;
            }
            const nested = (payload as { data?: Record<string, unknown> }).data;
            if (nested && typeof nested === "object" && "userData" in nested) {
                return nested as unknown as IUserStatsData;
            }
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch user stats:", error);
        return null;
    }
}
