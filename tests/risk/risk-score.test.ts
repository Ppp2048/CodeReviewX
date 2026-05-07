import { describe, expect, it } from "vitest";

import {
  buildFileRisks,
  calculateOverallRiskScore,
  scoreToRiskLevel,
  severityToScore,
} from "../../lib/analyzer/risk-score";
import type { AnalyzerIssue } from "../../lib/analyzer/types";

describe("risk-score helpers", () => {
  it("maps severities to deterministic weights", () => {
    expect(severityToScore("low")).toBe(10);
    expect(severityToScore("medium")).toBe(25);
    expect(severityToScore("high")).toBe(50);
    expect(severityToScore("critical")).toBe(80);
  });

  it("caps file scores at 100", () => {
    const issues: AnalyzerIssue[] = [
      {
        id: "1",
        filePath: "src/auth.ts",
        severity: "critical",
        category: "secret_exposure",
        title: "Secret",
        description: "Secret found",
        recommendation: "Remove it",
        lineNumber: 10,
      },
      {
        id: "2",
        filePath: "src/auth.ts",
        severity: "high",
        category: "dangerous_js_pattern",
        title: "eval",
        description: "eval found",
        recommendation: "Remove it",
        lineNumber: 12,
      },
    ];

    const fileRisks = buildFileRisks(
      [{ filename: "src/auth.ts", additions: 10, deletions: 5, changes: 15 }],
      issues,
    );

    expect(fileRisks[0]?.score).toBe(100);
    expect(fileRisks[0]?.riskLevel).toBe("critical");
  });

  it("adds a critical boost to the weighted overall score", () => {
    const issues: AnalyzerIssue[] = [
      {
        id: "1",
        filePath: "src/auth.ts",
        severity: "critical",
        category: "secret_exposure",
        title: "Secret",
        description: "Secret found",
        recommendation: "Remove it",
        lineNumber: 10,
      },
    ];

    const fileRisks = [
      {
        filePath: "src/auth.ts",
        additions: 10,
        deletions: 5,
        changes: 15,
        issueCount: 1,
        score: 80,
        riskLevel: "critical" as const,
      },
      {
        filePath: "src/button.tsx",
        additions: 5,
        deletions: 1,
        changes: 6,
        issueCount: 0,
        score: 0,
        riskLevel: "low" as const,
      },
    ];

    expect(calculateOverallRiskScore(fileRisks, issues)).toBeGreaterThan(60);
    expect(scoreToRiskLevel(10)).toBe("low");
    expect(scoreToRiskLevel(30)).toBe("medium");
    expect(scoreToRiskLevel(55)).toBe("high");
    expect(scoreToRiskLevel(90)).toBe("critical");
  });
});
