"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";

export async function logoutAction() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const parts: string[] = [];
    if (sessionToken) parts.push(`better-auth.session_token=${sessionToken}`);
    if (accessToken) parts.push(`accessToken=${accessToken}`);
    if (refreshToken) parts.push(`refreshToken=${refreshToken}`);
    const cookieHeader = parts.join("; ");

    if (cookieHeader) {
        try {
            await httpClient.post("/auth/logout", {}, {
                headers: { Cookie: cookieHeader },
            });
        } catch (error) {
            // best effort backend logout
        }
    }

    cookieStore.delete({ name: "accessToken", path: "/" });
    cookieStore.delete({ name: "refreshToken", path: "/" });
    cookieStore.delete({ name: "better-auth.session_token", path: "/" });

    // Also call standard delete for maximum compatibility
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");

    return { success: true };
}
