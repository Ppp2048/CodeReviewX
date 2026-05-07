import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { ReviewFilesPanel } from "@/components/review/review-files-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getRiskBadgeVariant, getSeverityBadgeVariant, formatReviewTimestamp } from "@/lib/reviews/presentation";
import { getCurrentUser, getReviewDetailForUser } from "@/lib/reviews/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const severityOrder = ["critical", "high", "medium", "low"] as const;

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    notFound();
  }

  const user = await getCurrentUser(supabase);

  if (!user) {
    notFound();
  }

  const detail = await getReviewDetailForUser(supabase, user, id);

  if (!detail) {
    notFound();
  }

  const issuesBySeverity = Object.fromEntries(
    severityOrder.map((severity) => [
      severity,
      detail.issues.filter((issue) => issue.severity === severity),
    ]),
  ) as Record<(typeof severityOrder)[number], typeof detail.issues>;
  const filePathById = new Map(detail.files.map((file) => [file.id, file.file_path]));

  const summaryLines = detail.review.ai_summary?.split(/\n+/).filter(Boolean) ?? [];
  const suggestedTests = detail.review.suggested_tests?.split(/\n+/).filter(Boolean) ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/reviews" className="inline-flex w-fit">
          <Button variant="ghost" className="pl-0 text-slate-300 hover:bg-transparent hover:text-white">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to reviews
          </Button>
        </Link>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={detail.review.source_type === "github_pr" ? "accent" : "neutral"}>
                {detail.review.source_type === "github_pr" ? "GitHub PR" : "Pasted diff"}
              </Badge>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {formatReviewTimestamp(detail.review.created_at)}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-400">
                {[detail.review.repo_owner, detail.review.repo_name].filter(Boolean).join("/") || "Manual diff source"}
                {detail.review.pr_number ? ` · PR #${detail.review.pr_number}` : ""}
                {detail.review.author ? ` · ${detail.review.author}` : ""}
              </p>
              <h2 className="text-3xl font-semibold text-white">
                {detail.review.title ?? "Untitled review"}
              </h2>
            </div>
            {detail.review.pr_url ? (
              <a
                href={detail.review.pr_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-cyan-300 hover:text-cyan-200"
              >
                {detail.review.pr_url}
              </a>
            ) : null}
          </div>
          <Badge variant={getRiskBadgeVariant(detail.review.risk_level)} className="w-fit">
            {detail.review.risk_level} risk · {detail.review.overall_risk_score}/100
          </Badge>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardDescription>Overall risk score</CardDescription>
            <CardTitle className="text-3xl">{detail.review.overall_risk_score}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardDescription>Risk level</CardDescription>
            <CardTitle className="capitalize">{detail.review.risk_level}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardDescription>Changed files</CardDescription>
            <CardTitle>{detail.files.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardDescription>Detected issues</CardDescription>
            <CardTitle>{detail.issues.length}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardTitle>Rule-based summary</CardTitle>
            <CardDescription>
              Deterministic output from the current static analysis engine.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-300">
            {summaryLines.length > 0 ? (
              summaryLines.map((line) => (
                <p key={line}>{line}</p>
              ))
            ) : (
              <p className="text-slate-400">No summary text was stored for this review.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardTitle>Suggested tests</CardTitle>
            <CardDescription>
              Regression coverage ideas derived from the highest-risk findings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
            {suggestedTests.length > 0 ? (
              suggestedTests.map((test) => (
                <div key={test} className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  {test}
                </div>
              ))
            ) : (
              <p className="text-slate-400">No suggested tests were stored for this review.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <ReviewFilesPanel files={detail.files} issues={detail.issues} />

      <div className="grid gap-6 xl:grid-cols-2">
        {severityOrder.map((severity) => (
          <Card key={severity} className="bg-white/[0.03]">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="capitalize">{severity} issues</CardTitle>
                  <CardDescription>
                    {issuesBySeverity[severity].length === 0
                      ? `No ${severity} findings in this report.`
                      : `${issuesBySeverity[severity].length} ${severity} finding${issuesBySeverity[severity].length === 1 ? "" : "s"} grouped below.`}
                  </CardDescription>
                </div>
                <Badge variant={getSeverityBadgeVariant(severity)}>
                  {issuesBySeverity[severity].length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {issuesBySeverity[severity].length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
                  Nothing to review in this severity band.
                </div>
              ) : (
                issuesBySeverity[severity].map((issue) => (
                  <div
                    key={issue.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getSeverityBadgeVariant(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      <Badge variant="neutral">{issue.category}</Badge>
                    </div>
                    <p className="mt-3 font-medium text-white">{issue.title}</p>
                    {issue.description ? (
                      <p className="mt-2 text-sm leading-6 text-slate-400">{issue.description}</p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                      <span>
                        {issue.file_id
                          ? filePathById.get(issue.file_id) ?? "Attached to changed file"
                          : "Repository-level issue"}
                      </span>
                      {issue.line_number ? <span>Line {issue.line_number}</span> : null}
                    </div>
                    {issue.recommendation ? (
                      <div className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                        {issue.recommendation}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
