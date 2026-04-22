import type { WeeklyDelta } from "./types";

// Update this manually each Friday. Keep it short and sharp.
// direction: "up" = progress, "down" = concern, "flat" = status quo / FYI
export const weeklyDelta: WeeklyDelta = {
  weekOf: "Apr 20–26, 2026",
  headline:
    "Week 1 is all pending — SOW sign-off is the gate, every access + decision sits behind it.",
  changes: [
    {
      direction: "down",
      label: "SOW still unsigned",
      detail:
        "Blocks M1 invoice and gates all downstream provisioning. Chasing counter-signature.",
    },
    {
      direction: "flat",
      label:
        "All client-side access pending — AP inbox, AWS/Bedrock, Salesforce, Tipalti",
      detail:
        "Queued behind SOW. Owners named in commitments log; 72-hr SLA per SOW §9 once signed.",
    },
    {
      direction: "down",
      label:
        "2 decisions pending — Mark P (Apr 22) + CR#1 (Apr 24)",
      detail:
        "Mark P sign-off unlocks 13 PM tasks; CR#1 ratifies 9-week extension.",
    },
    {
      direction: "flat",
      label: "6 Wilshire-side dependencies still not started",
      detail:
        "Tracked twice-weekly with Hanna. No single item at red yet.",
    },
  ],
};
