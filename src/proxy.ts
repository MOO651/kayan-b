import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const intlMiddleware = createMiddleware(routing);

async function hasValidSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return (await verifySessionToken(token)) !== null;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin area — session guard (no locale prefix)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const authenticated = await hasValidSession(request);
    if (pathname === "/admin/login") {
      if (authenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }
    if (!authenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Public site — locale negotiation + routing
  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals, and files with an extension
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
