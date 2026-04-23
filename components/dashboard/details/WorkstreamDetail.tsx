"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { fontStack, monoStack, ragBg, ragColor } from "@/lib/theme";
import type { Risk, Task, ValueMetric, Workstream } from "@/lib/types";

function matchesWorkstream(raw: string, matchers: string[]): boolean {
  const s = (raw || "").toLowerCase();
  if (!s) return false;
  return matchers.some((m) => s.includes(m.toLowerCase()));
}

function statusColor(
  theme: ReturnType<typeof useTheme>["theme"],
  status: string
): string {
  const s = status.toLowerCase();
  if (s.includes("done") || s.includes("complete") || s.includes("shipped"))
    return theme.green;
  if (s.includes("progress")) return theme.accent;
  if (s.includes("block")) return theme.red;
  return theme.muted;
}

export function WorkstreamDetail({
  ws,
  risks,
  metrics,
  tasks,
  notionUrl,
  onClose,
}: {
  ws: Workstream;
  risks: Risk[];
  metrics: ValueMetric[];
  tasks: Task[];
  notionUrl: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();

  const wsRisks = risks.filter((r) => matchesWorkstream(r.ws, ws.matchers));
  const wsMetrics = metrics.filter((v) => v.ws === ws.short);
  const wsTasks = tasks.filter((t) =>
    matchesWorkstream(t.workstream, ws.matchers)
  );

  // Group tasks by Sub-workstream. Tasks with no Sub-workstream land under
  // a bucket keyed by empty string, which we render last as "Other / general".
  const grouped = new Map<string, Task[]>();
  for (const t of wsTasks) {
    const key = t.subWorkstream || "";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(t);
  }
  const subKeys = Array.from(grouped.keys())
    .filter((k) => k !== "")
    .sort();
  const otherTasks = grouped.get("") ?? [];

  // Show agent breakdown only if at least one task has a Sub-workstream.
  const hasAgentBreakdown = subKeys.length > 0;

  return (
    <DetailPanel
      title={ws.name}
      subtitle={`Workstream · ${ws.short}`}
      notionUrl={notionUrl}
      onClose={onClose}
    >
      <p
        style={{
          fontFamily: fontStack,
          fontSize: "17px",
          color: theme.inkSoft,
          lineHeight: 1.5,
          marginTop: 0,
          marginBottom: "24px",
        }}
      >
        {ws.thesis}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            background: ragBg(theme, ws.rag),
            border: `1px solid ${ragColor(theme, ws.rag)}`,
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontFamily: fontStack,
              color: theme.muted,
              marginBottom: "4px",
              fontWeight: 500,
            }}
          >
            RAG
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "18px",
              color: ragColor(theme, ws.rag),
              textTransform: "capitalize",
              fontWeight: 600,
            }}
          >
            {ws.rag}
          </div>
        </div>
        <div
          style={{
            padding: "14px 16px",
            background: theme.surfaceElevated,
            border: `1px solid ${theme.rule}`,
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontFamily: fontStack,
              color: theme.muted,
              marginBottom: "4px",
              fontWeight: 500,
            }}
          >
            Lead / sponsor
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "15px",
              color: theme.ink,
              fontWeight: 500,
            }}
          >
            {ws.lead}
          </div>
          <div
            style={{ fontSize: "14px", color: theme.muted, marginTop: "2px" }}
          >
            Sponsor: {ws.sponsor}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "8px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Tasks", value: ws.committed, color: theme.ink },
          { label: "Done", value: ws.done, color: theme.green },
          { label: "In prog.", value: ws.inProgress, color: theme.amber },
          { label: "Blocked", value: ws.blocked, color: theme.red },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              padding: "12px",
              background: theme.surface,
              border: `1px solid ${theme.rule}`,
              textAlign: "center",
              borderRadius: "3px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontFamily: fontStack,
                color: theme.muted,
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontFamily: fontStack,
                fontSize: "22px",
                color: k.color,
                fontWeight: 600,
              }}
            >
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {hasAgentBreakdown && (
        <>
          <SectionHeader
            label={`Agents (${subKeys.length})`}
          />
          <div style={{ marginBottom: "28px" }}>
            {subKeys.map((sub) => {
              const subTasks = grouped.get(sub)!;
              return (
                <div
                  key={sub}
                  style={{
                    padding: "12px 14px",
                    marginBottom: "8px",
                    background: theme.surface,
                    border: `1px solid ${theme.rule}`,
                    borderRadius: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: subTasks.length > 1 ? "8px" : 0,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: fontStack,
                        fontSize: "15px",
                        fontWeight: 600,
                        color: theme.ink,
                      }}
                    >
                      {sub}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      {subTasks.some((t) => t.scope === "Stretch") && (
                        <Pill
                          label="Stretch"
                          color={theme.muted}
                          bg={theme.surfaceElevated}
                        />
                      )}
                    </div>
                  </div>
                  {subTasks.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 0",
                        fontSize: "13px",
                        fontFamily: monoStack,
                        color: theme.muted,
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {t.title}
                      </div>
                      <div style={{ flexShrink: 0, fontSize: "12px" }}>
                        {t.week || "—"}
                      </div>
                      <div
                        style={{
                          flexShrink: 0,
                          color: statusColor(theme, t.status),
                          fontWeight: 600,
                          fontSize: "12px",
                          minWidth: "88px",
                          textAlign: "right",
                        }}
                      >
                        {t.status}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {ws.milestones.length > 0 && (
        <>
          <SectionHeader label="Milestones" />
          <div style={{ marginBottom: "28px" }}>
            {ws.milestones.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 0",
                  fontFamily: fontStack,
                  fontSize: "15px",
                  color: theme.ink,
                  borderBottom:
                    i < ws.milestones.length - 1
                      ? `1px solid ${theme.ruleSoft}`
                      : "none",
                }}
              >
                {m}
              </div>
            ))}
          </div>
        </>
      )}

      {otherTasks.length > 0 && (
        <>
          <SectionHeader
            label={hasAgentBreakdown ? "Other tasks" : `Tasks (${otherTasks.length})`}
          />
          <div style={{ marginBottom: "28px" }}>
            {otherTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  padding: "10px 0",
                  borderBottom: `1px solid ${theme.ruleSoft}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: "14px",
                    color: theme.ink,
                  }}
                >
                  {t.title}
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    fontFamily: monoStack,
                    fontSize: "12px",
                    color: theme.muted,
                  }}
                >
                  {t.week || "—"}
                </div>
                <div
                  style={{
                    flexShrink: 0,
                    fontFamily: monoStack,
                    color: statusColor(theme, t.status),
                    fontWeight: 600,
                    fontSize: "12px",
                    minWidth: "88px",
                    textAlign: "right",
                  }}
                >
                  {t.status}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {wsRisks.length > 0 && (
        <>
          <SectionHeader label="Open items" />
          <div style={{ marginBottom: "28px" }}>
            {wsRisks.map((r) => (
              <div
                key={r.id}
                style={{
                  padding: "14px 0",
                  borderBottom: `1px solid ${theme.ruleSoft}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "6px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      color: theme.ink,
                      lineHeight: 1.4,
                      fontWeight: 500,
                    }}
                  >
                    {r.item}
                  </div>
                  <Pill
                    label={r.severity}
                    color={r.severity === "High" ? theme.red : theme.amber}
                    bg={r.severity === "High" ? theme.redBg : theme.amberBg}
                  />
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: theme.muted,
                    lineHeight: 1.45,
                  }}
                >
                  {r.mitigation}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {wsMetrics.length > 0 && (
        <>
          <SectionHeader label="Value metrics" />
          <div>
            {wsMetrics.map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 0",
                  borderBottom:
                    i < wsMetrics.length - 1
                      ? `1px solid ${theme.ruleSoft}`
                      : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "15px",
                    color: theme.ink,
                    marginBottom: "6px",
                    fontWeight: 500,
                  }}
                >
                  {v.metric}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    fontSize: "14px",
                    color: theme.inkSoft,
                    fontFamily: monoStack,
                  }}
                >
                  <div>
                    <span style={{ color: theme.muted }}>baseline →</span>{" "}
                    {v.baseline}
                  </div>
                  <div>
                    <span style={{ color: theme.muted }}>target →</span>{" "}
                    {v.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DetailPanel>
  );
}
