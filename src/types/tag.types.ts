export interface ITag {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreateTagInput {
    name: string;
}

export interface IUpdateTagInput {
    name?: string;
}
