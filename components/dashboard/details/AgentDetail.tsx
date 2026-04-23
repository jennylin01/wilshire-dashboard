"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { fontStack, monoStack } from "@/lib/theme";
import type { Task } from "@/lib/types";

function statusColor(
  theme: ReturnType<typeof useTheme>["theme"],
  status: string
): string {
  const s = status.toLowerCase();
  if (s.includes("done") || s.includes("complete")) return theme.green;
  if (s.includes("progress")) return theme.accent;
  if (s.includes("block")) return theme.red;
  return theme.muted;
}

function statusBg(
  theme: ReturnType<typeof useTheme>["theme"],
  status: string
): string {
  const s = status.toLowerCase();
  if (s.includes("done") || s.includes("complete")) return theme.greenBg;
  if (s.includes("progress")) return theme.accentSoft;
  if (s.includes("block")) return theme.redBg;
  return theme.surfaceElevated;
}

export function AgentDetail({
  agentName,
  tasks,
  notionUrl,
  onClose,
}: {
  agentName: string;
  tasks: Task[];
  notionUrl: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const agentTasks = tasks.filter((t) => t.subWorkstream === agentName);

  // Use the first non-empty task's Notes as the agent description (I seeded
  // the 2-pager descriptions into these Notes fields at task creation).
  const description =
    agentTasks.find((t) => t.notes && t.notes.length > 0)?.notes ?? "";

  const totalDone = agentTasks.filter((t) =>
    ["done", "complete"].some((s) => t.status.toLowerCase().includes(s))
  ).length;
  const totalInProgress = agentTasks.filter((t) =>
    t.status.toLowerCase().includes("progress")
  ).length;
  const totalBlocked = agentTasks.filter((t) =>
    t.status.toLowerCase().includes("block")
  ).length;
  const overallStatus =
    totalBlocked > 0
      ? "Blocked"
      : totalDone === agentTasks.length && agentTasks.length > 0
        ? "Done"
        : totalInProgress > 0
          ? "In Progress"
          : "To Do";

  const isStretch = agentTasks.some((t) => t.scope === "Stretch");

  return (
    <DetailPanel
      title={agentName}
      subtitle={`Agent · ${agentTasks.length} task${agentTasks.length === 1 ? "" : "s"}`}
      notionUrl={notionUrl}
      onClose={onClose}
    >
      {description && (
        <p
          style={{
            fontFamily: fontStack,
            fontSize: "16px",
            color: theme.inkSoft,
            lineHeight: 1.5,
            marginTop: 0,
            marginBottom: "22px",
          }}
        >
          {description}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <Pill
          label={overallStatus}
          color={statusColor(theme, overallStatus)}
          bg={statusBg(theme, overallStatus)}
        />
        {isStretch && (
          <Pill label="Stretch" color={theme.muted} bg={theme.surfaceElevated} />
        )}
      </div>

      {agentTasks.length > 0 && (
        <>
          <SectionHeader label="Tasks" />
          <div style={{ marginBottom: "20px" }}>
            {agentTasks.map((t) => (
              <div
                key={t.id}
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
                      flex: 1,
                      minWidth: 0,
                      fontSize: "15px",
                      color: theme.ink,
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {t.title}
                  </div>
                  <Pill
                    label={t.status}
                    color={statusColor(theme, t.status)}
                    bg={statusBg(theme, t.status)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    fontFamily: monoStack,
                    fontSize: "12px",
                    color: theme.muted,
                  }}
                >
                  {t.week && (
                    <span>
                      <span style={{ color: theme.mutedSoft }}>Week</span>{" "}
                      <span style={{ color: theme.ink }}>{t.week}</span>
                    </span>
                  )}
                  {t.phase && (
                    <span>
                      <span style={{ color: theme.mutedSoft }}>Phase</span>{" "}
                      <span style={{ color: theme.ink }}>{t.phase}</span>
                    </span>
                  )}
                  {t.owner && (
                    <span>
                      <span style={{ color: theme.mutedSoft }}>Owner</span>{" "}
                      <span style={{ color: theme.ink }}>{t.owner}</span>
                    </span>
                  )}
                  {t.milestone && (
                    <span>
                      <span style={{ color: theme.mutedSoft }}>Milestone</span>{" "}
                      <span style={{ color: theme.ink }}>{t.milestone}</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {agentTasks.length === 0 && (
        <div
          style={{
            padding: "14px 0",
            color: theme.muted,
            fontSize: "14px",
          }}
        >
          No tasks yet for this agent.
        </div>
      )}
    </DetailPanel>
  );
}
