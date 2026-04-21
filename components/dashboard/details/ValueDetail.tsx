"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { fontStack, monoStack } from "@/lib/theme";
import type { ValueMetric } from "@/lib/types";

export function ValueDetail({
  metrics,
  notionUrl,
  onClose,
}: {
  metrics: ValueMetric[];
  notionUrl: string;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const groups: string[] = ["F&A", "S&RM", "PM"];
  return (
    <DetailPanel
      title="Value tracking"
      subtitle={`${metrics.length} metrics · SOW §6`}
      notionUrl={notionUrl}
      onClose={onClose}
    >
      <p
        style={{
          fontFamily: fontStack,
          fontSize: "15px",
          color: theme.inkSoft,
          lineHeight: 1.5,
          marginTop: 0,
          marginBottom: "20px",
        }}
      >
        Business-case metrics updated at milestones. Baselines captured in
        Week 1; targets measured at Week 8 UAT.
      </p>
      {groups.map((wsGroup) => {
        const group = metrics.filter((v) => v.ws === wsGroup);
        if (group.length === 0) return null;
        return (
          <div key={wsGroup} style={{ marginBottom: "24px" }}>
            <SectionHeader label={wsGroup} />
            {group.map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 0",
                  borderBottom:
                    i < group.length - 1
                      ? `1px solid ${theme.ruleSoft}`
                      : "none",
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
                      flex: 1,
                      fontWeight: 500,
                    }}
                  >
                    {v.metric}
                  </div>
                  <Pill
                    label={v.confidence}
                    color={
                      v.confidence === "High"
                        ? theme.green
                        : v.confidence === "Medium"
                          ? theme.amber
                          : theme.muted
                    }
                    bg={
                      v.confidence === "High"
                        ? theme.greenBg
                        : v.confidence === "Medium"
                          ? theme.amberBg
                          : theme.surfaceElevated
                    }
                  />
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    fontSize: "14px",
                    color: theme.inkSoft,
                    fontFamily: monoStack,
                    marginTop: "6px",
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
        );
      })}
    </DetailPanel>
  );
}
