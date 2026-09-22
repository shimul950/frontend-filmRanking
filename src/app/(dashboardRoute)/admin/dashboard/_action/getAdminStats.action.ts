"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { cookies } from "next/headers";
import { IAdminStatsData, IAdminStatsResponse } from "@/src/types/stats.types";

export async function getAdminStatsAction(): Promise<IAdminStatsData | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<IAdminStatsData | IAdminStatsResponse>("/stats", {
            headers: { Cookie: cookieHeader },
        });

        if (!response) return null;

        // Handles raw response, Axios response, or ApiResponse unwrapped by httpClient
        const payload = ((response as unknown as { data?: unknown })?.data || response) as Record<string, unknown>;
        if (payload && typeof payload === "object") {
            if ("overview" in payload) {
                return payload as unknown as IAdminStatsData;
            }
            const nested = (payload as { data?: Record<string, unknown> }).data;
            if (nested && typeof nested === "object" && "overview" in nested) {
                return nested as unknown as IAdminStatsData;
            }
        }

        return null;
    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        return null;
    }
}
