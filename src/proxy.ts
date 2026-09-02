import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type Role = "ADMIN" | "USER" | "SUPER_ADMIN"

const rolePermissions: Record<string, Role[]> = {
  "/super-admin": ["SUPER_ADMIN"],
  "/admin": ["ADMIN" , "SUPER_ADMIN"],
  "/user" : ["USER", "ADMIN"]
};

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // Not logged in
  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { userId: string; role: Role };

    const pathname = request.nextUrl.pathname;

    for (const [route, allowedRoles] of Object.entries(
      rolePermissions
    )) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(decoded.role)) {
          return NextResponse.redirect(
            new URL("/unauthorized", request.url)
          );
        }
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*"
  ],
};