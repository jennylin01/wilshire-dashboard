import { notFound } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ENGAGEMENT_SLUGS, getEngagement } from "@/lib/engagements";
import { loadDashboardData } from "@/lib/load-data";

export const dynamic = "force-dynamic";

// Pre-generate static params for every known engagement. Unknown slugs fall
// through to notFound() at request time.
export function generateStaticParams() {
  return ENGAGEMENT_SLUGS.map((slug) => ({ slug }));
}

export default async function EngagementDashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!getEngagement(params.slug)) notFound();

  let data;
  try {
    data = await loadDashboardData(params.slug);
  } catch (err) {
    return (
      <div
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "40px",
          maxWidth: "800px",
          margin: "0 auto",
          color: "#0a0a0a",
        }}
      >
        <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>
          Can&apos;t reach Notion
        </h1>
        <p style={{ color: "#737373", marginBottom: "16px" }}>
          The dashboard couldn&apos;t load data from the Notion workspace.
          Check that{" "}
          <code
            style={{
              background: "#f5f5f5",
              padding: "2px 6px",
              borderRadius: "3px",
            }}
          >
            NOTION_TOKEN
          </code>{" "}
          is set and that the integration has access to this engagement&apos;s
          databases.
        </p>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "12px",
            borderRadius: "4px",
            fontSize: "12px",
            overflow: "auto",
          }}
        >
          {String((err as Error)?.message ?? err)}
        </pre>
      </div>
    );
  }

  if (!data) notFound();
  return <Dashboard data={data} />;
}
