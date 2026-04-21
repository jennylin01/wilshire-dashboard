import React, { useState } from 'react';
import { X, ArrowUpRight, Sun, Moon, ExternalLink } from 'lucide-react';

export default function WilshireDashboard() {
  const [detail, setDetail] = useState(null);
  const [isDark, setIsDark] = useState(false);

  // ============================================================
  // LIVE DATA — pulled from Notion workspace on Apr 21, 2026
  // ============================================================
  const programme = {
    name: "Wilshire — AI Acceleration",
    client: "Wilshire Advisors LLC",
    supplier: "Motive Create US, LLC",
    fee: 400,
    clientPM: "Hanna Valva (CTO)",
    workstreamLead: "Mo Beldo",
    sponsors: ["Christina Walsh, CFO", "Todd Kessler, CRO", "Leah Emkin, OCIO"],
    start: "Apr 20, 2026",
    end: "Jun 21, 2026",
    currentWeek: 1,
    totalWeeks: 9,
    today: "Tuesday, Apr 21, 2026",
    notionUrl: "https://www.notion.so/3485e123a435810ab817edd0326ff7ab",
  };

  // What changed this week — the most important thing on the page.
  // Updated manually each Friday. Direction: "up" = progress, "down" = concern, "flat" = status quo/FYI.
  const weeklyDelta = {
    weekOf: "Apr 20–26, 2026",
    headline: "Week 1 is on track commercially, but unblocking Wilshire access is the whole game this week.",
    changes: [
      { direction: "up", label: "SOW signed + AWS/Bedrock access delivered", detail: "M1 invoice pathway ($80k) intact." },
      { direction: "down", label: "AP inbox access went late (Apr 24)", detail: "If not resolved by Mon, A1 routing build slips Week 2." },
      { direction: "down", label: "2 decisions still pending — Mark P (Apr 22) + CR#1 (Apr 24)", detail: "Mark P sign-off unlocks 13 PM tasks; CR#1 ratifies 9-week extension." },
      { direction: "flat", label: "6 Wilshire-side dependencies still not started", detail: "Being worked twice-weekly with Hanna. No single item at red yet." },
    ],
  };

  const workstreams = [
    { id: "fa", name: "Finance & accounting", short: "F&A", lead: "Mo Beldo", sponsor: "Christina Walsh", rag: "amber", committed: 24, done: 1, inProgress: 0, blocked: 0, thesis: "AP automation — email routing, doc intelligence, mismatch detection, query auto-response.", milestones: ["M2 (Wk4, $60k)", "M3 (Wk5, $80k)"] },
    { id: "srm", name: "Sales & revenue management", short: "S&RM", lead: "Mo Beldo", sponsor: "Todd Kessler", rag: "green", committed: 17, done: 0, inProgress: 0, blocked: 0, thesis: "Salesforce gap report, duplicate resolution, Accordion data mart integration.", milestones: ["M4 (Wk4, $40k)", "M5 (Wk7, $80k)"] },
    { id: "pm", name: "E2E investment mgmt — private market", short: "PM", lead: "Mo Beldo", sponsor: "Mark P", rag: "amber", committed: 13, done: 0, inProgress: 0, blocked: 0, thesis: "Workflow reimagination — placeholder milestones pending Mark P sign-off (Apr 22).", milestones: ["M-PM1/2/3 — TBD"] },
    { id: "gov", name: "Governance", short: "GOV", lead: "Motive Create PM", sponsor: "Hanna Valva", rag: "amber", committed: 23, done: 2, inProgress: 2, blocked: 1, thesis: "Mobilisation, governance rhythm, status reporting, change control.", milestones: ["M1 (Wk1, $80k)", "M6 (Wk8, $60k)"] },
  ];

  const milestones = [
    { id: "M1", week: 1, amount: 80, label: "Mobilisation complete", status: "in-progress", pct: 20 },
    { id: "M2", week: 4, amount: 60, label: "F&A end-to-end demo", status: "upcoming", pct: 15 },
    { id: "M3", week: 5, amount: 80, label: "F&A UAT + measurement report", status: "upcoming", pct: 20 },
    { id: "M4", week: 4, amount: 40, label: "S&RM gap report walkthrough", status: "upcoming", pct: 10 },
    { id: "M5", week: 7, amount: 80, label: "S&RM UAT + final gap report", status: "upcoming", pct: 20 },
    { id: "M6", week: 8, amount: 60, label: "Final acceptance + prod readiness", status: "upcoming", pct: 15 },
  ];

  const risks = [
    { id: "r1", item: "Week 1 dependency cascade — 10+ Wilshire-side dependencies in Week 1", type: "Risk", severity: "High", status: "Open", ws: "Governance", owner: "Motive Create PM + Hanna", mitigation: "Dependencies reviewed 2×/week with Hanna. 72-hour SLA per SOW §9.", target: "2026-04-26" },
    { id: "r2", item: "Motive Create sandbox reusable for Workstream A", type: "Assumption", severity: "High", status: "Open", ws: "F&A", owner: "Motive Create AI Lead", mitigation: "Motive sandbox review in Week 1 (SOW M5) validates reusability.", target: null },
    { id: "r3", item: "Wilshire security + architecture review runs in parallel", type: "Assumption", severity: "High", status: "Open", ws: "Governance", owner: "Wilshire Eng", mitigation: "SOW Dep 16. Flag concerns by Week 4.", target: null },
    { id: "r4", item: "Private Market scope undefined until Mark P sign-off (Apr 22)", type: "Risk", severity: "High", status: "Open", ws: "PM", owner: "Motive Create + Mark P", mitigation: "PM tasks tagged placeholder, RAG Amber. Re-scope after Apr 22.", target: "2026-04-22" },
    { id: "r5", item: "Mo Beldo leads BOTH CFO and CRO workstreams", type: "Risk", severity: "Medium", status: "Open", ws: "Cross-cutting", owner: "Motive Create PM", mitigation: "Confirm at kick-off. Name second lead or time-box Mo's split.", target: null },
    { id: "r6", item: "Curated 100 invoices + 30 labeled subset required by end Week 1", type: "Risk", severity: "Medium", status: "Open", ws: "F&A", owner: "Wilshire (Gabby)", mitigation: "Agree substitute sample or expand to 200+ labels Week 2.", target: "2026-04-26" },
    { id: "r7", item: "Week 8 KT compression", type: "Risk", severity: "Medium", status: "Mitigating", ws: "Governance", owner: "Motive Create PM + Hanna", mitigation: "Extended to 9 weeks — KT moved to Week 9.", target: "2026-04-22" },
    { id: "r8", item: "AWS sub-account with Bedrock is the agreed platform", type: "Assumption", severity: "Medium", status: "Open", ws: "Governance", owner: "Wilshire Eng", mitigation: "Provisioning is a Week 1 dependency.", target: null },
  ];

  const decisions = [
    { id: "d1", item: "Formalize 8 → 9 week extension (CR #1)", status: "Pending decision", owner: "Hanna Valva", target: "2026-04-24", detail: "Hanna to counter-sign CR #1 by Fri Apr 24. No commercial change." },
    { id: "d2", item: "Private Market scope inclusion", status: "Pending decision", owner: "Mark P", target: "2026-04-22", detail: "Mark P sign-off unlocks full PM workstream. 13 tasks currently placeholder." },
    { id: "d3", item: "9-week extension", status: "Closed", owner: "Motive (Jenny) + Hanna", target: "2026-04-20", detail: "Jenny extended to 9 weeks. Week 9 added for KT + final sign-off." },
    { id: "d4", item: "PM milestones remain placeholders until Mark P signs", status: "Closed", owner: "Motive (Jenny)", target: "2026-04-22", detail: "Re-size M-PM1/2/3 after Apr 22." },
  ];

  const commitments = [
    { item: "Read access: AP inbox + AP queries inbox", status: "Late", owner: "Wilshire CFO (Christina/Gabby)", due: "Apr 24", blocks: "A1 routing (Wk2), A3 OCR (Wk3), A4 mismatch (Wk3), A6 auto-response (Wk4)" },
    { item: "SOW sign-off", status: "Delivered", owner: "Hanna Valva", due: "Apr 22", blocks: "Everything. 10 downstream tasks." },
    { item: "AWS sub-account + Bedrock access", status: "Delivered", owner: "Wilshire Eng", due: "Apr 24", blocks: "Lab environment, sandbox review, all build work." },
    { item: "Mark P sign-off on PM scope", status: "Not started", owner: "Mark P", due: "Apr 22", blocks: "Entire PM workstream (13 tasks). M-PM1/2/3 unscoped." },
    { item: "SSO/MFA provisioning for Motive team", status: "Not started", owner: "Hanna Valva + Wilshire Eng", due: "Apr 23", blocks: "All Motive Create team access — no logins until done." },
    { item: "Curated 100 invoices + 30 labeled subset", status: "Not started", owner: "Wilshire (Gabby)", due: "Apr 26", blocks: "Eval harness (Wk2), A3 OCR (Wk3), A4 mismatch (Wk3), M2 = $60k (Wk4)" },
    { item: "Salesforce access: acct, opp, contact, custom objects", status: "Not started", owner: "Wilshire Eng", due: "Apr 24", blocks: "B1 schema extract (Wk2), B3 gap report, B4 duplicate detection, entire S&RM." },
    { item: "Read access: Tipalti (invoice + vendor data)", status: "Not started", owner: "Wilshire CFO (Christina)", due: "Apr 24", blocks: "Baseline capture, A4 mismatch comparison." },
    { item: "New email address for routing email copies", status: "Not started", owner: "Wilshire CFO Office", due: "Apr 24", blocks: "A1 routing — cannot mirror AP inbox." },
    { item: "Accordion team intro + data mart docs + extract", status: "Not started", owner: "Wilshire CRO/CFO", due: "Apr 26", blocks: "B1 Accordion walkthrough (Wk2), B7 pipeline (Wk4)." },
    { item: "Priority fields + dup patterns + record keepers", status: "Not started", owner: "Wilshire CRO (Todd, Matt, Brian, Andrew)", due: "Apr 24", blocks: "CRO working session (Wk1), B3 gap report v1." },
    { item: "RulesReport / Fiduciary portal exports access", status: "Not started", owner: "Wilshire CRO (via Ryan)", due: "Apr 24", blocks: "B1 schema walkthrough, B6 record keeper reconciliation." },
  ];

  const valueMetrics = [
    { metric: "Mismatch catch rate (A4)", ws: "F&A", baseline: "12% Tipalti error rate", target: "≥80% recall", status: "Baseline captured", confidence: "High" },
    { metric: "AP team FTE capacity released", ws: "F&A", baseline: "3,200 inv/mo · 70% manual · 2.1 FTE", target: "1-2 FTE released", status: "Baseline captured", confidence: "Medium" },
    { metric: "Invoice extraction accuracy (A3)", ws: "F&A", baseline: "TBV — Tipalti sample", target: "≥80%", status: "Not started", confidence: "TBV" },
    { metric: "Email routing accuracy (A1)", ws: "F&A", baseline: "TBV — AP inbox 1-wk sample", target: "≥80%", status: "Not started", confidence: "TBV" },
    { metric: "AP triage time per invoice", ws: "F&A", baseline: "TBV", target: "Measurable reduction", status: "Not started", confidence: "TBV" },
    { metric: "AP query response time", ws: "F&A", baseline: "TBV", target: "Measurable reduction", status: "Not started", confidence: "TBV" },
    { metric: "Salesforce data quality", ws: "S&RM", baseline: "B3 gap report v1 (Wk3)", target: "Gaps closed on priority fields", status: "Not started", confidence: "TBV" },
    { metric: "Sales capacity released", ws: "S&RM", baseline: "TBV", target: "2.5-3.5 FTE · ~$550-770k", status: "Not started", confidence: "TBV" },
    { metric: "Revenue-at-risk protected", ws: "S&RM", baseline: "TBV — historic client loss", target: "$1-4M quantified + remediated", status: "Not started", confidence: "TBV" },
    { metric: "PM research report cycle time", ws: "PM", baseline: "~8-10 wks today", target: "50-80% faster", status: "Not started", confidence: "Low" },
    { metric: "PM research report throughput", ws: "PM", baseline: "88 RRs (vs 122 FLRs, 210 RADARs)", target: "3-5× throughput", status: "Not started", confidence: "Low" },
    { metric: "PM FTE capacity released", ws: "PM", baseline: "30-50 FTE in scope", target: "20-40% released", status: "Not started", confidence: "Low" },
  ];

  // ============================================================
  // MOTIVE DESIGN SYSTEM — light & dark
  // Primary: black, white, gray. Accent: Motive blue. RAG: red + amber (disciplined).
  // ============================================================
  const theme = isDark ? {
    bg: "#0a0a0a",
    surface: "#141414",
    surfaceHover: "#1c1c1c",
    surfaceElevated: "#1a1a1a",
    ink: "#ffffff",
    inkSoft: "#d4d4d4",
    muted: "#7a7a7a",
    mutedSoft: "#5a5a5a",
    rule: "#2a2a2a",
    ruleSoft: "#1f1f1f",
    accent: "#3b82f6",     // Motive blue
    accentSoft: "#1e3a8a",
    amber: "#d97706",      // restrained amber
    amberBg: "#2a1f0a",
    red: "#dc2626",        // disciplined red
    redBg: "#2a0f0f",
    green: "#10b981",      // only for "delivered/closed"
    greenBg: "#0f2a20",
  } : {
    bg: "#ffffff",
    surface: "#ffffff",
    surfaceHover: "#f5f5f5",
    surfaceElevated: "#fafafa",
    ink: "#0a0a0a",
    inkSoft: "#333333",
    muted: "#737373",
    mutedSoft: "#a3a3a3",
    rule: "#e5e5e5",
    ruleSoft: "#f0f0f0",
    accent: "#1e40af",     // Motive blue, slightly deeper on white
    accentSoft: "#dbeafe",
    amber: "#b45309",
    amberBg: "#fef3c7",
    red: "#b91c1c",
    redBg: "#fee2e2",
    green: "#047857",
    greenBg: "#d1fae5",
  };

  const ragColor = (rag) => ({ green: theme.green, amber: theme.amber, red: theme.red }[rag] || theme.muted);
  const ragBg = (rag) => ({ green: theme.greenBg, amber: theme.amberBg, red: theme.redBg }[rag] || theme.surfaceElevated);

  const statusColor = (s) => {
    const n = (s || "").toLowerCase();
    if (n.includes("delivered") || n.includes("done") || n === "closed" || n === "hit") return theme.green;
    if (n.includes("late") || n.includes("blocked") || n === "open" || n === "off track") return theme.red;
    if (n.includes("progress") || n.includes("mitigating") || n.includes("pending") || n === "at risk") return theme.amber;
    return theme.muted;
  };

  // Derived
  const openHighRisks = risks.filter(r => r.severity === "High" && r.status !== "Closed").length;
  const lateCommitments = commitments.filter(c => c.status === "Late").length;
  const notStartedCount = commitments.filter(c => c.status === "Not started").length;
  const pendingDecisions = decisions.filter(d => d.status === "Pending decision").length;
  const invoicePipeline = milestones.reduce((s, m) => s + m.amount, 0);

  // ============================================================
  // SHARED COMPONENTS
  // ============================================================
  const fontStack = 'Aptos, "Aptos Display", "Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif';
  const monoStack = '"JetBrains Mono", "SF Mono", Consolas, monospace';

  const SectionHeader = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
      <h2 style={{
        fontFamily: fontStack, fontSize: '13px', fontWeight: 600,
        color: theme.ink, margin: 0, letterSpacing: '-0.005em',
      }}>{label}</h2>
      <div style={{ flex: 1, height: '1px', background: theme.rule }} />
    </div>
  );

  const Pill = ({ label, color, bg, size = 'sm' }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: size === 'sm' ? '2px 8px' : '4px 10px',
      fontSize: size === 'sm' ? '11px' : '12px',
      fontFamily: fontStack, fontWeight: 500,
      color: color, background: bg || 'transparent',
      border: `1px solid ${bg ? bg : color}`,
      borderRadius: '3px',
      letterSpacing: '-0.005em',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  );

  const KPI = ({ label, value, sub, accent, onClick }) => (
    <div
      onClick={onClick}
      style={{
        padding: '20px 22px 18px', background: theme.surface,
        cursor: onClick ? 'pointer' : 'default', transition: 'background 0.15s',
        position: 'relative',
      }}
      onMouseEnter={e => onClick && (e.currentTarget.style.background = theme.surfaceHover)}
      onMouseLeave={e => onClick && (e.currentTarget.style.background = theme.surface)}
    >
      <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '14px', fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: fontStack, fontSize: '36px', color: accent || theme.ink, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
      {sub && <div style={{ fontSize: '12px', color: theme.muted, marginTop: '8px', fontFamily: fontStack }}>{sub}</div>}
      {onClick && <ArrowUpRight size={13} style={{ position: 'absolute', top: '18px', right: '18px', color: theme.mutedSoft }} />}
    </div>
  );

  // ============================================================
  // DETAIL PANELS
  // ============================================================
  const Panel = ({ title, subtitle, children, notionUrl }) => (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(10,10,10,0.35)',
        display: 'flex', justifyContent: 'flex-end',
        animation: 'fadeIn 0.18s ease',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setDetail(null)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '620px', maxWidth: '94vw', height: '100%',
          background: theme.bg, overflowY: 'auto',
          borderLeft: `1px solid ${theme.rule}`,
          animation: 'slideIn 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          boxShadow: isDark ? '-20px 0 60px rgba(0,0,0,0.5)' : '-20px 0 60px rgba(10,10,10,0.08)',
        }}
      >
        <div style={{
          padding: '24px 32px 20px', borderBottom: `1px solid ${theme.rule}`,
          position: 'sticky', top: 0, background: theme.bg, zIndex: 2,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '6px', fontWeight: 500 }}>{subtitle}</div>
            <h2 style={{ fontFamily: fontStack, fontSize: '22px', color: theme.ink, margin: 0, letterSpacing: '-0.02em', fontWeight: 600, lineHeight: 1.2 }}>{title}</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {notionUrl && (
              <a href={notionUrl} target="_blank" rel="noreferrer" style={{
                width: '32px', height: '32px', border: `1px solid ${theme.rule}`,
                background: 'transparent', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: theme.ink,
                textDecoration: 'none', borderRadius: '3px',
              }}><ExternalLink size={14} /></a>
            )}
            <button
              onClick={() => setDetail(null)}
              style={{
                width: '32px', height: '32px', border: `1px solid ${theme.rule}`,
                background: 'transparent', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: theme.ink, borderRadius: '3px',
              }}
            ><X size={14} /></button>
          </div>
        </div>
        <div style={{ padding: '24px 32px 48px' }}>{children}</div>
      </div>
    </div>
  );

  const renderDetail = () => {
    if (!detail) return null;

    if (detail.type === 'workstream') {
      const ws = workstreams.find(w => w.id === detail.id);
      const wsRisks = risks.filter(r => {
        if (ws.id === 'fa') return r.ws === 'F&A';
        if (ws.id === 'srm') return r.ws === 'S&RM';
        if (ws.id === 'pm') return r.ws === 'PM';
        if (ws.id === 'gov') return r.ws === 'Governance';
        return false;
      });
      const wsMetrics = valueMetrics.filter(v => v.ws === ws.short);
      return (
        <Panel title={ws.name} subtitle={`Workstream · ${ws.short}`} notionUrl={programme.notionUrl}>
          <p style={{ fontFamily: fontStack, fontSize: '15px', color: theme.inkSoft, lineHeight: 1.5, marginTop: 0, marginBottom: '24px' }}>{ws.thesis}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            <div style={{ padding: '14px 16px', background: ragBg(ws.rag), border: `1px solid ${ragColor(ws.rag)}`, borderRadius: '3px' }}>
              <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '4px', fontWeight: 500 }}>RAG</div>
              <div style={{ fontFamily: fontStack, fontSize: '18px', color: ragColor(ws.rag), textTransform: 'capitalize', fontWeight: 600 }}>{ws.rag}</div>
            </div>
            <div style={{ padding: '14px 16px', background: theme.surfaceElevated, border: `1px solid ${theme.rule}`, borderRadius: '3px' }}>
              <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '4px', fontWeight: 500 }}>Lead / sponsor</div>
              <div style={{ fontFamily: fontStack, fontSize: '14px', color: theme.ink, fontWeight: 500 }}>{ws.lead}</div>
              <div style={{ fontSize: '12px', color: theme.muted, marginTop: '2px' }}>Sponsor: {ws.sponsor}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '28px' }}>
            {[
              { label: "Tasks", value: ws.committed, color: theme.ink },
              { label: "Done", value: ws.done, color: theme.green },
              { label: "In prog.", value: ws.inProgress, color: theme.amber },
              { label: "Blocked", value: ws.blocked, color: theme.red },
            ].map((k, i) => (
              <div key={i} style={{ padding: '12px', background: theme.surface, border: `1px solid ${theme.rule}`, textAlign: 'center', borderRadius: '3px' }}>
                <div style={{ fontSize: '10px', fontFamily: fontStack, color: theme.muted, marginBottom: '6px', fontWeight: 500 }}>{k.label}</div>
                <div style={{ fontFamily: fontStack, fontSize: '22px', color: k.color, fontWeight: 600 }}>{k.value}</div>
              </div>
            ))}
          </div>

          <SectionHeader label="Milestones" />
          <div style={{ marginBottom: '28px' }}>
            {ws.milestones.map((m, i) => (
              <div key={i} style={{ padding: '10px 0', fontFamily: fontStack, fontSize: '14px', color: theme.ink, borderBottom: i < ws.milestones.length - 1 ? `1px solid ${theme.ruleSoft}` : 'none' }}>{m}</div>
            ))}
          </div>

          {wsRisks.length > 0 && <>
            <SectionHeader label="Open items" />
            <div style={{ marginBottom: '28px' }}>
              {wsRisks.map(r => (
                <div key={r.id} style={{ padding: '14px 0', borderBottom: `1px solid ${theme.ruleSoft}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '14px', color: theme.ink, lineHeight: 1.4, fontWeight: 500 }}>{r.item}</div>
                    <Pill label={r.severity} color={r.severity === 'High' ? theme.red : theme.amber} bg={r.severity === 'High' ? theme.redBg : theme.amberBg} />
                  </div>
                  <div style={{ fontSize: '13px', color: theme.muted, lineHeight: 1.45 }}>{r.mitigation}</div>
                </div>
              ))}
            </div>
          </>}

          {wsMetrics.length > 0 && <>
            <SectionHeader label="Value metrics" />
            <div>
              {wsMetrics.map((v, i) => (
                <div key={i} style={{ padding: '14px 0', borderBottom: i < wsMetrics.length - 1 ? `1px solid ${theme.ruleSoft}` : 'none' }}>
                  <div style={{ fontSize: '14px', color: theme.ink, marginBottom: '6px', fontWeight: 500 }}>{v.metric}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: theme.inkSoft, fontFamily: monoStack }}>
                    <div><span style={{ color: theme.muted }}>baseline →</span> {v.baseline}</div>
                    <div><span style={{ color: theme.muted }}>target →</span> {v.target}</div>
                  </div>
                </div>
              ))}
            </div>
          </>}
        </Panel>
      );
    }

    if (detail.type === 'risk') {
      const r = risks.find(x => x.id === detail.id);
      return (
        <Panel title={r.item} subtitle={`RAID · ${r.type} · ${r.severity}`}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <Pill label={r.type} color={theme.ink} bg={theme.surfaceElevated} />
            <Pill label={r.severity} color={r.severity === 'High' ? theme.red : theme.amber} bg={r.severity === 'High' ? theme.redBg : theme.amberBg} />
            <Pill label={r.status} color={statusColor(r.status)} bg={r.status === 'Open' ? theme.redBg : theme.surfaceElevated} />
            <Pill label={r.ws} color={theme.muted} bg={theme.surfaceElevated} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '6px', fontWeight: 500 }}>Owner</div>
            <div style={{ fontFamily: fontStack, fontSize: '16px', color: theme.ink, fontWeight: 500 }}>{r.owner}</div>
          </div>
          {r.target && <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '6px', fontWeight: 500 }}>Target resolution</div>
            <div style={{ fontFamily: fontStack, fontSize: '16px', color: theme.ink, fontWeight: 500 }}>{r.target}</div>
          </div>}
          <div style={{ marginTop: '24px', padding: '16px 18px', background: theme.surfaceElevated, border: `1px solid ${theme.rule}`, borderLeft: `3px solid ${theme.accent}`, borderRadius: '3px' }}>
            <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '6px', fontWeight: 500 }}>Mitigation / decision detail</div>
            <div style={{ fontFamily: fontStack, fontSize: '14px', color: theme.ink, lineHeight: 1.5 }}>{r.mitigation}</div>
          </div>
        </Panel>
      );
    }

    if (detail.type === 'commitment') {
      return (
        <Panel title="Client commitments" subtitle="Wilshire-owned inputs · Hanna conversation" notionUrl={programme.notionUrl}>
          <p style={{ fontFamily: fontStack, fontSize: '14px', color: theme.inkSoft, lineHeight: 1.5, marginTop: 0, marginBottom: '20px' }}>
            Every item below is a Wilshire-owned input with a named owner, date, and 72-hour SLA per SOW Section 9.
          </p>
          {commitments.map((c, i) => (
            <div key={i} style={{ padding: '14px 0', borderBottom: i < commitments.length - 1 ? `1px solid ${theme.ruleSoft}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                <div style={{ fontSize: '14px', color: theme.ink, lineHeight: 1.4, flex: 1, fontWeight: 500 }}>{c.item}</div>
                <Pill label={c.status} color={statusColor(c.status)} bg={c.status === 'Late' ? theme.redBg : c.status === 'Delivered' ? theme.greenBg : theme.surfaceElevated} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: theme.muted, fontFamily: monoStack, marginBottom: '6px' }}>
                <span>owner: {c.owner}</span>
                <span>due: {c.due}</span>
              </div>
              <div style={{ fontSize: '13px', color: theme.inkSoft, lineHeight: 1.45 }}>↳ {c.blocks}</div>
            </div>
          ))}
        </Panel>
      );
    }

    if (detail.type === 'decisions') {
      return (
        <Panel title="Decisions log" subtitle={`${pendingDecisions} pending · ${decisions.length - pendingDecisions} closed`}>
          {decisions.map((d, i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: i < decisions.length - 1 ? `1px solid ${theme.ruleSoft}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                <div style={{ fontSize: '15px', color: theme.ink, lineHeight: 1.35, fontWeight: 500 }}>{d.item}</div>
                <Pill label={d.status} color={statusColor(d.status)} bg={d.status === 'Closed' ? theme.greenBg : theme.amberBg} />
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: theme.muted, fontFamily: monoStack, marginBottom: '8px' }}>
                <span>owner: {d.owner}</span>
                <span>target: {d.target}</span>
              </div>
              <div style={{ fontSize: '13px', color: theme.inkSoft, lineHeight: 1.5 }}>{d.detail}</div>
            </div>
          ))}
        </Panel>
      );
    }

    if (detail.type === 'milestones') {
      return (
        <Panel title="Milestones & invoicing" subtitle="6 committed · 3 PM placeholders" notionUrl={programme.notionUrl}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: theme.surfaceElevated, border: `1px solid ${theme.rule}`, borderRadius: '3px' }}>
              <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '6px', fontWeight: 500 }}>Total fee</div>
              <div style={{ fontFamily: fontStack, fontSize: '26px', color: theme.ink, fontWeight: 600 }}>${programme.fee}k</div>
            </div>
            <div style={{ padding: '16px', background: theme.surfaceElevated, border: `1px solid ${theme.rule}`, borderRadius: '3px' }}>
              <div style={{ fontSize: '11px', fontFamily: fontStack, color: theme.muted, marginBottom: '6px', fontWeight: 500 }}>Invoiced to date</div>
              <div style={{ fontFamily: fontStack, fontSize: '26px', color: theme.ink, fontWeight: 600 }}>$0k</div>
            </div>
          </div>
          {milestones.map((m, i) => (
            <div key={i} style={{ padding: '14px 0', borderBottom: i < milestones.length - 1 ? `1px solid ${theme.ruleSoft}` : 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontFamily: monoStack, fontSize: '12px', color: theme.muted, width: '48px' }}>{m.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: theme.ink, marginBottom: '4px', fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: '12px', color: theme.muted, fontFamily: monoStack }}>Week {m.week} · {m.pct}%</div>
              </div>
              <div style={{ fontFamily: fontStack, fontSize: '18px', color: theme.ink, minWidth: '70px', textAlign: 'right', fontWeight: 600 }}>${m.amount}k</div>
              <Pill label={m.status === 'in-progress' ? 'In progress' : 'Upcoming'} color={m.status === 'in-progress' ? theme.amber : theme.muted} bg={m.status === 'in-progress' ? theme.amberBg : theme.surfaceElevated} />
            </div>
          ))}
          <div style={{ padding: '14px 0', fontSize: '13px', color: theme.muted, fontFamily: fontStack }}>
            + M-PM1 (Wk4) · M-PM2 (Wk7) · M-PM3 (Wk9) — sized after Mark P sign-off
          </div>
        </Panel>
      );
    }

    if (detail.type === 'value') {
      return (
        <Panel title="Value tracking" subtitle={`${valueMetrics.length} metrics · SOW §6`} notionUrl={programme.notionUrl}>
          <p style={{ fontFamily: fontStack, fontSize: '14px', color: theme.inkSoft, lineHeight: 1.5, marginTop: 0, marginBottom: '20px' }}>
            Business-case metrics updated at milestones. Baselines captured in Week 1; targets measured at Week 8 UAT.
          </p>
          {['F&A', 'S&RM', 'PM'].map(wsGroup => {
            const group = valueMetrics.filter(v => v.ws === wsGroup);
            if (group.length === 0) return null;
            return (
              <div key={wsGroup} style={{ marginBottom: '24px' }}>
                <SectionHeader label={wsGroup} />
                {group.map((v, i) => (
                  <div key={i} style={{ padding: '14px 0', borderBottom: i < group.length - 1 ? `1px solid ${theme.ruleSoft}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px' }}>
                      <div style={{ fontSize: '14px', color: theme.ink, lineHeight: 1.4, flex: 1, fontWeight: 500 }}>{v.metric}</div>
                      <Pill label={v.confidence} color={v.confidence === 'High' ? theme.green : v.confidence === 'Medium' ? theme.amber : theme.muted} bg={v.confidence === 'High' ? theme.greenBg : v.confidence === 'Medium' ? theme.amberBg : theme.surfaceElevated} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: theme.inkSoft, fontFamily: monoStack, marginTop: '6px' }}>
                      <div><span style={{ color: theme.muted }}>baseline →</span> {v.baseline}</div>
                      <div><span style={{ color: theme.muted }}>target →</span> {v.target}</div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </Panel>
      );
    }
  };

  // ============================================================
  // MAIN LAYOUT
  // ============================================================
  return (
    <div style={{
      fontFamily: fontStack, background: theme.bg, minHeight: '100vh',
      color: theme.ink, padding: 0, transition: 'background 0.2s, color 0.2s',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        * { box-sizing: border-box }
        body { margin: 0 }
      `}</style>

      {/* TOP NAV */}
      <div style={{
        borderBottom: `1px solid ${theme.rule}`, background: theme.bg,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ fontFamily: fontStack, fontSize: '15px', fontWeight: 700, color: theme.ink, letterSpacing: '-0.02em' }}>
              Motive<span style={{ color: theme.muted, fontWeight: 400 }}> · Create</span>
            </div>
            <div style={{ width: '1px', height: '16px', background: theme.rule }} />
            <div style={{ fontFamily: fontStack, fontSize: '13px', color: theme.muted }}>
              Engagement dashboard
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontFamily: monoStack, fontSize: '11px', color: theme.muted }}>
              {programme.today}
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                width: '34px', height: '34px', border: `1px solid ${theme.rule}`,
                background: 'transparent', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: theme.ink,
                borderRadius: '3px', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = theme.surfaceHover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              title={isDark ? 'Switch to light' : 'Switch to dark'}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* MASTHEAD */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '36px 40px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '400px' }}>
            <h1 style={{
              fontFamily: fontStack, fontSize: '42px', fontWeight: 700, margin: 0,
              letterSpacing: '-0.035em', lineHeight: 1.05, color: theme.ink,
            }}>{programme.name}</h1>
            <div style={{ fontFamily: fontStack, fontSize: '15px', color: theme.muted, marginTop: '10px', fontWeight: 400 }}>
              A 9-week AI & Data Labs engagement between {programme.supplier} and {programme.client}.
            </div>
          </div>
          <div style={{ fontFamily: fontStack, fontSize: '12px', color: theme.muted, lineHeight: 1.8, textAlign: 'right' }}>
            <div><span style={{ color: theme.mutedSoft }}>Fee</span>  <span style={{ color: theme.ink, fontWeight: 500 }}>${programme.fee}k fixed</span></div>
            <div><span style={{ color: theme.mutedSoft }}>PM</span>  <span style={{ color: theme.ink, fontWeight: 500 }}>{programme.clientPM}</span></div>
            <div><span style={{ color: theme.mutedSoft }}>Lead</span>  <span style={{ color: theme.ink, fontWeight: 500 }}>{programme.workstreamLead}</span></div>
          </div>
        </div>

        {/* Week bar */}
        <div style={{ marginTop: '24px', padding: '16px 0', borderTop: `1px solid ${theme.rule}`, borderBottom: `1px solid ${theme.rule}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontFamily: fontStack, fontSize: '12px', color: theme.muted, fontWeight: 500 }}>
              Programme timeline
            </div>
            <div style={{ fontFamily: monoStack, fontSize: '11px', color: theme.muted }}>
              {programme.start} → {programme.end} · Week {programme.currentWeek} of {programme.totalWeeks}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${programme.totalWeeks}, 1fr)`, gap: '4px' }}>
            {Array.from({ length: programme.totalWeeks }, (_, i) => {
              const wk = i + 1;
              const isPast = wk < programme.currentWeek;
              const isCurrent = wk === programme.currentWeek;
              const mThisWeek = milestones.filter(m => m.week === wk);
              return (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{
                    height: '6px', borderRadius: '2px',
                    background: isCurrent ? theme.accent : isPast ? theme.ink : theme.rule,
                  }} />
                  <div style={{
                    fontFamily: monoStack, fontSize: '10px',
                    color: isCurrent ? theme.accent : theme.muted, marginTop: '8px',
                    fontWeight: isCurrent ? 600 : 400,
                  }}>W{wk}</div>
                  {mThisWeek.length > 0 && (
                    <div style={{ fontFamily: monoStack, fontSize: '10px', color: theme.ink, marginTop: '2px', fontWeight: 500 }}>
                      {mThisWeek.map(m => m.id).join(' ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* WHAT CHANGED THIS WEEK — the thing that turns a status page into something people return to */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 40px 0' }}>
        <div style={{
          background: theme.surface,
          border: `1px solid ${theme.rule}`,
          borderRadius: '4px',
          padding: '22px 26px',
          position: 'relative',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
              <div style={{
                fontFamily: fontStack, fontSize: '11px', fontWeight: 700,
                color: theme.accent, letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>This week</div>
              <div style={{ fontFamily: monoStack, fontSize: '11px', color: theme.muted }}>
                {weeklyDelta.weekOf}
              </div>
            </div>
            <div style={{ fontFamily: monoStack, fontSize: '10px', color: theme.mutedSoft }}>
              Updated Fridays
            </div>
          </div>

          <p style={{
            fontFamily: fontStack, fontSize: '20px', fontWeight: 500,
            color: theme.ink, margin: '0 0 20px', lineHeight: 1.35,
            letterSpacing: '-0.015em',
          }}>
            {weeklyDelta.headline}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 28px' }}>
            {weeklyDelta.changes.map((c, i) => {
              const color = c.direction === 'up' ? theme.green : c.direction === 'down' ? theme.red : theme.muted;
              const symbol = c.direction === 'up' ? '↑' : c.direction === 'down' ? '↓' : '→';
              return (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    fontFamily: monoStack, fontSize: '15px', fontWeight: 700,
                    color, lineHeight: 1.3, width: '14px', flexShrink: 0,
                  }}>{symbol}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', color: theme.ink, fontWeight: 500, lineHeight: 1.4, marginBottom: '2px' }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.muted, lineHeight: 1.45 }}>
                      {c.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* VITALS STRIP */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 40px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1px', background: theme.rule, border: `1px solid ${theme.rule}`, borderRadius: '4px', overflow: 'hidden' }}>
          <KPI label="Overall RAG" value="Amber" sub="Week 1 dependency cascade" accent={theme.amber} />
          <KPI label="High-sev risks open" value={openHighRisks} sub="Monitor daily" accent={theme.red} />
          <KPI label="Late client commitments" value={lateCommitments} sub={`${notStartedCount} not started`} accent={theme.red} onClick={() => setDetail({ type: 'commitment' })} />
          <KPI label="Pending decisions" value={pendingDecisions} sub="CR#1 · PM scope" accent={theme.amber} onClick={() => setDetail({ type: 'decisions' })} />
          <KPI label="Invoice pipeline" value={`$${invoicePipeline}k`} sub="$0k invoiced" accent={theme.ink} onClick={() => setDetail({ type: 'milestones' })} />
        </div>
      </div>

      {/* §01 WORKSTREAMS */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 40px 16px' }}>
        <SectionHeader label="Workstreams" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {workstreams.map(ws => {
            const progressPct = ws.committed > 0 ? (ws.done / ws.committed) * 100 : 0;
            return (
              <div
                key={ws.id}
                onClick={() => setDetail({ type: 'workstream', id: ws.id })}
                style={{
                  padding: '22px 24px', background: theme.surface,
                  border: `1px solid ${theme.rule}`, cursor: 'pointer',
                  transition: 'all 0.15s', borderRadius: '4px',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = theme.surfaceHover; e.currentTarget.style.borderColor = theme.mutedSoft; }}
                onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.borderColor = theme.rule; }}
              >
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                  background: ragColor(ws.rag),
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontFamily: monoStack, fontSize: '10px', color: theme.muted, marginBottom: '6px', letterSpacing: '0.02em' }}>{ws.short}</div>
                    <h3 style={{ fontFamily: fontStack, fontSize: '19px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em', color: theme.ink, lineHeight: 1.25 }}>{ws.name}</h3>
                  </div>
                  <ArrowUpRight size={16} style={{ color: theme.mutedSoft, flexShrink: 0, marginTop: '2px' }} />
                </div>
                <p style={{ fontFamily: fontStack, fontSize: '13px', color: theme.muted, lineHeight: 1.5, margin: '0 0 16px' }}>
                  {ws.thesis}
                </p>
                <div style={{ height: '3px', background: theme.ruleSoft, marginBottom: '12px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressPct}%`, background: ragColor(ws.rag) }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: monoStack, fontSize: '11px', color: theme.muted }}>
                  <span>{ws.done}/{ws.committed} done{ws.blocked > 0 ? ` · ${ws.blocked} blocked` : ''}</span>
                  <span>{ws.lead} · {ws.sponsor}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* §02 MILESTONES */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 40px 16px' }}>
        <SectionHeader label="Milestones & invoicing" />
        <div
          onClick={() => setDetail({ type: 'milestones' })}
          style={{
            background: theme.surface, border: `1px solid ${theme.rule}`,
            padding: '26px 28px', cursor: 'pointer', transition: 'all 0.15s',
            borderRadius: '4px',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = theme.surfaceHover; e.currentTarget.style.borderColor = theme.mutedSoft; }}
          onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.borderColor = theme.rule; }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {milestones.map((m, i) => {
              const isCurrent = m.week === programme.currentWeek;
              return (
                <div key={m.id} style={{
                  paddingLeft: i === 0 ? 0 : '16px',
                  borderLeft: i === 0 ? 'none' : `1px solid ${theme.ruleSoft}`,
                }}>
                  <div style={{ fontFamily: monoStack, fontSize: '11px', color: theme.muted, marginBottom: '10px' }}>
                    {m.id} · Wk{m.week}
                  </div>
                  <div style={{ fontFamily: fontStack, fontSize: '26px', color: isCurrent ? theme.accent : theme.ink, fontWeight: 700, lineHeight: 1, marginBottom: '10px', letterSpacing: '-0.03em' }}>
                    ${m.amount}k
                  </div>
                  <div style={{ fontSize: '12px', color: theme.inkSoft, lineHeight: 1.35, marginBottom: '10px', minHeight: '32px' }}>
                    {m.label}
                  </div>
                  <div style={{ fontFamily: monoStack, fontSize: '10px', color: isCurrent ? theme.accent : theme.muted, fontWeight: isCurrent ? 600 : 400 }}>
                    {m.pct}% · {isCurrent ? 'IN PROGRESS' : 'UPCOMING'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* §03 / §04 RISKS + DECISIONS */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 40px 16px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div>
          <SectionHeader label="RAID · items needing leadership attention" />
          <div style={{ background: theme.surface, border: `1px solid ${theme.rule}`, borderRadius: '4px' }}>
            {risks.slice(0, 6).map((r, i) => (
              <div
                key={r.id}
                onClick={() => setDetail({ type: 'risk', id: r.id })}
                style={{
                  padding: '14px 18px', borderBottom: i < 5 ? `1px solid ${theme.ruleSoft}` : 'none',
                  cursor: 'pointer', transition: 'background 0.1s',
                  display: 'flex', gap: '14px', alignItems: 'flex-start',
                }}
                onMouseEnter={e => e.currentTarget.style.background = theme.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: r.severity === 'High' ? theme.red : theme.amber,
                  flexShrink: 0, marginTop: '7px',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', color: theme.ink, lineHeight: 1.4, marginBottom: '4px', fontWeight: 500 }}>{r.item}</div>
                  <div style={{ fontFamily: monoStack, fontSize: '11px', color: theme.muted }}>
                    {r.type} · {r.ws} · {r.owner} · {r.status}
                  </div>
                </div>
                <ArrowUpRight size={14} style={{ color: theme.mutedSoft, flexShrink: 0, marginTop: '3px' }} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader label="Decisions pending" />
          <div
            onClick={() => setDetail({ type: 'decisions' })}
            style={{
              background: theme.surface, border: `1px solid ${theme.rule}`,
              padding: '18px 22px', cursor: 'pointer', transition: 'all 0.15s',
              borderRadius: '4px', height: 'calc(100% - 34px)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.surfaceHover; e.currentTarget.style.borderColor = theme.mutedSoft; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.borderColor = theme.rule; }}
          >
            {decisions.filter(d => d.status === 'Pending decision').map((d, i, arr) => (
              <div key={d.id} style={{ padding: '10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${theme.ruleSoft}` : 'none' }}>
                <div style={{ fontSize: '14px', color: theme.ink, lineHeight: 1.35, marginBottom: '6px', fontWeight: 500 }}>{d.item}</div>
                <div style={{ fontFamily: monoStack, fontSize: '11px', color: theme.muted }}>
                  {d.owner} · by {d.target}
                </div>
              </div>
            ))}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: `1px solid ${theme.ruleSoft}`, fontFamily: monoStack, fontSize: '11px', color: theme.muted, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{decisions.length - pendingDecisions} closed this week</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* §05 / §06 COMMITMENTS + VALUE */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 40px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <SectionHeader label="Client commitments · Hanna conversation" />
          <div
            onClick={() => setDetail({ type: 'commitment' })}
            style={{
              background: theme.surface, border: `1px solid ${theme.rule}`,
              padding: '22px 24px', cursor: 'pointer', transition: 'all 0.15s',
              borderRadius: '4px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.surfaceHover; e.currentTarget.style.borderColor = theme.mutedSoft; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.borderColor = theme.rule; }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: "Total", value: commitments.length, color: theme.ink },
                { label: "Delivered", value: commitments.filter(c => c.status === 'Delivered').length, color: theme.green },
                { label: "Late", value: lateCommitments, color: theme.red },
                { label: "Not started", value: notStartedCount, color: theme.amber },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: fontStack, fontSize: '30px', color: s.color, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</div>
                  <div style={{ fontFamily: fontStack, fontSize: '11px', color: theme.muted, marginTop: '8px', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${theme.ruleSoft}`, paddingTop: '14px' }}>
              <div style={{ fontFamily: fontStack, fontSize: '11px', color: theme.muted, marginBottom: '10px', fontWeight: 500 }}>Top late / not-started</div>
              {commitments.filter(c => c.status === 'Late' || c.due === 'Apr 22' || c.due === 'Apr 23').slice(0, 3).map((c, i) => (
                <div key={i} style={{ padding: '8px 0', fontSize: '13px', color: theme.inkSoft, display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline' }}>
                  <span style={{ flex: 1 }}>{c.item}</span>
                  <span style={{ fontFamily: monoStack, fontSize: '11px', color: c.status === 'Late' ? theme.red : theme.muted, flexShrink: 0, fontWeight: c.status === 'Late' ? 600 : 400 }}>{c.due}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionHeader label="Value tracking · SOW §6" />
          <div
            onClick={() => setDetail({ type: 'value' })}
            style={{
              background: theme.surface, border: `1px solid ${theme.rule}`,
              padding: '22px 24px', cursor: 'pointer', transition: 'all 0.15s',
              borderRadius: '4px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = theme.surfaceHover; e.currentTarget.style.borderColor = theme.mutedSoft; }}
            onMouseLeave={e => { e.currentTarget.style.background = theme.surface; e.currentTarget.style.borderColor = theme.rule; }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: "Metrics", value: valueMetrics.length, color: theme.ink },
                { label: "Baselines", value: valueMetrics.filter(v => v.status === 'Baseline captured').length, color: theme.accent },
                { label: "High conf.", value: valueMetrics.filter(v => v.confidence === 'High').length, color: theme.green },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: fontStack, fontSize: '30px', color: s.color, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</div>
                  <div style={{ fontFamily: fontStack, fontSize: '11px', color: theme.muted, marginTop: '8px', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${theme.ruleSoft}`, paddingTop: '14px' }}>
              <div style={{ fontFamily: fontStack, fontSize: '11px', color: theme.muted, marginBottom: '10px', fontWeight: 500 }}>Headline targets</div>
              {[
                { m: "AP team FTE released", t: "1-2 FTE" },
                { m: "Sales capacity released", t: "2.5-3.5 FTE · ~$550-770k" },
                { m: "Revenue-at-risk protected", t: "$1-4M" },
              ].map((x, i) => (
                <div key={i} style={{ padding: '8px 0', fontSize: '13px', color: theme.inkSoft, display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline' }}>
                  <span style={{ flex: 1 }}>{x.m}</span>
                  <span style={{ fontFamily: monoStack, fontSize: '11px', color: theme.ink, flexShrink: 0, fontWeight: 500 }}>{x.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 40px 36px' }}>
        <div style={{ borderTop: `1px solid ${theme.rule}`, paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: fontStack, fontSize: '11px', color: theme.muted, flexWrap: 'wrap', gap: '12px' }}>
          <div>Data live from Notion · Last sync {programme.today}, 17:48 UTC</div>
          <div>Sponsors: {programme.sponsors.join(' · ')}</div>
        </div>
      </div>

      {renderDetail()}
    </div>
  );
}
