"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IMovie } from "@/src/types/movie.types";

export async function getSingleMovieAction(id: string): Promise<IMovie | null> {
    if (!id) return null;

    try {
        const response = await httpClient.get<IMovie>(`/media/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to get movie with id ${id}:`, error);
        return null;
    }
}
