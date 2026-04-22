"use client";

import { ArrowUpRight } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { DetailPanel } from "@/components/dashboard/DetailPanel";
import { Pill } from "@/components/ui/Pill";
import { monoStack, statusColor } from "@/lib/theme";
import type { Risk } from "@/lib/types";

export function RisksDetail({
  risks,
  onOpenRisk,
  onClose,
}: {
  risks: Risk[];
  onOpenRisk: (id: string) => void;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const open = risks.filter((r) => r.status.toLowerCase() !== "closed");
  const highSev = open.filter((r) => r.severity === "High");
  const otherOpen = open.filter((r) => r.severity !== "High");

  return (
    <DetailPanel
      title="Open RAID items"
      subtitle={`${highSev.length} high-sev · ${otherOpen.length} other`}
      onClose={onClose}
    >
      {highSev.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <SectionLabel>High severity · monitor daily</SectionLabel>
          {highSev.map((r, i) => (
            <Row
              key={r.id}
              risk={r}
              last={i === highSev.length - 1}
              onClick={() => {
                onClose();
                onOpenRisk(r.id);
              }}
            />
          ))}
        </div>
      )}
      {otherOpen.length > 0 && (
        <div>
          <SectionLabel>Medium &amp; low severity</SectionLabel>
          {otherOpen.map((r, i) => (
            <Row
              key={r.id}
              risk={r}
              last={i === otherOpen.length - 1}
              onClick={() => {
                onClose();
                onOpenRisk(r.id);
              }}
            />
          ))}
        </div>
      )}
    </DetailPanel>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        fontFamily: monoStack,
        fontSize: "11px",
        color: theme.muted,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "10px",
        paddingBottom: "8px",
        borderBottom: `1px solid ${theme.ruleSoft}`,
      }}
    >
      {children}
    </div>
  );
}

function Row({
  risk: r,
  last,
  onClick,
}: {
  risk: Risk;
  last: boolean;
  onClick: () => void;
}) {
  const { theme } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 0",
        borderBottom: last ? "none" : `1px solid ${theme.ruleSoft}`,
        cursor: "pointer",
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
        transition: "opacity 0.1s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background:
            r.severity === "High"
              ? theme.red
              : r.severity === "Medium"
                ? theme.amber
                : theme.muted,
          flexShrink: 0,
          marginTop: "7px",
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: "15px",
            color: theme.ink,
            fontWeight: 500,
            lineHeight: 1.4,
            marginBottom: "4px",
          }}
        >
          {r.item}
        </div>
        <div
          style={{
            fontFamily: monoStack,
            fontSize: "12px",
            color: theme.muted,
          }}
        >
          {r.type} · {r.ws || "—"} · {r.owner || "unowned"} · {r.status}
        </div>
      </div>
      <Pill
        label={r.status}
        color={statusColor(theme, r.status)}
        bg={
          r.status === "Open"
            ? theme.redBg
            : r.status === "Mitigating"
              ? theme.amberBg
              : theme.surfaceElevated
        }
      />
      <ArrowUpRight
        size={14}
        style={{ color: theme.mutedSoft, flexShrink: 0, marginTop: "3px" }}
      />
    </div>
  );
}
