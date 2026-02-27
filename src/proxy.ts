import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible proxy (replaces middleware).
 * Does NOT import auth.ts (which uses MongoDB/bcrypt).
 * Instead, checks for the session token cookie directly.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow webhook endpoints without auth
  if (pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  // Allow auth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Allow login page
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // Allow public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for session token (NextAuth.js v5 uses this cookie name)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect API routes
  if (pathname.startsWith("/api") && !sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/",
  ],
};
