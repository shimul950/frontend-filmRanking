export interface IMediaGenre {
    mediaId?: string;
    genreId: string;
    genre: {
        id: string;
        name: string;
    };
}

export interface IMediaPlatform {
    mediaId?: string;
    platformId: string;
    platform: {
        id: string;
        name: string;
    };
}

export interface IReviewTagRelation {
    reviewId: string;
    tagId: string;
    tag: {
        id: string;
        name: string;
    };
}

export interface IComment {
    id: string;
    content: string;
    userId: string;
    reviewId: string;
    parentId?: string | null;
    createdAt: string;
    updatedAt?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        role?: string;
    };
    parent?: IComment | null;
    replies?: IComment[];
    review?: IReview;
}

export interface IReviewLike {
    id: string;
    userId: string;
    reviewId: string;
}

export interface IReview {
    id: string;
    userId: string;
    mediaId: string;
    rating: number; // 1 to 5
    content: string;
    spoiler: boolean;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    updatedAt?: string;
    user?: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        role?: string;
    };
    media?: {
        id: string;
        title: string;
        posterUrl?: string | null;
        releaseYear?: number;
        duration?: number;
        averageRating?: number;
        reviewCount?: number;
    };
    tags?: IReviewTagRelation[];
    likes?: IReviewLike[];
    comments?: IComment[];
    _count?: {
        likes?: number;
        comments?: number;
    };
}

export interface IMovie {
    id: string;
    posterUrl?: string | null;
    banner?: string | null;
    title: string;
    synopsis: string;
    releaseYear: number;
    director: string;
    cast: string[];
    duration: number; // in minutes
    averageRating: number;
    reviewCount: number;
    language: string;
    country: string;
    status: "RELEASED" | "UPCOMING" | "POST_PRODUCTION";
    pricing: "FREE" | "PREMIUM";
    youtubeLink?: string | null;
    createdAt?: string;
    updatedAt?: string;
    genres?: IMediaGenre[];
    platforms?: IMediaPlatform[];
    reviews?: IReview[];
    casts?: import("./cast.types").IMediaCast[];
    directors?: import("./director.types").IMediaDirector[];
}

export interface ILikeResult {
    liked: boolean;
}

export interface IMovieStats {
    totalMovies: number;
    averageRating: number;
    totalReviews: number;
    freeCount: number;
    premiumCount: number;
}

export interface IWatchlistItem {
    id: string;
    userId: string;
    mediaId: string;
    createdAt?: string;
    media: IMovie;
}

export interface IWishlistToggleResult {
    added: boolean;
    data?: IWatchlistItem;
    message?: string;
}

