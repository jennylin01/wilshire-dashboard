import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
} from "@/lib/auth";

// Constant-time-ish string comparison to avoid leaking timing info.
// The passwords here are short and the attack surface is tiny, but this
// is the right habit regardless.
function safeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const expected = process.env.DASHBOARD_PASSWORD;
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
      return NextResponse.json({ ok: false, error: "Password required" }, { status: 400 });
    }
    password = body.password;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  if (!safeEquals(password, expected)) {
    // Small delay to slow down online guessing.
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
