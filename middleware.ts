import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  getDashboardPassword,
  verifySession,
} from "@/lib/auth";

// Guards every route except:
//   - /login page and /api/login (so users can actually log in)
//   - /api/revalidate (refresh button / future webhooks)
//   - HEAD / (platform health probes)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/logout") ||
    pathname.startsWith("/api/revalidate")
  ) {
    return NextResponse.next();
  }

  if (req.method === "HEAD" && pathname === "/") {
    return NextResponse.next();
  }

  const expected = getDashboardPassword();
  if (!expected) {
    return new NextResponse(
      "Service misconfigured: DASHBOARD_PASSWORD is not set.",
      { status: 503 }
    );
  }

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookie && (await verifySession(cookie, expected))) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  // Preserve the destination so we can send them back after login.
  if (pathname !== "/") {
    url.searchParams.set("next", pathname + req.nextUrl.search);
  } else {
    url.searchParams.delete("next");
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
