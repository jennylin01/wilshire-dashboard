"use client";

import { ChevronLeft, LogOut, RefreshCw } from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Masthead } from "./Masthead";
import { TimelineBar } from "./TimelineBar";
import { WeeklyDeltaStrip } from "./WeeklyDeltaStrip";
import { VitalsStrip } from "./VitalsStrip";
import { WorkstreamsGrid } from "./WorkstreamsGrid";
import { MilestonesStrip } from "./MilestonesStrip";
import { RiskList } from "./RiskList";
import { DecisionsPanel } from "./DecisionsPanel";
import { CommitmentsSummary } from "./CommitmentsSummary";
import { ValueTrackingSummary } from "./ValueTrackingSummary";
import { WorkstreamDetail } from "./details/WorkstreamDetail";
import { AgentDetail } from "./details/AgentDetail";
import { RiskDetail } from "./details/RiskDetail";
import { RisksDetail } from "./details/RisksDetail";
import { CommitmentsDetail } from "./details/CommitmentsDetail";
import { DecisionsDetail } from "./details/DecisionsDetail";
import { MilestonesDetail } from "./details/MilestonesDetail";
import { ValueDetail } from "./details/ValueDetail";

import { fontStack, monoStack } from "@/lib/theme";
import type { DashboardData, WorkstreamId } from "@/lib/types";

export type DetailRef =
  | { type: "workstream"; id: WorkstreamId }
  | { type: "agent"; name: string }
  | { type: "risk"; id: string }
  | { type: "risks" }
  | { type: "commitment" }
  | { type: "decisions" }
  | { type: "milestones" }
  | { type: "value" };

