import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const session = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");
    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Redirect authenticated users away from login
  if (pathname === "/auth/login") {
    const session = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
