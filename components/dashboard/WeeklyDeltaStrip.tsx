"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";
import { ArrowUpRight, Pencil } from "lucide-react";
import type { Programme, WeeklyDelta } from "@/lib/types";

export function WeeklyDeltaStrip({
  delta,
  programme,
}: {
  delta: WeeklyDelta;
  programme: Programme;
}) {
  const { theme } = useTheme();
  const router = useRouter();
  const [isEditing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    headline: delta.headline,
    weekNumber: delta.weekNumber == null ? "" : String(delta.weekNumber),
    summary: delta.summary,
    risks: delta.risks,
    plan: delta.plan,
  });
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const canEdit = Boolean(delta.pageId);

  const sections: {
    key: "summary" | "risks" | "plan";
    label: string;
    body: string;
  }[] = [
    {
      key: "summary",
      label: `Summary status w/e ${delta.weekEnding}`,
      body: delta.summary,
    },
    { key: "risks", label: "Key risks / issues / blockers", body: delta.risks },
    { key: "plan", label: "Plan for next period", body: delta.plan },
  ];

  const startEdit = () => {
    setDraft({
      headline: delta.headline,
      weekNumber: delta.weekNumber == null ? "" : String(delta.weekNumber),
      summary: delta.summary,
      risks: delta.risks,
      plan: delta.plan,
    });
    setError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError(null);
  };

  const save = () => {
    if (!delta.pageId) return;
    setError(null);
    startSaving(async () => {
      try {
        const parsedWeek =
          draft.weekNumber.trim() === ""
            ? null
            : Number.parseFloat(draft.weekNumber);
        const res = await fetch("/api/weekly-delta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageId: delta.pageId,
            headline: draft.headline,
            weekNumber:
              typeof parsedWeek === "number" && Number.isFinite(parsedWeek)
                ? parsedWeek
                : null,
            summary: draft.summary,
            risks: draft.risks,
            plan: draft.plan,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          setError(json.error || `HTTP ${res.status}`);
          return;
        }
        setEditing(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    });
  };

  const sectionLabelStyle: React.CSSProperties = {
    fontFamily: fontStack,
    fontSize: "11px",
    fontWeight: 700,
    color: theme.muted,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    margin: "0 0 6px",
  };
  const sectionBodyStyle: React.CSSProperties = {
    fontFamily: fontStack,
    fontSize: "14px",
    color: theme.ink,
    margin: 0,
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  };
  const textareaStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: fontStack,
    fontSize: "14px",
    color: theme.ink,
    background: theme.surfaceElevated,
    border: `1px solid ${theme.accent}`,
    borderRadius: "3px",
    padding: "8px 10px",
    lineHeight: 1.5,
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.rule}`,
        borderRadius: "4px",
        padding: "16px 22px",
      }}
    >
      {/* Header row: This week · Wk N · weekOf · w/e Friday · edit/open */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: delta.headline || isEditing ? "10px" : "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: fontStack,
            fontSize: "12px",
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: theme.accent,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            This week
          </span>
          {delta.weekNumber != null && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: theme.muted,
                background: theme.surfaceElevated,
                border: `1px solid ${theme.rule}`,
                padding: "1px 8px",
                borderRadius: "999px",
                letterSpacing: "0.04em",
              }}
            >
              Wk {delta.weekNumber}
            </span>
          )}
          {delta.weekOf && delta.weekOf !== "—" && (
            <span style={{ color: theme.ink, fontWeight: 500 }}>
              {delta.weekOf}
            </span>
          )}
          {delta.weekEnding && delta.weekEnding !== "—" && (
            <span style={{ color: theme.mutedSoft }}>
              · w/e {delta.weekEnding}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: fontStack,
            fontSize: "12px",
            color: theme.mutedSoft,
          }}
        >
          {!isEditing && canEdit && (
            <button
              type="button"
              onClick={startEdit}
              aria-label="Edit weekly update inline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontFamily: fontStack,
                fontSize: "12px",
                fontWeight: 500,
                color: theme.accent,
                background: "transparent",
                cursor: "pointer",
                padding: "4px 10px",
                border: `1px solid ${theme.accent}`,
                borderRadius: "3px",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.accentSoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Pencil size={12} />
              Edit
            </button>
          )}
          {!isEditing && programme.weeklyDeltaUrl && (
            <a
              href={programme.weeklyDeltaUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open weekly update in Notion"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: 500,
                color: theme.muted,
                textDecoration: "none",
                padding: "4px 10px",
                border: `1px solid ${theme.rule}`,
                borderRadius: "3px",
                transition: "color 0.1s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = theme.ink;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  theme.muted;
              }}
            >
              Open in Notion
              <ArrowUpRight size={12} />
            </a>
          )}
        </div>
      </div>

      {/* Edit-only: Week number input alongside the existing header. */}
      {isEditing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <label style={{ ...sectionLabelStyle, margin: 0 }}>Week #</label>
          <input
            type="number"
            min={1}
            step={1}
            value={draft.weekNumber}
            onChange={(e) =>
              setDraft((d) => ({ ...d, weekNumber: e.target.value }))
            }
            placeholder="1"
            style={{
              width: "70px",
              fontFamily: fontStack,
              fontSize: "13px",
              color: theme.ink,
              background: theme.surfaceElevated,
              border: `1px solid ${theme.accent}`,
              borderRadius: "3px",
              padding: "4px 8px",
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Headline — bold line, no separate label. */}
      {(isEditing || delta.headline) && (
        <div style={{ marginBottom: "14px" }}>
          {isEditing ? (
            <input
              type="text"
              value={draft.headline}
              onChange={(e) =>
                setDraft((d) => ({ ...d, headline: e.target.value }))
              }
              placeholder="Headline (top-line exec message)"
              style={{
                width: "100%",
                fontFamily: fontStack,
                fontSize: "16px",
                fontWeight: 600,
                color: theme.ink,
                background: theme.surfaceElevated,
                border: `1px solid ${theme.accent}`,
                borderRadius: "3px",
                padding: "8px 10px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          ) : (
            <p
              style={{
                fontFamily: fontStack,
                fontSize: "16px",
                fontWeight: 600,
                color: theme.ink,
                margin: 0,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
              }}
            >
              {delta.headline}
            </p>
          )}
        </div>
      )}

      {/* Vertical stack for Summary / Risks / Plan — easier to read than
          a 3-column grid. */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {sections.map((s) => (
          <section key={s.key}>
            <h3 style={sectionLabelStyle}>{s.label}</h3>
            {isEditing ? (
              <textarea
                value={draft[s.key]}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, [s.key]: e.target.value }))
                }
                rows={Math.max(3, draft[s.key].split("\n").length + 1)}
                style={textareaStyle}
              />
            ) : (
              <p style={sectionBodyStyle}>{s.body || "—"}</p>
            )}
          </section>
        ))}
      </div>

      {isEditing && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {error && (
            <span
              style={{
                fontFamily: fontStack,
                fontSize: "13px",
                color: theme.red,
              }}
            >
              {error}
            </span>
          )}
          <button
            type="button"
            onClick={cancelEdit}
            disabled={saving}
            style={{
              fontFamily: fontStack,
              fontSize: "13px",
              fontWeight: 500,
              color: theme.muted,
              background: "transparent",
              border: `1px solid ${theme.rule}`,
              borderRadius: "3px",
              padding: "6px 14px",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            style={{
              fontFamily: fontStack,
              fontSize: "13px",
              fontWeight: 600,
              color: "#fff",
              background: theme.accent,
              border: `1px solid ${theme.accent}`,
              borderRadius: "3px",
              padding: "6px 14px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
