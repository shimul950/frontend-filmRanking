"use server"

import { httpClient } from "@/lib/axios/httpClient";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

export interface IMeUser {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    image?: string | null;
    emailVerified: boolean;
    status: string;
}

function buildCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const parts: string[] = [];
    if (sessionToken) parts.push(`better-auth.session_token=${sessionToken}`);
    if (accessToken) parts.push(`accessToken=${accessToken}`);
    if (refreshToken) parts.push(`refreshToken=${refreshToken}`);

    return parts.join("; ");
}

// Parses raw Set-Cookie strings from the backend's response and re-sets
// them on Next's own cookie store, so the browser actually receives the
// refreshed tokens. We only carry over name/value + max-age — httpOnly/
// secure/sameSite are re-applied ourselves since Next's cookies().set()
// needs them passed explicitly, not as a raw Set-Cookie string.
function relaySetCookies(
    setCookieHeaders: string[] | undefined,
    cookieStore: Awaited<ReturnType<typeof cookies>>
) {
    if (!setCookieHeaders) return;

    for (const raw of setCookieHeaders) {
        const [nameValue, ...attrs] = raw.split(";").map((s) => s.trim());
        const eqIndex = nameValue.indexOf("=");
        if (eqIndex === -1) continue;

        const name = nameValue.slice(0, eqIndex);
        const value = nameValue.slice(eqIndex + 1);

        const maxAgeAttr = attrs.find((a) => a.toLowerCase().startsWith("max-age="));
        const maxAge = maxAgeAttr ? parseInt(maxAgeAttr.split("=")[1], 10) : undefined;

        cookieStore.set(name, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            ...(maxAge ? { maxAge } : {}),
        });
    }
}

async function refreshTokens(cookieStore: Awaited<ReturnType<typeof cookies>>): Promise<string | null> {
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!refreshToken) return null;

    const parts: string[] = [`refreshToken=${refreshToken}`];
    if (sessionToken) parts.push(`better-auth.session_token=${sessionToken}`);

    try {
        const response = await httpClient.postRaw(
            "/auth/refresh-token",
            {},
            { headers: { Cookie: parts.join("; ") } }
        );

        const rawHeaders = response.headers?.["set-cookie"];
        relaySetCookies(rawHeaders, cookieStore);

        return cookieStore.get("accessToken")?.value ?? null;
    } catch {
        return null;
    }
}

export async function getMeAction(): Promise<IMeUser | null> {
    const cookieStore = await cookies();
    const cookieHeader = buildCookieHeader(cookieStore);

    if (!cookieHeader) return null;

    try {
        const response = await httpClient.get<IMeUser>("/auth/getme", {
            headers: { Cookie: cookieHeader },
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
            const refreshed = await refreshTokens(cookieStore);
            if (!refreshed) return null;

            const newCookieHeader = buildCookieHeader(cookieStore);
            try {
                const retryResponse = await httpClient.get<IMeUser>("/auth/getme", {
                    headers: { Cookie: newCookieHeader },
                });
                return retryResponse.data;
            } catch {
                return null;
            }
        }
        return null;
    }
}