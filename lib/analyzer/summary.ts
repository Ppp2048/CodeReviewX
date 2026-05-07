import type { AnalyzerIssue, AnalyzerSummary, RiskLevel } from "@/lib/analyzer/types";

const severityRank = ["critical", "high", "medium", "low"] as const;

export function createDeterministicSummary({
  issues,
  riskLevel,
  overallRiskScore,
}: {
  issues: AnalyzerIssue[];
  riskLevel: RiskLevel;
  overallRiskScore: number;
}): AnalyzerSummary {
  const counts = {
    critical: issues.filter((issue) => issue.severity === "critical").length,
    high: issues.filter((issue) => issue.severity === "high").length,
    medium: issues.filter((issue) => issue.severity === "medium").length,
    low: issues.filter((issue) => issue.severity === "low").length,
  };

  const topIssues = severityRank
    .flatMap((severity) => issues.filter((issue) => issue.severity === severity))
    .slice(0, 3);

  const suggestedTests = Array.from(
    new Set(
      topIssues.map((issue) => {
        switch (issue.category) {
          case "missing_tests":
            return "Add regression coverage around the touched sensitive paths before merging.";
          case "sql_injection_pattern":
            return "Exercise database calls with malicious string input and confirm queries stay parameterized.";
          case "dangerous_js_pattern":
            return "Add targeted tests around the risky JS/TS execution path and verify untrusted input is sanitized.";
          case "secret_exposure":
            return "Rotate exposed credentials and add checks that prevent committed secrets.";
          case "dependency_change":
            return "Run dependency and lockfile verification tests after package changes.";
          default:
            return "Add focused regression coverage for the highest-risk changed files.";
        }
      }),
    ),
  );

  const headline =
    issues.length === 0
      ? `Rule-based analysis found no high-signal issues. Overall risk is ${riskLevel} (${overallRiskScore}/100).`
      : `Rule-based analysis found ${issues.length} issue${issues.length === 1 ? "" : "s"} with an overall ${riskLevel} risk score of ${overallRiskScore}/100.`;

  const detail =
    issues.length === 0
      ? "The diff still merits normal reviewer attention, but no configured static rules were triggered."
      : `Severity mix: ${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low. Top findings: ${topIssues
          .map((issue) => issue.title)
          .join("; ")}.`;

  return {
    text: `${headline} ${detail}`.trim(),
    suggestedTests,
  };
}
