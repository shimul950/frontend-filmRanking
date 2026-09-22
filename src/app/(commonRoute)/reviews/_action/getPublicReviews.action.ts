"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { PaginationMeta } from "@/src/types/api.types";
import { IReview } from "@/src/types/movie.types";

export interface IGetPublicReviewsParams {
    searchTerm?: string;
    rating?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    mediaId?: string;
}

export interface IPublicReviewsResponse {
    data: IReview[];
    meta: PaginationMeta;
}

export async function getPublicReviewsAction(
    params?: IGetPublicReviewsParams
): Promise<IPublicReviewsResponse | null> {
    try {
        const queryParams: Record<string, unknown> = {
            status: "APPROVED",
            include: "user,media,tags,likes,comments",
            page: params?.page || 1,
            limit: params?.limit || 12,
            sortBy: params?.sortBy || "createdAt",
            sortOrder: params?.sortOrder || "desc",
        };

        if (params?.searchTerm && params.searchTerm.trim() !== "") {
            queryParams.searchTerm = params.searchTerm.trim();
        }

        if (params?.rating && params.rating > 0) {
            queryParams.rating = params.rating;
        }

        if (params?.mediaId) {
            queryParams.mediaId = params.mediaId;
        }

        const response = await httpClient.get<IPublicReviewsResponse | IReview[]>("/review", {
            params: queryParams,
        });

        if (!response) return null;

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

        const rawData = response.data as IPublicReviewsResponse;
        const items = Array.isArray(rawData?.data) ? rawData.data : [];
        const meta = rawData?.meta || {
            page: Number(queryParams.page) || 1,
            limit: Number(queryParams.limit) || 12,
            total: items.length,
            totalPages: Math.max(1, Math.ceil(items.length / (Number(queryParams.limit) || 12))),
        };

        return {
            data: items,
            meta,
        };
    } catch (error) {
        console.error("Failed to get public reviews:", error);
        return null;
    }
}
