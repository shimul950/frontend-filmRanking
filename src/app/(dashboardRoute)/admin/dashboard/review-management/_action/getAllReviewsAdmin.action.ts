"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { PaginationMeta } from "@/src/types/api.types";
import { IReview } from "@/src/types/movie.types";
import { cookies } from "next/headers";

export interface IGetAllReviewsAdminParams {
    searchTerm?: string;
    status?: string;
    rating?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface IReviewsAdminResponseData {
    data: IReview[];
    meta: PaginationMeta;
}

export async function getAllReviewsAdminAction(
    params?: IGetAllReviewsAdminParams
): Promise<IReviewsAdminResponseData | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    try {
        const queryParams: Record<string, unknown> = {
            include: "user,media,tags,likes,comments",
            page: params?.page || 1,
            limit: params?.limit || 10,
            sortBy: params?.sortBy || "createdAt",
            sortOrder: params?.sortOrder || "desc",
        };

        if (params?.searchTerm && params.searchTerm.trim() !== "") {
            queryParams.searchTerm = params.searchTerm.trim();
        }

        if (params?.status && params.status !== "ALL") {
            queryParams.status = params.status;
        }

        if (params?.rating && params.rating > 0) {
            queryParams.rating = params.rating;
        }

        const response = await httpClient.get<IReviewsAdminResponseData | IReview[]>("/review", {
            params: queryParams,
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
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

        const rawData = response.data as IReviewsAdminResponseData;
        const items = Array.isArray(rawData?.data) ? rawData.data : [];
        const meta = rawData?.meta || {
            page: Number(queryParams.page) || 1,
            limit: Number(queryParams.limit) || 10,
            total: items.length,
            totalPages: Math.max(1, Math.ceil(items.length / (Number(queryParams.limit) || 10))),
        };

        return {
            data: items,
            meta,
        };
    } catch (error) {
        console.error("Failed to get all reviews for admin:", error);
        return null;
    }
}
