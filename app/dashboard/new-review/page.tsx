import { createDemoReviewAction } from "@/app/dashboard/new-review/actions";
import { DemoReviewCard } from "@/components/review/demo-review-card";
import { NewReviewForm } from "@/components/review/new-review-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewReviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="accent" className="w-fit">
          Review workflow
        </Badge>
        <h2 className="text-3xl font-semibold text-white">New review</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-400">
          Analyze a GitHub pull request or a pasted diff, persist the report to Supabase,
          and jump straight into a file-by-file risk review.
        </p>
      </div>

      <NewReviewForm />
      <DemoReviewCard action={createDemoReviewAction} />

      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Phase 7 polish</CardTitle>
          <CardDescription>
            This stage rounds out the demo and reporting experience around the existing review workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-slate-400 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            Markdown export is available from each saved report for stakeholder sharing and handoff.
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            Demo mode can seed the dashboard with a realistic risky pull request using local fixtures.
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            Dashboard charts and common issue categories now reflect saved report history.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
