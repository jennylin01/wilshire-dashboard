// Session signing helpers. HMAC-SHA256 using DASHBOARD_PASSWORD as the secret.
//
// Cookie value format: "<issuedAtUnix>.<base64url-signature>"
//
// Security properties:
//   - Tamper-evident: changing the timestamp invalidates the signature.
//   - Rotates on password change: HMAC secret IS the password, so updating
//     DASHBOARD_PASSWORD in Render immediately logs everyone out.
//   - Expires after `maxAgeSeconds` (default 7 days).
//   - httpOnly + sameSite=strict cookie; never readable from client JS.
//
// Edge-runtime compatible (Web Crypto, TextEncoder, atob/btoa).

export const SESSION_COOKIE = "wilshire_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Single source of truth for the dashboard password. Trims whitespace so an
// accidental trailing newline in the Render env var UI doesn't break auth.
// Returns null if not set.
export function getDashboardPassword(): string | null {
  const raw = process.env.DASHBOARD_PASSWORD;
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
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

function fromBase64Url(s: string): ArrayBuffer {
  let b = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b.length % 4) b += "=";
  const bin = atob(b);
  const buf = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
  return buf;
}

// Sign an arbitrary string value. Exposed so both signSession and the
// middleware's diagnostic re-sign can share one code path.
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

export async function signSession(secret: string): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const sig = await signString(issuedAt, secret);
  return `${issuedAt}.${sig}`;
}

export async function verifySession(
  token: string,
  secret: string,
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS
): Promise<boolean> {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const issuedAt = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  const ts = parseInt(issuedAt, 10);
  if (!Number.isFinite(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (now - ts > maxAgeSeconds) return false;
  if (ts > now + 60) return false; // clock skew tolerance
  const key = await hmacKey(secret);
  try {
    return await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sigB64),
      new TextEncoder().encode(issuedAt)
    );
  } catch {
    return false;
  }
}
