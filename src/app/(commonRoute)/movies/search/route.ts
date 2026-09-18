import { NextRequest, NextResponse } from "next/server";
import { httpClient } from "@/lib/axios/httpClient";
import { IMovie } from "@/src/types/movie.types";
import { ApiResponse } from "@/src/types/api.types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query =
        searchParams.get("query") ||
        searchParams.get("q") ||
        searchParams.get("searchTerm") ||
        "";

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
        return NextResponse.json({
            success: true,
            data: [],
            total: 0,
        });
    }

    try {
        // Query backend media endpoint with searchTerm & limit
        const response = await httpClient.get<ApiResponse<IMovie[]> | IMovie[]>("/media", {
            params: {
                searchTerm: trimmedQuery,
                limit: 10,
            },
        });

        const rawData = response.data;
        let movies: IMovie[] = [];

        if (Array.isArray(rawData)) {
            movies = rawData;
        } else if (
            rawData &&
            "data" in (rawData as object) &&
            Array.isArray((rawData as { data: IMovie[] }).data)
        ) {
            movies = (rawData as { data: IMovie[] }).data;
        }

        // Fuzzy/case-insensitive filtering to ensure best matches
        const q = trimmedQuery.toLowerCase();
        const filtered = movies.filter((m) => {
            const titleMatch = m.title?.toLowerCase().includes(q);
            const directorMatch = m.director?.toLowerCase().includes(q);
            const castMatch = m.cast?.some((c) => c.toLowerCase().includes(q));
            const synopsisMatch = m.synopsis?.toLowerCase().includes(q);
            const genreMatch = m.genres?.some((g) =>
                g.genre?.name?.toLowerCase().includes(q)
            );
            return titleMatch || directorMatch || castMatch || synopsisMatch || genreMatch;
        });

        const results = (filtered.length > 0 ? filtered : movies).slice(0, 10);

        return NextResponse.json({
            success: true,
            data: results,
            total: results.length,
        });
    } catch (error) {
        console.error("GET /movies/search error:", error);
        return NextResponse.json(
            {
                success: false,
                data: [],
                total: 0,
                message: "Failed to query movies database",
            },
            { status: 500 }
        );
    }
}
