export interface IGenre {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreateGenreInput {
    name: string;
}

export interface IUpdateGenreInput {
    name: string;
}
