"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { fontStack, monoStack } from "@/lib/theme";

export function LoginForm() {
  const { theme, mode, toggle } = useTheme();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "";

  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const reason = params.get("reason");
  const initialBanner =
    reason === "invalid-session"
      ? "Your session was rejected by the server. Sign in again."
      : reason === "forbidden"
        ? "Your account doesn't have access to that page. Sign in with the right password."
        : null;
  const [error, setError] = useState<string | null>(initialBanner);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      // Forward ?next= to the login API so it can validate the scope match.
      const url = next ? `/api/login?next=${encodeURIComponent(next)}` : "/api/login";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const body = (await res.json().catch(() => ({}))) as { redirectTo?: string };
        // Hard navigation so the browser picks up the fresh session cookie.
        const dest =
          body.redirectTo && body.redirectTo.startsWith("/")
            ? body.redirectTo
            : "/";
        window.location.href = dest;
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      // Include the HTTP status on screen so a non-technical user can report
      // it back without needing DevTools.
      setError(`[${res.status}] ${body.error || "Login failed"}`);
      setSubmitting(false);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.ink,
        fontFamily: fontStack,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Minimal top bar */}
      <div
        style={{
          borderBottom: `1px solid ${theme.rule}`,
          padding: "14px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: theme.ink,
            letterSpacing: "-0.02em",
          }}
        >
          Motive
          <span style={{ color: theme.muted, fontWeight: 400 }}> · Create</span>
        </div>
        <button
          onClick={toggle}
          style={{
            background: "transparent",
            border: `1px solid ${theme.rule}`,
            borderRadius: "3px",
            color: theme.muted,
            fontFamily: monoStack,
            fontSize: "11px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
          aria-label={mode === "dark" ? "Switch to light" : "Switch to dark"}
        >
          {mode === "dark" ? "☀" : "☾"}
        </button>
      </div>

      {/* Centered card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            width: "100%",
            maxWidth: "380px",
            background: theme.surface,
            border: `1px solid ${theme.rule}`,
            borderRadius: "6px",
            padding: "36px 36px 32px",
            boxShadow:
              mode === "dark"
                ? "0 20px 60px rgba(0,0,0,0.4)"
                : "0 20px 60px rgba(10,10,10,0.06)",
          }}
        >
          <div
            style={{
              fontFamily: monoStack,
              fontSize: "11px",
              color: theme.accent,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            Motive Create &middot; Delivery
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              color: theme.ink,
            }}
          >
            Engagement dashboard
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: theme.muted,
              margin: "0 0 28px",
              lineHeight: 1.5,
            }}
          >
            Enter your password to view the dashboard.
          </p>

          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: "12px",
              color: theme.muted,
              fontWeight: 500,
              marginBottom: "8px",
              letterSpacing: "-0.005em",
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "11px 14px",
              fontSize: "15px",
              fontFamily: fontStack,
              color: theme.ink,
              background: theme.bg,
              border: `1px solid ${error ? theme.red : theme.rule}`,
              borderRadius: "4px",
              outline: "none",
              transition: "border-color 0.15s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              if (!error) e.currentTarget.style.borderColor = theme.accent;
            }}
            onBlur={(e) => {
              if (!error) e.currentTarget.style.borderColor = theme.rule;
            }}
          />

          {error && (
            <div
              style={{
                fontSize: "13px",
                color: theme.red,
                marginTop: "10px",
                lineHeight: 1.4,
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !password}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "12px 16px",
              fontSize: "15px",
              fontFamily: fontStack,
              fontWeight: 600,
              color: "#ffffff",
              background: submitting || !password ? theme.muted : theme.accent,
              border: "none",
              borderRadius: "4px",
              cursor: submitting || !password ? "not-allowed" : "pointer",
              letterSpacing: "-0.005em",
              transition: "background 0.15s",
            }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: `1px solid ${theme.ruleSoft}`,
              fontSize: "12px",
              color: theme.muted,
              lineHeight: 1.5,
            }}
          >
            Access is restricted. Contact your Motive Create PM for
            credentials.
          </div>
        </form>
      </div>

      {/* Minimal footer */}
      <div
        style={{
          borderTop: `1px solid ${theme.rule}`,
          padding: "16px 40px",
          fontFamily: monoStack,
          fontSize: "11px",
          color: theme.mutedSoft,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>Motive Create &middot; 2026</div>
        <div>Confidential</div>
      </div>
    </div>
  );
}
