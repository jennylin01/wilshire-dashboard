import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  getDashboardPassword,
  signString,
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
  let diagReSig: string | null = null;
  let diagCookieSig: string | null = null;
  if (cookie) {
    const ok = await verifySession(cookie, expected);
    if (ok) return NextResponse.next();
    reason = "invalid-session";
    // TEMP diagnostic: re-sign the cookie's timestamp ourselves and compare
    // to the signature in the cookie. If they differ, HMAC behaves differently
    // in this runtime than in the /api/login runtime.
    const dot = cookie.indexOf(".");
    if (dot > 0) {
      const ts = cookie.slice(0, dot);
      diagCookieSig = cookie.slice(dot + 1);
      try {
        diagReSig = await signString(ts, expected);
      } catch {
        diagReSig = "ERR";
      }
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
  url.searchParams.set("mwLen", String(expected.length));
  if (expected.length > 0) {
    url.searchParams.set("mwFirst", String(expected.charCodeAt(0)));
    url.searchParams.set(
      "mwLast",
      String(expected.charCodeAt(expected.length - 1))
    );
  }
  if (diagCookieSig) url.searchParams.set("cSig", diagCookieSig.slice(0, 12));
  if (diagReSig) url.searchParams.set("mwSig", diagReSig.slice(0, 12));
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
