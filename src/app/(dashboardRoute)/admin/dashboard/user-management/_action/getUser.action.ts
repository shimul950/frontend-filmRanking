"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { cookies } from "next/headers";

export interface IUserListItem {
    id: string;
    name: string;
    email: string;
    image: string | null;
    status: "ACTIVE" | "BLOCKED" | "DELETED";
    emailVerified: boolean;
    isDeleted: boolean;
    createdAt: string;
}

export interface IUserListMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IGetUsersQuery {
    searchTerm?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export async function getUsersAction(
    query: IGetUsersQuery
): Promise<{ users: IUserListItem[]; meta: IUserListMeta } | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<IUserListItem[]>("/users", {
            headers: { Cookie: cookieHeader },
            params: {
                searchTerm: query.searchTerm || undefined,
                status: query.status || undefined,
                page: query.page ?? 1,
                limit: query.limit ?? 10,
            },
        });

        return {
            users: response.data,
            meta: (response as any).meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
        };
    } catch {
        return null;
    }
}