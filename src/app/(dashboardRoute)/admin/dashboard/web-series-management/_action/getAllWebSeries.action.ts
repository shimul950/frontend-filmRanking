"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IWebSeriesResponseData } from "@/src/types/webSeries.types";

interface IGetAllWebSeriesParams {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    status?: string;
    pricing?: string;
}

export async function getAllWebSeriesAction(
    params?: IGetAllWebSeriesParams
): Promise<IWebSeriesResponseData | null> {
    try {
        const queryParams: Record<string, unknown> = {};
        if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.sortBy) queryParams.sortBy = params.sortBy;
        if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
        if (params?.status) queryParams.status = params.status;
        if (params?.pricing) queryParams.pricing = params.pricing;

        const response = await httpClient.get<any>("/web-series", {
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
        console.error("Failed to get all web series:", error);
        return null;
    }
}
