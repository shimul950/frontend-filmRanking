import { cookies } from "next/headers";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export function buildCookieHeader(cookieStore: CookieStore) {
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    const parts: string[] = [];
    if (sessionToken) parts.push(`better-auth.session_token=${sessionToken}`);
    if (accessToken) parts.push(`accessToken=${accessToken}`);
    if (refreshToken) parts.push(`refreshToken=${refreshToken}`);

    return parts.join("; ");
}

export function relaySetCookies(setCookieHeaders: string[] | undefined, cookieStore: CookieStore) {
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