export function Dashboard({ data }: { data: DashboardData }) {
  const { theme } = useTheme();
  const router = useRouter();
  const [detail, setDetail] = useState<DetailRef | null>(null);
  const [isRefreshing, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await fetch("/api/revalidate", { method: "POST" });
      router.refresh();
    });
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
  };

  const renderDetail = () => {
    if (!detail) return null;
    const close = () => setDetail(null);

    if (detail.type === "workstream") {
      const ws = data.workstreams.find((w) => w.id === detail.id);
      if (!ws) return null;
      return (
        <WorkstreamDetail
          ws={ws}
          risks={data.risks}
          metrics={data.valueMetrics}
          tasks={data.tasks}
          notionUrl={data.programme.notionUrl}
          onClose={close}
          onOpenAgent={(name) => setDetail({ type: "agent", name })}
        />
      );
    }
    if (detail.type === "agent") {
      return (
        <AgentDetail
          agentName={detail.name}
          tasks={data.tasks}
          notionUrl={data.programme.notionUrl}
          onClose={close}
        />
      );
    }
    if (detail.type === "risk") {
      const r = data.risks.find((x) => x.id === detail.id);
      if (!r) return null;
      return <RiskDetail risk={r} onClose={close} />;
    }
    if (detail.type === "risks") {
      return (
        <RisksDetail
          risks={data.risks}
          onOpenRisk={(id) => setDetail({ type: "risk", id })}
          onClose={close}
        />
      );
    }
    if (detail.type === "commitment") {
      return (
        <CommitmentsDetail
          commitments={data.commitments}
          notionUrl={data.programme.notionUrl}
          onClose={close}
        />
      );
    }
    if (detail.type === "decisions") {
      return <DecisionsDetail decisions={data.decisions} onClose={close} />;
    }
    if (detail.type === "milestones") {
      return (
        <MilestonesDetail
          milestones={data.milestones}
          programme={data.programme}
          notionUrl={data.programme.notionUrl}
          onClose={close}
        />
      );
    }
    if (detail.type === "value") {
      return (
        <ValueDetail
          metrics={data.valueMetrics}
          notionUrl={data.programme.notionUrl}
          onClose={close}
        />
      );
    }
    return null;
  };

  return (
    <div
      style={{
        fontFamily: fontStack,
        background: theme.bg,
        minHeight: "100vh",
        color: theme.ink,
        padding: 0,
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {/* TOP NAV */}
      <div
        style={{
          borderBottom: `1px solid ${theme.rule}`,
          background: theme.bg,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: "14px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
                color: theme.ink,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = theme.accent)
              }
              onMouseLeave={(e) => (e.currentTarget.style.color = theme.ink)}
              title="Back to engagement hub"
              aria-label="Back to engagement hub"
            >
              <ChevronLeft size={16} style={{ marginLeft: "-4px" }} />
              <span
                style={{
                  fontFamily: fontStack,
                  fontSize: "17px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                }}
              >
                Motive
                <span style={{ color: theme.muted, fontWeight: 400 }}>
                  {" "}
                  · Create
                </span>
              </span>
            </Link>
            <div style={{ width: "1px", height: "16px", background: theme.rule }} />
            <div
              style={{
                fontFamily: fontStack,
                fontSize: "15px",
                color: theme.muted,
              }}
            >
              Engagement dashboard
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                fontFamily: monoStack,
                fontSize: "13px",
                color: theme.muted,
              }}
            >
              {data.programme.today}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                width: "34px",
                height: "34px",
                border: `1px solid ${theme.rule}`,
                background: "transparent",
                cursor: isRefreshing ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.ink,
                borderRadius: "3px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = theme.surfaceHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              title="Refresh Notion data"
              aria-label="Refresh Notion data"
            >
              <RefreshCw
                size={14}
                style={{
                  animation: isRefreshing ? "wilshire-spin 0.8s linear infinite" : "none",
                }}
              />
            </button>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              style={{
                width: "34px",
                height: "34px",
                border: `1px solid ${theme.rule}`,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.ink,
                borderRadius: "3px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = theme.surfaceHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* MASTHEAD */}
      <div
        style={{
          padding: "36px 40px 20px",
        }}
      >
        <Masthead programme={data.programme} />
        <TimelineBar programme={data.programme} milestones={data.milestones} />
      </div>

      {/* WEEKLY DELTA — the most important section */}
      <div
        style={{ padding: "24px 40px 0" }}
      >
        <WeeklyDeltaStrip delta={data.weeklyDelta} />
      </div>

      {/* VITALS */}
      <div
        style={{ padding: "16px 40px 8px" }}
      >
        <VitalsStrip data={data} onOpen={setDetail} />
      </div>

      {/* WORKSTREAMS */}
      <div
        style={{ padding: "28px 40px 16px" }}
      >
        <WorkstreamsGrid workstreams={data.workstreams} onOpen={setDetail} />
      </div>

      {/* MILESTONES */}
      <div
        style={{ padding: "12px 40px 16px" }}
      >
        <MilestonesStrip
          milestones={data.milestones}
          programme={data.programme}
          onOpen={setDetail}
        />
      </div>

      {/* RAID + DECISIONS */}
      <div
        style={{
          padding: "12px 40px 16px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
        }}
      >
        <RiskList risks={data.risks} onOpen={setDetail} />
        <DecisionsPanel decisions={data.decisions} onOpen={setDetail} />
      </div>

      {/* COMMITMENTS + VALUE */}
      <div
        style={{
          padding: "12px 40px 20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <CommitmentsSummary commitments={data.commitments} onOpen={setDetail} />
        <ValueTrackingSummary metrics={data.valueMetrics} onOpen={setDetail} />
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "12px 40px 36px",
        }}
      >
        <div
          style={{
            borderTop: `1px solid ${theme.rule}`,
            paddingTop: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: fontStack,
            fontSize: "13px",
            color: theme.muted,
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            Data live from Notion · Last sync {data.lastSync}
          </div>
          <div>Sponsors: {data.programme.sponsors.join(" · ")}</div>
        </div>
      </div>

      {renderDetail()}
    </div>
  );
}
