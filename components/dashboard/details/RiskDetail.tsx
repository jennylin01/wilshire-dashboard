"use client";

import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Pill } from "@/components/ui/Pill";
import { fontStack, statusColor } from "@/lib/theme";
import type { Risk } from "@/lib/types";

export function RiskDetail({ risk, onClose }: { risk: Risk; onClose: () => void }) {
  const { theme } = useTheme();
  const r = risk;
  return (
    <DetailPanel
      title={r.item}
      subtitle={`RAID · ${r.type} · ${r.severity}`}
      onClose={onClose}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <Pill label={r.type} color={theme.ink} bg={theme.surfaceElevated} />
        <Pill
          label={r.severity}
          color={r.severity === "High" ? theme.red : theme.amber}
          bg={r.severity === "High" ? theme.redBg : theme.amberBg}
        />
        <Pill
          label={r.status}
          color={statusColor(theme, r.status)}
          bg={r.status === "Open" ? theme.redBg : theme.surfaceElevated}
        />
        {r.ws && <Pill label={r.ws} color={theme.muted} bg={theme.surfaceElevated} />}
      </div>
      {r.owner && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              fontFamily: fontStack,
              color: theme.muted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Owner
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "16px",
              color: theme.ink,
              fontWeight: 500,
            }}
          >
            {r.owner}
          </div>
        </div>
      )}
      {r.target && (
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "13px",
              fontFamily: fontStack,
              color: theme.muted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Target resolution
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "16px",
              color: theme.ink,
              fontWeight: 500,
            }}
          >
            {r.target}
          </div>
        </div>
      )}
      {r.mitigation && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px 18px",
            background: theme.surfaceElevated,
            border: `1px solid ${theme.rule}`,
            borderLeft: `3px solid ${theme.accent}`,
            borderRadius: "3px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              fontFamily: fontStack,
              color: theme.muted,
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            Mitigation / decision detail
          </div>
          <div
            style={{
              fontFamily: fontStack,
              fontSize: "15px",
              color: theme.ink,
              lineHeight: 1.5,
            }}
          >
            {r.mitigation}
          </div>
        </div>
      )}
    </DetailPanel>
  );
}
