import { Activity, AlertTriangle, FolderKanban, ShieldAlert, Tags } from "lucide-react";

import { DashboardTrends } from "@/components/dashboard/dashboard-trends";
import { MetricCard } from "@/components/dashboard/metric-card";
import { ReviewListCard } from "@/components/dashboard/review-list-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, getDashboardOverview } from "@/lib/reviews/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const user = supabase ? await getCurrentUser(supabase) : null;
  const overview = supabase && user ? await getDashboardOverview(supabase, user) : null;

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Saved reviews"
          value={String(overview?.totalReviews ?? 0)}
          helper="Reports available in this workspace"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <MetricCard
          label="High-risk reviews"
          value={String(overview?.highRiskReviews ?? 0)}
          helper="High or critical reports"
          icon={<ShieldAlert className="h-5 w-5" />}
        />
        <MetricCard
          label="Average risk score"
          value={String(overview?.averageRiskScore ?? 0)}
          helper="Across all saved reviews"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          label="Needs attention"
          value={String(overview?.reviewsNeedingAttention ?? 0)}
          helper="Reports with detected issues"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </section>

      <DashboardTrends
        reviewVolume={overview?.reviewVolume ?? []}
        riskDistribution={overview?.riskDistribution ?? []}
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ReviewListCard reviews={overview?.recentReviews ?? []} />

        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardTitle>Common issue categories</CardTitle>
            <CardDescription>What the analyzer flags most often across your saved reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {overview?.commonIssueCategories.length ? (
              overview.commonIssueCategories.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                      <Tags className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.category}</p>
                      <p className="text-sm text-slate-400">Detected across saved review issues</p>
                    </div>
                  </div>
                  <Badge variant="accent">{item.count}</Badge>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/30 p-8 text-center">
                <p className="text-lg font-medium text-white">No issue trends yet</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Once you run demo or live reviews, the dashboard will show your most common analyzer categories here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
