import { httpClient } from "@/lib/axios/httpClient";
import { IMovie } from "@/src/types/movie.types";
import { ApiResponse } from "@/src/types/api.types";
import { IGenre } from "@/src/types/genre.types";

export interface IMoviesQueryResult {
    data: IMovie[];
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface IGetMoviesParams {
    searchTerm?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    genreId?: string;
    platformId?: string;
}

export const getMovies = async (
    params?: IGetMoviesParams
): Promise<ApiResponse<IMoviesQueryResult | IMovie[]>> => {
    const queryParams: Record<string, unknown> = {
        limit: params?.limit ?? 100,
    };
    if (params?.page) queryParams.page = params.page;
    if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
    if (params?.genreId) queryParams.genreId = params.genreId;
    if (params?.platformId) queryParams.platformId = params.platformId;

    const movies = await httpClient.get<IMoviesQueryResult | IMovie[]>("/media", {
        params: queryParams,
    });
    return movies;
};

export const getPublicGenresAction = async (): Promise<IGenre[]> => {
    try {
        const response = await httpClient.get<IGenre[]>("/genre");
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    } catch {
        return [];
    }
};