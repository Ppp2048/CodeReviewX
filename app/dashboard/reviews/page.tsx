import type { Route } from "next";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRiskBadgeVariant, formatReviewTimestamp } from "@/lib/reviews/presentation";
import { listReviewsForUser, getCurrentUser } from "@/lib/reviews/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const supabase = await createServerSupabaseClient();
  const user = supabase ? await getCurrentUser(supabase) : null;
  const reviews = supabase && user ? await listReviewsForUser(supabase, user) : [];

  return (
    <Card className="bg-white/[0.03]">
      <CardHeader>
        <CardTitle>Review history</CardTitle>
        <CardDescription>
          Browse saved analysis reports, compare risk levels, and reopen detailed file findings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 p-8 text-center">
            <p className="text-lg font-medium text-white">No saved reviews yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Run your first GitHub PR or pasted diff analysis to start building a review history.
            </p>
            <Link href="/dashboard/new-review" className="mt-5 inline-flex">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Start a new review
              </Button>
            </Link>
          </div>
        ) : (
          reviews.map((review) => (
            <Link
              key={review.id}
              href={`/dashboard/reviews/${review.id}` as Route}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={review.source_type === "github_pr" ? "accent" : "neutral"}>
                      {review.source_type === "github_pr" ? "GitHub PR" : "Pasted diff"}
                    </Badge>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {formatReviewTimestamp(review.created_at)}
                    </span>
                  </div>
                  <p className="font-medium text-white">{review.title ?? "Untitled review"}</p>
                  <p className="text-sm text-slate-400">
                    {[review.repo_owner, review.repo_name].filter(Boolean).join("/") || "Manual diff source"}
                    {review.pr_number ? ` · PR #${review.pr_number}` : ""}
                    {review.author ? ` · ${review.author}` : ""}
                  </p>
                </div>
                <Badge variant={getRiskBadgeVariant(review.risk_level)}>
                  {review.risk_level} · {review.overall_risk_score}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-5 text-sm text-slate-400">
                <span>{review.fileCount} files</span>
                <span>{review.issueCount} issues</span>
                <span>{review.suggested_tests ? review.suggested_tests.split("\n").length : 0} suggested tests</span>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
