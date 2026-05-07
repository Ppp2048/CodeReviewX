import { describe, expect, it } from "vitest";

import { serializeGeneratedSummary } from "@/lib/ai/summary";
import { buildReviewMarkdownReport } from "@/lib/export/markdown";
import type { ReviewDetailRecord } from "@/lib/reviews/queries";

describe("buildReviewMarkdownReport", () => {
  it("renders saved review data into a markdown report", () => {
    const detail: ReviewDetailRecord = {
      review: {
        id: "review-1",
        user_id: "user-1",
        source_type: "github_pr",
        pr_url: "https://github.com/example/repo/pull/42",
        repo_owner: "example",
        repo_name: "repo",
        pr_number: 42,
        title: "Improve review export flow",
        author: "octocat",
        overall_risk_score: 78,
        risk_level: "critical",
        ai_summary: serializeGeneratedSummary({
          provider: "rule-based",
          prSummary: "This review touches risky auth and dependency code paths.",
          keyRisks: ["Authentication middleware changed.", "Dependency manifest was modified."],
          suggestedTests: ["Run auth regression coverage."],
          reviewerChecklist: ["Confirm the auth redirect behavior remains unchanged."],
        }),
        suggested_tests: "Run auth regression coverage.",
        raw_diff: null,
        created_at: "2026-05-07T10:00:00Z",
      },
      files: [
        {
          id: "file-1",
          review_id: "review-1",
          file_path: "src/auth.ts",
          status: "modified",
          additions: 10,
          deletions: 3,
          patch: "@@ -1 +1 @@\n-export const mode = 'legacy';\n+export const mode = 'strict';",
          risk_score: 80,
          risk_level: "critical",
          created_at: "2026-05-07T10:00:00Z",
        },
      ],
      issues: [
        {
          id: "issue-1",
          review_id: "review-1",
          file_id: "file-1",
          severity: "high",
          category: "sensitive_file_change",
          title: "Sensitive authentication file changed",
          description: "The diff touches authentication flow logic.",
          recommendation: "Request focused regression coverage before merge.",
          line_number: 12,
          created_at: "2026-05-07T10:00:00Z",
        },
      ],
    };

    const markdown = buildReviewMarkdownReport(detail);

    expect(markdown).toContain("# Improve review export flow");
    expect(markdown).toContain("## Summary");
    expect(markdown).toContain("## Key Risks");
    expect(markdown).toContain("## Suggested Tests");
    expect(markdown).toContain("## Reviewer Checklist");
    expect(markdown).toContain("## File Risks");
    expect(markdown).toContain("## Issues");
    expect(markdown).toContain("## Diff Files");
  });
});
