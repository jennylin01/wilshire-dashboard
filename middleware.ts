import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  getSessionSecret,
  scopeCanAccessSlug,
  verifySession,
  type Scope,
} from "@/lib/auth";
import { getEngagement } from "@/lib/engagements";

// Guards every route except:
//   - /login page and /api/login (so users can actually log in)
//   - /api/revalidate (refresh button / future webhooks)
//   - /api/logout
//   - HEAD / (platform health probes)
//
// Redirects /program → /wilshire so the legacy client URL keeps working.
//
// Scope checks:
//   - /               → requires scope = motive
//   - /<slug>         → requires scope = motive OR client:<slug>
//   - /<unknown-slug> → 404 (handled by Next.js, not here)

function parsePath(pathname: string): { slug: string | null } {
  // Strip leading slash and take first segment.
  const seg = pathname.replace(/^\/+/, "").split("/")[0];
  if (!seg) return { slug: null };
  if (getEngagement(seg)) return { slug: seg };
  return { slug: null };
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Legacy alias: /program → /wilshire (preserves client bookmarks).
  if (pathname === "/program" || pathname.startsWith("/program/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/program/, "/wilshire");
    return NextResponse.redirect(url, 308);
  }

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

  const secret = getSessionSecret();
  if (!secret) {
    return new NextResponse(
      "Service misconfigured: SESSION_SECRET (or DASHBOARD_PASSWORD) is not set.",
      { status: 503 }
    );
  }

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  let scope: Scope | null = null;
  let reason: "no-cookie" | "invalid-session" | "forbidden" = "no-cookie";

  if (cookie) {
    const result = await verifySession(cookie, secret);
    if (result.ok && result.scope) {
      scope = result.scope;
    } else {
      reason = "invalid-session";
    }
  }

  if (scope) {
    // Enforce scope rules.
    const { slug } = parsePath(pathname);
    if (pathname === "/") {
      if (scope.kind === "motive") return NextResponse.next();
      reason = "forbidden";
    } else if (slug) {
      if (scopeCanAccessSlug(scope, slug)) return NextResponse.next();
      reason = "forbidden";
    } else {
      // Unknown path (e.g. /some-undefined-slug). Let Next.js handle (404).
      return NextResponse.next();
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  if (pathname !== "/") {
    url.searchParams.set("next", pathname + req.nextUrl.search);
  } else {
    url.searchParams.delete("next");
  }
  url.searchParams.set("reason", reason);
  const response = NextResponse.redirect(url);
  if (reason === "invalid-session" || reason === "forbidden") {
    response.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
