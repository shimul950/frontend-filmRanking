"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { buildCookieHeader } from "@/lib/cookie-relay";
import { cookies } from "next/headers";

export interface IAdminListItem {
    id: string;         // Admin record's own PK — use for updateAdmin/softDeleteAdmin
    userId: string;      // underlying User's id — use for changeUserStatus/changeUserRole
    name: string;
    email: string;
    image: string | null;
    contactNumber: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export async function getAllAdminsAction(): Promise<IAdminListItem[] | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<IAdminListItem[]>("/admins", {
            headers: { Cookie: cookieHeader },
        });
        return response.data;
    } catch {
        return null;
    }
}