// Session signing helpers. HMAC-SHA256 using a server-side secret.
//
// Cookie value format: "<scope>|<issuedAtUnix>.<base64url-signature>"
//   e.g.  "motive|1714000000.abc..."
//   e.g.  "client:wilshire|1714000000.abc..."
//
// Scope semantics:
//   - "motive"          → can read the master hub (/) and ANY client dashboard
//   - "client:<slug>"   → can read only /<slug> (and aliases like /program)
//
// Security properties:
//   - Tamper-evident: changing scope or timestamp invalidates the signature.
//   - HMAC secret is SESSION_SECRET env var (preferred) or DASHBOARD_PASSWORD
//     (legacy fallback). Rotating the secret immediately logs everyone out.
//   - Expires after `maxAgeSeconds` (default 7 days).
//   - httpOnly + sameSite=lax cookie; never readable from client JS.
//
// Edge-runtime compatible (Web Crypto, TextEncoder, atob/btoa).

export const SESSION_COOKIE = "wilshire_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type Scope =
  | { kind: "motive" }
  | { kind: "client"; slug: string };

export function scopeToString(s: Scope): string {
  return s.kind === "motive" ? "motive" : `client:${s.slug}`;
}

export function parseScope(raw: string): Scope | null {
  if (raw === "motive") return { kind: "motive" };
  if (raw.startsWith("client:")) {
    const slug = raw.slice("client:".length);
    if (!/^[a-z0-9-]+$/.test(slug)) return null;
    return { kind: "client", slug };
  }
  return null;
}

// True if the given scope grants access to the given engagement slug.
// Motive scope = everything. Client scope = only its own slug.
export function scopeCanAccessSlug(scope: Scope, slug: string): boolean {
  if (scope.kind === "motive") return true;
  return scope.kind === "client" && scope.slug === slug;
}

// The HMAC secret. Prefers SESSION_SECRET; falls back to DASHBOARD_PASSWORD
// for migration from the single-tenant setup.
export function getSessionSecret(): string | null {
  const preferred = process.env.SESSION_SECRET?.trim();
  if (preferred && preferred.length > 0) return preferred;
  const legacy = process.env.DASHBOARD_PASSWORD?.trim();
  if (legacy && legacy.length > 0) return legacy;
  return null;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return view;
}

export async function signString(
  value: string,
  secret: string
): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );
  return toBase64Url(sig);
}

export async function signSession(
  scope: Scope,
  secret: string
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const scopeStr = scopeToString(scope);
  // Signed payload = "<scope>|<issuedAt>". Anything else is tamper-evident.
  const payload = `${scopeStr}|${issuedAt}`;
  const sig = await signString(payload, secret);
  return `${scopeStr}|${issuedAt}.${sig}`;
}

export interface VerifyResult {
  ok: boolean;
  scope?: Scope;
  reason?: string;
  detail?: string;
}

export async function verifySession(
  token: string,
  secret: string,
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS
): Promise<VerifyResult> {
  // Expected format: "<scope>|<issuedAt>.<sig>"
  const pipe = token.indexOf("|");
  if (pipe <= 0) return { ok: false, reason: "no-pipe" };
  const scopeStr = token.slice(0, pipe);
  const rest = token.slice(pipe + 1);
  const dot = rest.indexOf(".");
  if (dot <= 0) return { ok: false, reason: "no-dot" };
  const issuedAt = rest.slice(0, dot);
  const sigB64 = rest.slice(dot + 1);

  const scope = parseScope(scopeStr);
  if (!scope) return { ok: false, reason: "bad-scope" };

  const ts = parseInt(issuedAt, 10);
  if (!Number.isFinite(ts)) return { ok: false, reason: "bad-ts" };
  const now = Math.floor(Date.now() / 1000);
  if (now - ts > maxAgeSeconds) {
    return { ok: false, reason: "expired", detail: `now-ts=${now - ts}` };
  }
  if (ts - now > 86400) {
    return { ok: false, reason: "future", detail: `ts-now=${ts - now}` };
  }

  const payload = `${scopeStr}|${issuedAt}`;
  const key = await hmacKey(secret);
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sigB64) as unknown as BufferSource,
      new TextEncoder().encode(payload)
    );
    return ok
      ? { ok: true, scope }
      : { ok: false, reason: "hmac-fail" };
  } catch (e) {
    return {
      ok: false,
      reason: "hmac-throw",
      detail: e instanceof Error ? e.message : String(e),
    };
  }
}
