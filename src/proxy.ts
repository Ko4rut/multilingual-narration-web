import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, validSession } from "@/features/auth/session";

export function proxy(request: NextRequest) {
  if (!validSession(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/pois/:path*", "/poi-content/:path*", "/audio/:path*", "/users/:path*", "/roles/:path*", "/languages/:path*", "/settings/:path*"],
};
