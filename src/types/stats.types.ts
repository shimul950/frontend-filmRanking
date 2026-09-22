import { IReview, IWatchlistItem } from "./movie.types";

export interface IUserOverviewData {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    image?: string | null;
    status: string;
    createdAt?: string;
}

export interface IUserStatsData {
    userData: IUserOverviewData;
    reviewCount: number;
    commentCount: number;
    wishlistCount: number;
    recentReviews?: IReview[];
    recentWatchlist?: IWatchlistItem[];
}

export interface IUserStatsResponse {
    success: boolean;
    message: string;
    data: IUserStatsData;
}

export interface IAdminOverviewStats {
    totalUsers: number;
    totalMedia: number;
    totalGenres: number;
    totalPlatforms: number;
    totalWishlists: number;
    totalPayments: number;
    totalReviews: number;
    totalRevenue: number;
    averageRating: number;
}

export interface IRatingDistributionItem {
    name: string;
    value: number;
}

export interface IReviewGrowthItem {
    month: string;
    reviews: number;
}

export interface IMostReviewedMovieItem {
    id?: string;
    movie: string;
    reviews: number;
    posterUrl?: string | null;
    releaseYear?: number | null;
    averageRating?: number;
}

export interface IAdminChartsData {
    ratingDistributionPieChart: IRatingDistributionItem[];
    reviewGrowthLineChart: IReviewGrowthItem[];
    mostReviewedMoviesBarChart: IMostReviewedMovieItem[];
}

export interface IRecentUserItem {
    id: string;
    name: string;
    email?: string;
    image?: string | null;
    role?: string;
    status?: string;
    createdAt: string;
}

export interface IRecentReviewItem {
    id: string;
    rating: number;
    content?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED" | string;
    createdAt: string;
    user?: {
        id?: string;
        name: string;
        email?: string;
        image?: string | null;
    };
    media?: {
        id?: string;
        title: string;
        posterUrl?: string | null;
    };
}

export interface IRecentPaymentItem {
    id: string;
    amount: number;
    currency?: string;
    provider?: string;
    status?: "PAID" | "PENDING" | "FAILED" | "REFUNDED" | string;
    transactionId?: string | null;
    createdAt: string;
    user?: {
        id?: string;
        name: string;
        email?: string;
        image?: string | null;
    };
    media?: {
        id?: string;
        title: string;
        posterUrl?: string | null;
    };
}

export interface IAdminRecentActivities {
    recentUsers?: IRecentUserItem[];
    recentReviews?: IRecentReviewItem[];
    recentPayments?: IRecentPaymentItem[];
    recentUsersCount?: IRecentUserItem[];
    recentReviewsCount?: IRecentReviewItem[];
    recentPaymentsCount?: IRecentPaymentItem[];
}

export interface IAdminStatsData {
    overview: IAdminOverviewStats;
    charts: IAdminChartsData;
    recentActivities: IAdminRecentActivities;
}

export interface IAdminStatsResponse {
    success: boolean;
    message: string;
    data: IAdminStatsData;
}
