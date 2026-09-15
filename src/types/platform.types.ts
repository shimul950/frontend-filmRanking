export interface IPlatform {
    id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreatePlatformInput {
    name: string;
}

export interface IUpdatePlatformInput {
    name?: string;
}
