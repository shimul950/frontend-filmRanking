"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IDirectorsResponseData } from "@/src/types/director.types";

interface IGetAllDirectorsParams {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export async function getAllDirectorsAction(
    params?: IGetAllDirectorsParams
): Promise<IDirectorsResponseData | null> {
    try {
        const queryParams: Record<string, unknown> = {};
        if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.sortBy) queryParams.sortBy = params.sortBy;
        if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

        const response = await httpClient.get<any>("/director", {
            params: queryParams,
        });

        if (!response.data) return null;

        const result = response.data.data || response.data;
        if (Array.isArray(result)) {
            return {
                data: result,
                meta: {
                    page: 1,
                    limit: result.length,
                    total: result.length,
                    totalPages: 1,
                },
            };
        }

        return {
            data: Array.isArray(result.data) ? result.data : [],
            meta: result.meta || {
                page: 1,
                limit: 10,
                total: Array.isArray(result.data) ? result.data.length : 0,
                totalPages: 1,
            },
        };
    } catch (error) {
        console.error("Failed to get all directors:", error);
        return null;
    }
}
