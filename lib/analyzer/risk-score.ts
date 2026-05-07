import type { AnalyzerIssue, FileRisk, IssueSeverity, RiskLevel } from "@/lib/analyzer/types";

const severityWeights: Record<IssueSeverity, number> = {
  low: 10,
  medium: 25,
  high: 50,
  critical: 80,
};

export function severityToScore(severity: IssueSeverity) {
  return severityWeights[severity];
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 50) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function buildFileRisks(
  files: Array<{ filename: string; additions: number; deletions: number; changes: number }>,
  issues: AnalyzerIssue[],
): FileRisk[] {
  return files.map((file) => {
    const fileIssues = issues.filter((issue) => issue.filePath === file.filename);
    const rawScore = fileIssues.reduce((sum, issue) => sum + severityToScore(issue.severity), 0);
    const score = Math.min(100, rawScore);

    return {
      filePath: file.filename,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      issueCount: fileIssues.length,
      score,
      riskLevel: scoreToRiskLevel(score),
    };
  });
}

export function calculateOverallRiskScore(fileRisks: FileRisk[], issues: AnalyzerIssue[]) {
  if (fileRisks.length === 0) {
    return 0;
  }

  const totalWeight = fileRisks.reduce((sum, file) => sum + Math.max(1, file.changes), 0);
  const weightedScore =
    fileRisks.reduce((sum, file) => sum + file.score * Math.max(1, file.changes), 0) / totalWeight;
  const criticalBoost = issues.some((issue) => issue.severity === "critical") ? 10 : 0;

  return Math.min(100, Math.round(weightedScore + criticalBoost));
}
