import type { SupabaseClient } from "@supabase/supabase-js";

import type { GeneratedReviewSummary } from "@/lib/ai/types";
import { serializeGeneratedSummary } from "@/lib/ai/summary";
import type { Database, ReviewFileInsert, ReviewInsert, ReviewIssueInsert } from "@/lib/db/types";
import type { GitHubPrFile, GitHubPrMetadata, ParsedPrUrl } from "@/lib/github/types";

type PersistReviewInput = {
  supabase: SupabaseClient<Database>;
  userId: string;
  sourceType: "github_pr" | "diff_upload";
  parsedPrUrl?: ParsedPrUrl;
  pullRequest?: GitHubPrMetadata;
  files: GitHubPrFile[];
  summary: GeneratedReviewSummary;
  overallRiskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  issues: Array<{
    filePath: string | null;
    severity: "low" | "medium" | "high" | "critical";
    category: string;
    title: string;
    description: string;
    recommendation: string;
    lineNumber: number | null;
  }>;
  fileRisks: Array<{
    filePath: string;
    additions: number;
    deletions: number;
    score: number;
    riskLevel: "low" | "medium" | "high" | "critical";
  }>;
  rawDiff: string | null;
};

export async function persistReview({
  supabase,
  userId,
  sourceType,
  parsedPrUrl,
  pullRequest,
  files,
  summary,
  overallRiskScore,
  riskLevel,
  issues,
  fileRisks,
  rawDiff,
}: PersistReviewInput) {
  const reviewInsert: ReviewInsert = {
    user_id: userId,
    source_type: sourceType,
    pr_url: parsedPrUrl?.normalizedUrl ?? null,
    repo_owner: parsedPrUrl?.owner ?? null,
    repo_name: parsedPrUrl?.repo ?? null,
    pr_number: parsedPrUrl?.pullNumber ?? null,
    title:
      pullRequest?.title ??
      `Manual diff review ${new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date())}`,
    author: pullRequest?.user.login ?? null,
    overall_risk_score: overallRiskScore,
    risk_level: riskLevel,
    ai_summary: serializeGeneratedSummary(summary),
    suggested_tests:
      summary.suggestedTests.length > 0
        ? summary.suggestedTests.join("\n")
        : null,
    raw_diff: rawDiff,
  };

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert(reviewInsert)
    .select("*")
    .single();

  if (reviewError) {
    throw new Error(reviewError.message);
  }

  const fileInserts: ReviewFileInsert[] = fileRisks.map((fileRisk) => {
    const sourceFile = files.find((file) => file.filename === fileRisk.filePath);

    return {
      review_id: review.id,
      file_path: fileRisk.filePath,
      status: sourceFile?.status ?? "modified",
      additions: sourceFile?.additions ?? fileRisk.additions,
      deletions: sourceFile?.deletions ?? fileRisk.deletions,
      patch: sourceFile?.patch ?? null,
      risk_score: fileRisk.score,
      risk_level: fileRisk.riskLevel,
    };
  });

  const { data: insertedFiles, error: fileError } = await supabase
    .from("review_files")
    .insert(fileInserts)
    .select("*");

  if (fileError) {
    throw new Error(fileError.message);
  }

  const fileIdByPath = new Map(insertedFiles.map((file) => [file.file_path, file.id]));

  const issueInserts: ReviewIssueInsert[] = issues.map((issue) => ({
    review_id: review.id,
    file_id: issue.filePath ? fileIdByPath.get(issue.filePath) ?? null : null,
    severity: issue.severity,
    category: issue.category,
    title: issue.title,
    description: issue.description,
    recommendation: issue.recommendation,
    line_number: issue.lineNumber,
  }));

  if (issueInserts.length > 0) {
    const { error: issueError } = await supabase.from("review_issues").insert(issueInserts);

    if (issueError) {
      throw new Error(issueError.message);
    }
  }

  return review;
}
