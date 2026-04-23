import { Hub } from "@/components/hub/Hub";
import { listEngagements } from "@/lib/engagements";
import { loadDashboardData } from "@/lib/load-data";
import type { DashboardData } from "@/lib/types";

export const dynamic = "force-dynamic";

export interface HubEntry {
  slug: string;
  data: DashboardData | null;
  error: string | null;
}

export default async function MasterHubPage() {
  const engagements = listEngagements();
  const entries: HubEntry[] = await Promise.all(
    engagements.map(async (e) => {
      try {
        const data = await loadDashboardData(e.slug);
        return { slug: e.slug, data, error: data ? null : "Missing data" };
      } catch (err) {
        return {
          slug: e.slug,
          data: null,
          error: (err as Error)?.message ?? String(err),
        };
      }
    })
  );

  return <Hub entries={entries} />;
}
