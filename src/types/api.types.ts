export interface ApiResponse<TData = unknown> {
    data: TData;
    success: boolean;
    messsage: string;
    meta?: PaginationMeta;
}

export interface PaginationMeta{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
}

export interface ApiErrorResponse {
    success: boolean;
    messsage: string;
}