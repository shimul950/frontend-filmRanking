export interface IBanner {
    id: string;
    title: string;
    synopsis?: string | null;
    imageUrl: string;
    posterUrl?: string | null;
    rating?: number | null;
    releaseYear?: number | null;
    duration?: number | null;
    genre?: string | null;
    pricing: "FREE" | "PREMIUM";
    youtubeLink?: string | null;
    director?: string | null;
    linkUrl?: string | null;
    isActive: boolean;
    order: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreateBannerPayload {
    title: string;
    synopsis?: string;
    imageUrl: string;
    posterUrl?: string;
    rating?: number;
    releaseYear?: number;
    duration?: number;
    genre?: string;
    pricing?: "FREE" | "PREMIUM";
    youtubeLink?: string;
    director?: string;
    linkUrl?: string;
    isActive?: boolean;
    order?: number;
}

export interface IUpdateBannerPayload extends Partial<ICreateBannerPayload> {}
