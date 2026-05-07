import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ReviewListItem } from "@/lib/reviews/queries";
import { formatReviewTimestamp, getRiskBadgeVariant } from "@/lib/reviews/presentation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReviewListCard({ reviews }: { reviews: ReviewListItem[] }) {
  return (
    <Card className="bg-white/[0.03]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Recent reviews</CardTitle>
          <CardDescription>Saved reports with the most recent reviewer activity.</CardDescription>
        </div>
        <Link href="/dashboard/reviews">
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/30 p-8 text-center">
            <p className="text-lg font-medium text-white">No reviews yet</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Run a live or demo review to populate recent activity and dashboard trends.
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <Link
              key={review.id}
              href={`/dashboard/reviews/${review.id}`}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.04] md:flex-row md:items-center md:justify-between"
            >
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {formatReviewTimestamp(review.created_at)}
                </p>
                <p className="font-medium text-white">{review.title ?? "Untitled review"}</p>
                <p className="text-sm text-slate-400">
                  {[review.repo_owner, review.repo_name].filter(Boolean).join("/") || "Manual diff source"}{" "}
                  | {review.issueCount} issues | {review.fileCount} files
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getRiskBadgeVariant(review.risk_level)}>
                  {review.risk_level} | {review.overall_risk_score}
                </Badge>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
