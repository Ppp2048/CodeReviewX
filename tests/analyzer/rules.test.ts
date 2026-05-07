import { describe, expect, it } from "vitest";

import { analyzeGitHubFiles } from "../../lib/analyzer/rules";
import type { GitHubPrFile } from "../../lib/github/types";
import riskyFiles from "../../fixtures/github/sample-risky-pr-files.json";

describe("analyzeGitHubFiles", () => {
  it("detects explainable static-analysis findings across a risky pull request", () => {
    const result = analyzeGitHubFiles(riskyFiles as GitHubPrFile[]);

    expect(result.issues.some((issue) => issue.category === "secret_exposure")).toBe(true);
    expect(result.issues.some((issue) => issue.category === "sql_injection_pattern")).toBe(true);
    expect(result.issues.some((issue) => issue.category === "sensitive_file_change")).toBe(true);
    expect(result.issues.some((issue) => issue.category === "missing_tests")).toBe(true);
    expect(result.issues.some((issue) => issue.category === "deleted_tests")).toBe(true);
    expect(result.issues.some((issue) => issue.category === "large_diff")).toBe(true);
    expect(result.issues.some((issue) => issue.category === "dependency_change")).toBe(true);
    expect(result.issues.some((issue) => issue.category === "dangerous_js_pattern")).toBe(true);

    expect(result.riskLevel).toBe("critical");
    expect(result.overallRiskScore).toBeGreaterThanOrEqual(75);
    expect(result.summary.text).toContain("overall critical risk score");
    expect(result.summary.suggestedTests.length).toBeGreaterThan(0);
  });

  it("returns a low-risk summary when no rules are triggered", () => {
    const files: GitHubPrFile[] = [
      {
        sha: "clean123",
        filename: "components/button.tsx",
        status: "modified",
        additions: 5,
        deletions: 2,
        changes: 7,
        blob_url: "https://github.com/example/repo/blob/main/components/button.tsx",
        raw_url: "https://raw.githubusercontent.com/example/repo/main/components/button.tsx",
        contents_url:
          "https://api.github.com/repos/example/repo/contents/components/button.tsx?ref=main",
        patch: "@@ -1,3 +1,6 @@\n export function Button() {\n-  return null;\n+  return <button>Click</button>;\n }\n",
      },
    ];

    const result = analyzeGitHubFiles(files);

    expect(result.issues).toHaveLength(0);
    expect(result.riskLevel).toBe("low");
    expect(result.overallRiskScore).toBe(0);
  });
});
