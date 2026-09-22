export interface ICast {
    id: string;
    name: string;
    bio?: string | null;
    imageUrl?: string | null;
    birthDate?: string | null;
    nationality?: string | null;
    createdAt?: string;
    updatedAt?: string;
    media?: IMediaCast[];
}

export interface IMediaCast {
    mediaId: string;
    castId: string;
    characterName?: string | null;
    order?: number;
    cast?: ICast;
}

export interface ICastsResponseData {
    data: ICast[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
