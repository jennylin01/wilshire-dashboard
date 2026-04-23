import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  getSessionSecret,
  signSession,
  type Scope,
} from "@/lib/auth";
import { findEngagementByPassword } from "@/lib/engagements";

function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function getMotivePassword(): string | null {
  const raw = process.env.MOTIVE_PASSWORD?.trim();
  return raw && raw.length > 0 ? raw : null;
}

export async function POST(req: NextRequest) {
  const secret = getSessionSecret();
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Service misconfigured" },
      { status: 503 }
    );
  }

  let password: string;
  try {
    const body = (await req.json()) as { password?: unknown };
    if (typeof body.password !== "string" || body.password.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Password required" },
        { status: 400 }
      );
    }
    password = body.password.trim();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request" },
      { status: 400 }
    );
  }

  // Try Motive master password first.
  let scope: Scope | null = null;
  let redirectTo: string = "/";
  const motive = getMotivePassword();
  if (motive && safeEquals(password, motive)) {
    scope = { kind: "motive" };
    redirectTo = "/";
  } else {
    // Try each client password.
    const matchedSlug = findEngagementByPassword(password);
    if (matchedSlug) {
      scope = { kind: "client", slug: matchedSlug };
      redirectTo = `/${matchedSlug}`;
    }
  }

  if (!scope) {
    // Constant-time-ish delay regardless of which comparison failed.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { ok: false, error: "Wrong password" },
      { status: 401 }
    );
  }

  const token = await signSession(scope, secret);
  // Respect ?next= only if it targets a path this scope is allowed to reach.
  const nextParam = req.nextUrl.searchParams.get("next");
  if (nextParam && nextParam.startsWith("/")) {
    if (scope.kind === "motive") {
      redirectTo = nextParam;
    } else if (
      nextParam === `/${scope.slug}` ||
      nextParam.startsWith(`/${scope.slug}/`) ||
      nextParam === "/program" ||
      nextParam.startsWith("/program")
    ) {
      redirectTo = nextParam;
    }
  }

  const res = NextResponse.json({ ok: true, redirectTo });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}
