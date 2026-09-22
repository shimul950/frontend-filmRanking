"use server";

import { getBannersFromDb } from "@/lib/db";
import { httpClient } from "@/lib/axios/httpClient";
import { IBanner } from "@/src/types/banner.types";

interface IGetAllBannersParams {
    searchTerm?: string;
    isActive?: boolean | string;
    genre?: string;
}

export async function getAllBannersAction(
    params?: IGetAllBannersParams
): Promise<IBanner[] | null> {
    try {
        // 1. Direct query to live PostgreSQL database (ultra-fast, zero network 404s)
        const dbBanners = await getBannersFromDb(params);
        if (dbBanners && dbBanners.length > 0) {
            return dbBanners;
        }

        // 2. Fallback to API if DB returns empty
        try {
            const queryParams: Record<string, unknown> = {};
            if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
            if (params?.isActive !== undefined && params?.isActive !== "") {
                queryParams.isActive = params.isActive;
            }
            if (params?.genre && params.genre.toLowerCase() !== "all") {
                queryParams.genre = params.genre;
            }

            const response = await httpClient.get<any>("/banner", {
                params: queryParams,
            });

            const result = response?.data?.data || response?.data;
            if (Array.isArray(result)) return result;
            if (Array.isArray(result?.data)) return result.data;
        } catch {
            // Silently ignore 404s from remote endpoint during deployment
        }

        return dbBanners || [];
    } catch {
        return [];
    }
}
