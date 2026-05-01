"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Gavel,
  Pencil,
} from "lucide-react";
import type { Programme, WeeklyDelta } from "@/lib/types";

// Pull a RAG state out of free-text headlines like "Overall RAG: Red" or
// "Status: Amber". Returns null if no recognizable token is present.
function detectRag(text: string): "red" | "amber" | "green" | null {
  const m = text.match(/\b(red|amber|yellow|green)\b/i);
  if (!m) return null;
  const tok = m[1].toLowerCase();
  if (tok === "red") return "red";
  if (tok === "green") return "green";
  return "amber"; // amber + yellow both map to amber
}

// Render a body string as a hanging-indent list when it looks like one
// ("1.", "•", "-", "*" line starts). Otherwise renders as plain text.
function renderBody(body: string): React.ReactNode {
  if (!body) return "—";
  const lines = body.split("\n").filter((l) => l.trim() !== "");
  const isList = lines.length > 1 && lines.every((l) => /^\s*([0-9]+[.)]|[-•*])\s+/.test(l));
  if (!isList) return body;
  return (
    <ul style={{ margin: 0, paddingLeft: "20px" }}>
      {lines.map((l, i) => (
        <li key={i} style={{ marginBottom: "4px" }}>
          {l.replace(/^\s*([0-9]+[.)]|[-•*])\s+/, "")}
        </li>
      ))}
    </ul>
  );
}

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
    progress: delta.progress,
    risks: delta.risks,
    keyDecision: delta.keyDecision,
    plan: delta.plan,
    rag: (delta.rag ?? "") as "" | "Red" | "Amber" | "Green",
  });
  const [saving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const canEdit = Boolean(delta.pageId);

  // Prefer the explicit RAG select column if set; otherwise fall back to
  // detecting a token in the Headline text (legacy behavior).
  const rag = delta.rag
    ? (delta.rag.toLowerCase() as "red" | "amber" | "green")
    : detectRag(delta.headline);
  const ragColor =
    rag === "red"
      ? theme.red
      : rag === "amber"
        ? theme.amber
        : rag === "green"
          ? theme.green
          : theme.accent;
  const ragBg =
    rag === "red"
      ? theme.redBg
      : rag === "amber"
        ? theme.amberBg
        : rag === "green"
          ? theme.greenBg
          : theme.accentSoft;

  const sections: {
    key: "summary" | "progress" | "risks" | "keyDecision" | "plan";
    label: string;
    body: string;
    Icon: typeof FileText;
    accent: string;
  }[] = [
    {
      key: "summary",
      label: `Summary status w/e ${delta.weekEnding}`,
      body: delta.summary,
      Icon: FileText,
      accent: theme.accent,
    },
    {
      key: "progress",
      label: "This week's progress",
      body: delta.progress,
      Icon: Activity,
      accent: theme.green,
    },
    {
      key: "risks",
      label: "Key risks / issues / blockers",
      body: delta.risks,
      Icon: AlertTriangle,
      accent: theme.amber,
    },
    {
      key: "keyDecision",
      label: "Key decisions",
      body: delta.keyDecision,
      Icon: Gavel,
      accent: theme.accent,
    },
    {
      key: "plan",
      label: "Plan for next week",
      body: delta.plan,
      Icon: ArrowRight,
      accent: theme.accent,
    },
  ];

  const startEdit = () => {
    setDraft({
      headline: delta.headline,
      weekNumber: delta.weekNumber == null ? "" : String(delta.weekNumber),
      summary: delta.summary,
      progress: delta.progress,
      risks: delta.risks,
      keyDecision: delta.keyDecision,
      plan: delta.plan,
      rag: (delta.rag ?? "") as "" | "Red" | "Amber" | "Green",
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
            progress: draft.progress,
            risks: draft.risks,
            keyDecision: draft.keyDecision,
            plan: draft.plan,
            rag: draft.rag === "" ? null : draft.rag,
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
        borderLeft: `4px solid ${ragColor}`,
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
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 700,
              color: ragColor,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span
              aria-hidden
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: ragColor,
                boxShadow: `0 0 0 3px ${ragBg}`,
              }}
            />
            This week
            {rag && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: ragColor,
                  background: ragBg,
                  padding: "1px 6px",
                  borderRadius: "3px",
                }}
              >
                {rag}
              </span>
            )}
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

      {/* Edit-only: Week number + RAG inputs alongside the existing header. */}
      {isEditing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ ...sectionLabelStyle, margin: 0 }}>Week #</label>
            <input
              type="number"
              min={0}
              step={1}
              value={draft.weekNumber}
              onChange={(e) =>
                setDraft((d) => ({ ...d, weekNumber: e.target.value }))
              }
              placeholder="0"
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ ...sectionLabelStyle, margin: 0 }}>RAG</label>
            <select
              value={draft.rag}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  rag: e.target.value as typeof d.rag,
                }))
              }
              style={{
                fontFamily: fontStack,
                fontSize: "13px",
                color: theme.ink,
                background: theme.surfaceElevated,
                border: `1px solid ${theme.accent}`,
                borderRadius: "3px",
                padding: "4px 8px",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="">Auto (from headline)</option>
              <option value="Red">Red</option>
              <option value="Amber">Amber</option>
              <option value="Green">Green</option>
            </select>
          </div>
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
        {sections.map((s) => {
          const Icon = s.Icon;
          return (
            <section
              key={s.key}
              style={
                isEditing
                  ? undefined
                  : {
                      borderLeft: `2px solid ${s.accent}`,
                      paddingLeft: "12px",
                    }
              }
            >
              <h3
                style={{
                  ...sectionLabelStyle,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: s.accent,
                }}
              >
                <Icon size={12} />
                {s.label}
              </h3>
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
                <div style={sectionBodyStyle}>{renderBody(s.body)}</div>
              )}
            </section>
          );
        })}
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
