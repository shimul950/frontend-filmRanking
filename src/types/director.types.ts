export interface IDirector {
    id: string;
    name: string;
    bio?: string | null;
    imageUrl?: string | null;
    birthDate?: string | null;
    nationality?: string | null;
    createdAt?: string;
    updatedAt?: string;
    media?: IMediaDirector[];
}

export interface IMediaDirector {
    mediaId: string;
    directorId: string;
    director?: IDirector;
}

export interface IDirectorsResponseData {
    data: IDirector[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
