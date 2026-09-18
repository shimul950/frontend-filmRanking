"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IMovie } from "@/src/types/movie.types";

interface IGetAllMoviesParams {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    genreId?: string;
    platformId?: string;
}

export interface IMoviesResponseData {
    data: IMovie[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export async function getAllMoviesAction(
    params?: IGetAllMoviesParams
): Promise<IMoviesResponseData | null> {
    try {
        const queryParams: Record<string, unknown> = {};
        if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
        if (params?.page) queryParams.page = params.page;
        if (params?.limit) queryParams.limit = params.limit;
        if (params?.sortBy) queryParams.sortBy = params.sortBy;
        if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
        if (params?.genreId) queryParams.genreId = params.genreId;
        if (params?.platformId) queryParams.platformId = params.platformId;

        const response = await httpClient.get<IMoviesResponseData | IMovie[]>("/media", {
            params: queryParams,
        });

        if (!response.data) return null;

        // Handle both paginated response object and flat array
        if (Array.isArray(response.data)) {
            return {
                data: response.data,
                meta: {
                    page: 1,
                    limit: response.data.length,
                    total: response.data.length,
                    totalPages: 1,
                },
            };
        }

        const rawData = response.data as IMoviesResponseData;
        return {
            data: Array.isArray(rawData.data) ? rawData.data : [],
            meta: rawData.meta || {
                page: 1,
                limit: 10,
                total: Array.isArray(rawData.data) ? rawData.data.length : 0,
                totalPages: 1,
            },
        };
    } catch (error) {
        console.error("Failed to get all movies:", error);
        return null;
    }
}
