export type IssueSeverity = "low" | "medium" | "high" | "critical";
export type RiskLevel = "low" | "medium" | "high" | "critical";

export type AnalyzerIssue = {
  id: string;
  filePath: string | null;
  severity: IssueSeverity;
  category:
    | "secret_exposure"
    | "sql_injection_pattern"
    | "sensitive_file_change"
    | "missing_tests"
    | "deleted_tests"
    | "large_diff"
    | "dependency_change"
    | "dangerous_js_pattern";
  title: string;
  description: string;
  recommendation: string;
  lineNumber: number | null;
};

export type FileRisk = {
  filePath: string;
  additions: number;
  deletions: number;
  changes: number;
  issueCount: number;
  score: number;
  riskLevel: RiskLevel;
};

export type AnalyzerSummary = {
  text: string;
  suggestedTests: string[];
};

export type AnalyzerResult = {
  issues: AnalyzerIssue[];
  fileRisks: FileRisk[];
  overallRiskScore: number;
  riskLevel: RiskLevel;
  summary: AnalyzerSummary;
};
