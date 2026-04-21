"use client";

import { useTheme } from "@/components/ThemeProvider";
import { fontStack } from "@/lib/theme";
import type { Programme } from "@/lib/types";

export function Masthead({ programme }: { programme: Programme }) {
  const { theme } = useTheme();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "20px",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      <div style={{ flex: 1, minWidth: "400px" }}>
        <h1
          style={{
            fontFamily: fontStack,
            fontSize: "42px",
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
            color: theme.ink,
          }}
        >
          {programme.name}
        </h1>
        <div
          style={{
            fontFamily: fontStack,
            fontSize: "17px",
            color: theme.muted,
            marginTop: "10px",
            fontWeight: 400,
          }}
        >
          A {programme.totalWeeks}-week AI &amp; Data Labs engagement between{" "}
          {programme.supplier} and {programme.client}.
        </div>
      </div>
      <div
        style={{
          fontFamily: fontStack,
          fontSize: "14px",
          color: theme.muted,
          lineHeight: 1.8,
          textAlign: "right",
        }}
      >
        <div>
          <span style={{ color: theme.mutedSoft }}>Fee</span>{" "}
          <span style={{ color: theme.ink, fontWeight: 500 }}>
            ${programme.fee}k fixed
          </span>
        </div>
        <div>
          <span style={{ color: theme.mutedSoft }}>PM</span>{" "}
          <span style={{ color: theme.ink, fontWeight: 500 }}>
            {programme.clientPM}
          </span>
        </div>
        <div>
          <span style={{ color: theme.mutedSoft }}>Lead</span>{" "}
          <span style={{ color: theme.ink, fontWeight: 500 }}>
            {programme.workstreamLead}
          </span>
        </div>
      </div>
    </div>
  );
}
