import { NextRequest, NextResponse } from "next/server";

// Simple HTTP Basic Auth guard for the whole dashboard.
// Username is fixed ("wilshire"); password is whatever is set in the
// DASHBOARD_PASSWORD env var at deploy time.
//
// /api/revalidate is exempt so the refresh button (and future webhooks)
// can bust the cache without authentication.

const USERNAME = "wilshire";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/revalidate")) {
    return NextResponse.next();
  }

  // Let platform health probes through without 401.
  if (req.method === "HEAD" && pathname === "/") {
    return NextResponse.next();
  }

  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) {
    return new NextResponse(
      "Service misconfigured: DASHBOARD_PASSWORD is not set.",
      { status: 503 }
    );
  }

  const header = req.headers.get("authorization");
  if (header && header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice("Basic ".length));
      const separator = decoded.indexOf(":");
      if (separator > 0) {
        const user = decoded.slice(0, separator);
        const pass = decoded.slice(separator + 1);
        if (user === USERNAME && pass === expected) {
          return NextResponse.next();
        }
      }
    } catch {
      // fall through to 401
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Wilshire Dashboard", charset="UTF-8"',
    },
  });
}

export const config = {
  // Match everything except Next.js static assets and the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
