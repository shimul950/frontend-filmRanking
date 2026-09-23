import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const sessionToken = searchParams.get("sessionToken");
    const redirectPath = searchParams.get("redirect") || "/dashboard";

    const finalPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//") ? redirectPath : "/dashboard";

    if (!accessToken || !sessionToken) {
        return NextResponse.redirect(new URL("/login?error=oauth_missing_tokens", request.url));
    }

    const response = NextResponse.redirect(new URL(finalPath, request.url));
    const isSecure = request.nextUrl.protocol === "https:";

    // Set accessToken cookie (1 day)
    response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    // Set refreshToken cookie (7 days)
    if (refreshToken) {
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isSecure,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
    }

    // Set better-auth.session_token cookie (1 day)
    response.cookies.set("better-auth.session_token", sessionToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
    });

    return response;
}
