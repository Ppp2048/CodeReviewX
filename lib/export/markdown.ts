import { parseStoredGeneratedSummary } from "@/lib/ai/summary";
import type { ReviewDetailRecord } from "@/lib/reviews/queries";

export function buildReviewMarkdownReport(detail: ReviewDetailRecord) {
  const summary = parseStoredGeneratedSummary(detail.review.ai_summary);
  const suggestedTests = detail.review.suggested_tests?.split(/\n+/).filter(Boolean) ?? [];

  const lines = [
    `# ${detail.review.title ?? "CodeReviewX Review Report"}`,
    "",
    `- Source: ${detail.review.source_type === "github_pr" ? "GitHub PR" : "Pasted diff"}`,
    `- Risk level: ${detail.review.risk_level}`,
    `- Overall risk score: ${detail.review.overall_risk_score}/100`,
    `- Created at: ${detail.review.created_at}`,
    detail.review.pr_url ? `- Pull request URL: ${detail.review.pr_url}` : null,
    detail.review.author ? `- Author: ${detail.review.author}` : null,
    "",
    "## Summary",
    summary?.prSummary ?? detail.review.ai_summary ?? "No summary available.",
    "",
  ].filter((line): line is string => Boolean(line));

  if (summary?.keyRisks.length) {
    lines.push("## Key Risks", ...summary.keyRisks.map((item) => `- ${item}`), "");
  }

  if (suggestedTests.length) {
    lines.push("## Suggested Tests", ...suggestedTests.map((item) => `- ${item}`), "");
  }

  if (summary?.reviewerChecklist.length) {
    lines.push(
      "## Reviewer Checklist",
      ...summary.reviewerChecklist.map((item) => `- ${item}`),
      "",
    );
  }

  lines.push("## File Risks");
  for (const file of detail.files) {
    lines.push(
      `- ${file.file_path} | ${file.risk_level} | score ${file.risk_score} | +${file.additions} / -${file.deletions}`,
    );
  }
  lines.push("");

  lines.push("## Issues");
  if (detail.issues.length === 0) {
    lines.push("- No issues detected.");
  } else {
    for (const issue of detail.issues) {
      lines.push(
        `- [${issue.severity}] ${issue.title} (${issue.category})`,
        issue.description ? `  - Description: ${issue.description}` : "  - Description: N/A",
        issue.recommendation
          ? `  - Recommendation: ${issue.recommendation}`
          : "  - Recommendation: N/A",
        issue.line_number ? `  - Line: ${issue.line_number}` : "  - Line: N/A",
      );
    }
  }
  lines.push("");

  lines.push("## Diff Files");
  for (const file of detail.files) {
    lines.push(`### ${file.file_path}`, "", "```diff", file.patch ?? "# No inline patch available", "```", "");
  }

  return lines.join("\n");
}
