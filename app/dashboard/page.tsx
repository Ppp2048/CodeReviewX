import { Activity, AlertTriangle, FolderKanban, ShieldAlert } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import { ReviewListCard } from "@/components/dashboard/review-list-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Open review sessions"
          value="24"
          helper="Across active repos"
          icon={<FolderKanban className="h-5 w-5" />}
        />
        <MetricCard
          label="High-risk items"
          value="06"
          helper="Awaiting triage"
          icon={<ShieldAlert className="h-5 w-5" />}
        />
        <MetricCard
          label="Average risk band"
          value="42"
          helper="Simulated dashboard score"
          icon={<Activity className="h-5 w-5" />}
        />
        <MetricCard
          label="Needs reviewer attention"
          value="11"
          helper="Potentially blocking changes"
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ReviewListCard />

        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardTitle>Phase roadmap status</CardTitle>
            <CardDescription>Only the scaffold is implemented in this milestone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-white">Phase 1</p>
                <Badge variant="success">Complete</Badge>
              </div>
              <p className="text-sm leading-6 text-slate-300">
                App shell, auth pages, dashboard routes, settings, Tailwind, and
                shadcn-style components are in place.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-white">Phase 2+</p>
                <Badge>Not started</Badge>
              </div>
              <p className="text-sm leading-6 text-slate-400">
                Supabase auth, database tables, GitHub PR analysis, and AI summaries
                are intentionally deferred.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
