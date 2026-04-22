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
    pathname.startsWith("/api/revalidate") ||
    pathname.startsWith("/api/diag")
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
  let reason: "no-cookie" | "invalid-session" = "no-cookie";
  if (cookie) {
    const ok = await verifySession(cookie, expected);
    if (ok) return NextResponse.next();
    reason = "invalid-session";
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
  // If the cookie was present but invalid, actively delete it so the next
  // login isn't polluted by a cookie from a previous deploy / password.
  if (reason === "invalid-session") {
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
