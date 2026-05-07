import type { AnalyzerIssue, RiskLevel } from "@/lib/analyzer/types";

export function getRiskBadgeVariant(riskLevel: RiskLevel) {
  switch (riskLevel) {
    case "low":
      return "success" as const;
    case "medium":
      return "warning" as const;
    case "high":
      return "notice" as const;
    case "critical":
      return "danger" as const;
  }
}

export function getSeverityBadgeVariant(severity: AnalyzerIssue["severity"]) {
  return getRiskBadgeVariant(severity);
}

export function formatReviewTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}
