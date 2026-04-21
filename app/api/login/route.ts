import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  getDashboardPassword,
  signSession,
} from "@/lib/auth";

// Constant-time-ish string comparison to avoid leaking timing info.
function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const expected = getDashboardPassword();
  if (!expected) {
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
    // Trim user input too — invisible characters from autofill or mobile
    // keyboards have caused login failures for real users.
    password = body.password.trim();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bad request" },
      { status: 400 }
    );
  }

  if (!safeEquals(password, expected)) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json(
      { ok: false, error: "Wrong password" },
      { status: 401 }
    );
  }

  const token = await signSession(expected);
  const res = NextResponse.json({ ok: true });
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
