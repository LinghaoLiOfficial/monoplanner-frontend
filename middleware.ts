import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "ff_session";
const protectedRoutes = ["/dashboard"];
const authRoutes = ["/login"];

function matchesProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function matchesAuthRoute(pathname: string) {
  return authRoutes.some((route) => pathname === route);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  if (matchesProtectedRoute(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    const redirectTo = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    loginUrl.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  if (matchesAuthRoute(pathname) && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
