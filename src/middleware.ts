import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  const isAdminSubdomain =
    hostname.startsWith("admin.") ||
    hostname.includes("admin.localhost");

  if (isAdminSubdomain) {
    if (
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/admin") &&
      pathname !== "/favicon.ico"
    ) {
      return NextResponse.rewrite(
        new URL(`/admin${pathname === "/" ? "" : pathname}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
