export interface IEpisode {
    id: string;
    seasonId: string;
    episodeNumber: number;
    title: string;
    synopsis?: string | null;
    duration?: number | null;
    stillUrl?: string | null;
    videoUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISeason {
    id: string;
    webSeriesId: string;
    seasonNumber: number;
    title?: string | null;
    synopsis?: string | null;
    posterUrl?: string | null;
    youtubeTrailer?: string | null;
    releaseDate?: string | null;
    createdAt?: string;
    updatedAt?: string;
    episodes?: IEpisode[];
}

export interface IWebSeries {
    id: string;
    posterUrl?: string | null;
    title: string;
    synopsis: string;
    releaseYear: number;
    averageRating: number;
    reviewCount: number;
    language: string;
    country: string;
    status: "RELEASED" | "UPCOMING" | "ARCHIVED";
    pricing: "FREE" | "PREMIUM";
    createdAt?: string;
    updatedAt?: string;
    seasons?: ISeason[];
}

export interface IWebSeriesResponseData {
    data: IWebSeries[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
