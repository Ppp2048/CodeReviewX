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

      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>What ships in Phase 5</CardTitle>
          <CardDescription>
            This milestone turns the analyzer foundation into a usable review flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm leading-6 text-slate-400 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            Analyze from GitHub PR URLs with optional token support for private repositories.
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            Save report metadata, files, issues, and risk scoring into your Supabase workspace.
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
            Review the result with grouped issues, per-file scores, and an inline diff viewer.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
