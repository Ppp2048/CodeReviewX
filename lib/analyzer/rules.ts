import { buildFileRisks, calculateOverallRiskScore, scoreToRiskLevel } from "@/lib/analyzer/risk-score";
import { createDeterministicSummary } from "@/lib/analyzer/summary";
import type { AnalyzerIssue, AnalyzerResult } from "@/lib/analyzer/types";
import type { GitHubPrFile } from "@/lib/github/types";

const secretPatterns: Array<{
  regex: RegExp;
  title: string;
}> = [
  { regex: /\bAKIA[0-9A-Z]{16}\b/, title: "Possible AWS access key detected" },
  { regex: /\bghp_[A-Za-z0-9]{20,}\b/, title: "Possible GitHub token detected" },
  { regex: /\bsb_(publishable|secret)_[A-Za-z0-9_-]{20,}\b/i, title: "Possible Supabase key detected" },
  {
    regex: /\b(api[_-]?key|client[_-]?secret|secret|token|password)\b\s*[:=]\s*["'][^"']{8,}["']/i,
    title: "Possible hard-coded credential detected",
  },
];

const dangerousPatterns: Array<{
  regex: RegExp;
  severity: AnalyzerIssue["severity"];
  title: string;
  description: string;
}> = [
  {
    regex: /\beval\s*\(/,
    severity: "high",
    title: "Use of eval() detected",
    description: "eval() introduces arbitrary code execution risk and makes behavior difficult to reason about.",
  },
  {
    regex: /\bdangerouslySetInnerHTML\b/,
    severity: "high",
    title: "dangerouslySetInnerHTML usage detected",
    description: "Rendering raw HTML can create XSS risk if the content is not tightly sanitized.",
  },
  {
    regex: /\bchild_process\.(exec|execSync)\s*\(/,
    severity: "critical",
    title: "child_process exec usage detected",
    description: "Spawning shell commands from application code is high risk when any user-controlled input can reach the command string.",
  },
  {
    regex: /\bnew Function\s*\(/,
    severity: "high",
    title: "Dynamic Function constructor detected",
    description: "The Function constructor behaves like eval and should be treated as unsafe dynamic code execution.",
  },
];

const sqlPatterns: RegExp[] = [
  /\b(select|insert|update|delete)\b[\s\S]{0,120}(\+|\$\{)/i,
  /\b(query|execute)\s*\(\s*["'`][\s\S]{0,120}\b(select|insert|update|delete)\b[\s\S]{0,120}["'`]\s*\+/i,
];

const sensitiveFilePattern =
  /(auth|payment|billing|checkout|session|middleware|oauth|login|signup|credential|secret|token|config|env)/i;
const testFilePattern = /(^|\/)(__tests__|tests?)\/|(\.|\/)(test|spec)\.[jt]sx?$/i;
const dependencyFilePattern =
  /(^|\/)(package(-lock)?\.json|pnpm-lock\.ya?ml|yarn\.lock|bun\.lockb|requirements\.txt|poetry\.lock|Cargo\.(toml|lock)|Gemfile(\.lock)?|composer\.(json|lock))$/i;

type PatchLine = {
  lineNumber: number | null;
  content: string;
};

function extractAddedLines(patch?: string): PatchLine[] {
  if (!patch) {
    return [];
  }

  const lines = patch.split("\n");
  const results: PatchLine[] = [];
  let currentLine: number | null = null;

  for (const line of lines) {
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);

    if (hunk) {
      currentLine = Number.parseInt(hunk[1] ?? "0", 10);
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      results.push({
        lineNumber: currentLine,
        content: line.slice(1),
      });
      currentLine = currentLine === null ? null : currentLine + 1;
      continue;
    }

    if (line.startsWith(" ") || (line.length > 0 && !line.startsWith("-") && !line.startsWith("\\"))) {
      currentLine = currentLine === null ? null : currentLine + 1;
    }
  }

  return results;
}

function createIssue(issue: Omit<AnalyzerIssue, "id">, index: number): AnalyzerIssue {
  return {
    id: `${issue.category}-${index + 1}`,
    ...issue,
  };
}

export function analyzeGitHubFiles(files: GitHubPrFile[]): AnalyzerResult {
  const issues: AnalyzerIssue[] = [];
  const sensitiveFiles = files.filter((file) => sensitiveFilePattern.test(file.filename));
  const hasTestsInChangeSet = files.some(
    (file) => testFilePattern.test(file.filename) && file.status !== "removed",
  );

  files.forEach((file) => {
    const addedLines = extractAddedLines(file.patch);

    if (sensitiveFilePattern.test(file.filename)) {
      issues.push(
        createIssue(
          {
            filePath: file.filename,
            severity: "medium",
            category: "sensitive_file_change",
            title: "Sensitive file changed",
            description:
              "This file path suggests authentication, payment, session, configuration, or secret-handling logic that deserves extra review attention.",
            recommendation:
              "Review authorization, configuration handling, and rollback paths carefully for this file.",
            lineNumber: null,
          },
          issues.length,
        ),
      );
    }

    if (dependencyFilePattern.test(file.filename)) {
      issues.push(
        createIssue(
          {
            filePath: file.filename,
            severity: "medium",
            category: "dependency_change",
            title: "Dependency or lockfile change detected",
            description:
              "Package manifest or lockfile changes can silently alter transitive code paths and should receive explicit review.",
            recommendation: "Validate version bumps, changelogs, and lockfile consistency before merging.",
            lineNumber: null,
          },
          issues.length,
        ),
      );
    }

    if (testFilePattern.test(file.filename) && file.status === "removed") {
      issues.push(
        createIssue(
          {
            filePath: file.filename,
            severity: "high",
            category: "deleted_tests",
            title: "Test file deleted",
            description: "Removing tests can reduce regression coverage for the surrounding behavior.",
            recommendation: "Confirm the deletion is intentional and replace meaningful coverage if behavior still exists.",
            lineNumber: null,
          },
          issues.length,
        ),
      );
    }

    if (file.changes >= 500) {
      issues.push(
        createIssue(
          {
            filePath: file.filename,
            severity: "high",
            category: "large_diff",
            title: "Large diff detected",
            description: "This file has a very large patch size, which raises review complexity and regression risk.",
            recommendation: "Break the change down or review it with extra care and focused tests.",
            lineNumber: null,
          },
          issues.length,
        ),
      );
    } else if (file.changes >= 250) {
      issues.push(
        createIssue(
          {
            filePath: file.filename,
            severity: "medium",
            category: "large_diff",
            title: "Moderately large diff detected",
            description: "This file has a sizeable patch that may hide risky changes in review.",
            recommendation: "Double-check edge cases and ensure adequate regression coverage exists.",
            lineNumber: null,
          },
          issues.length,
        ),
      );
    }

    addedLines.forEach((line) => {
      for (const pattern of secretPatterns) {
        if (pattern.regex.test(line.content)) {
          issues.push(
            createIssue(
              {
                filePath: file.filename,
                severity: "critical",
                category: "secret_exposure",
                title: pattern.title,
                description: "The added line looks like it contains a hard-coded credential or secret-like token.",
                recommendation: "Remove the credential from the diff, rotate it if real, and load secrets from secure environment storage.",
                lineNumber: line.lineNumber,
              },
              issues.length,
            ),
          );
          break;
        }
      }

      if (sqlPatterns.some((pattern) => pattern.test(line.content))) {
        issues.push(
          createIssue(
            {
              filePath: file.filename,
              severity: "high",
              category: "sql_injection_pattern",
              title: "SQL query appears to be dynamically constructed",
              description:
                "This added line matches a simple string-built SQL heuristic that often signals missing parameterization.",
              recommendation: "Use parameterized queries or a query builder instead of concatenating SQL strings.",
              lineNumber: line.lineNumber,
            },
            issues.length,
          ),
        );
      }

      for (const pattern of dangerousPatterns) {
        if (pattern.regex.test(line.content)) {
          issues.push(
            createIssue(
              {
                filePath: file.filename,
                severity: pattern.severity,
                category: "dangerous_js_pattern",
                title: pattern.title,
                description: pattern.description,
                recommendation: "Refactor to a safer alternative or prove the input path is tightly controlled.",
                lineNumber: line.lineNumber,
              },
              issues.length,
            ),
          );
          break;
        }
      }
    });
  });

  if (sensitiveFiles.length > 0 && !hasTestsInChangeSet) {
    issues.push(
      createIssue(
        {
          filePath: sensitiveFiles[0]?.filename ?? null,
          severity: "high",
          category: "missing_tests",
          title: "Sensitive files changed without test updates",
          description:
            "Sensitive authentication, payment, or configuration paths changed, but no test file updates were detected in this pull request.",
          recommendation: "Add or update regression tests that cover the changed sensitive behavior before merging.",
          lineNumber: null,
        },
        issues.length,
      ),
    );
  }

  const fileRisks = buildFileRisks(files, issues);
  const overallRiskScore = calculateOverallRiskScore(fileRisks, issues);
  const riskLevel = scoreToRiskLevel(overallRiskScore);
  const summary = createDeterministicSummary({
    issues,
    riskLevel,
    overallRiskScore,
  });

  return {
    issues,
    fileRisks,
    overallRiskScore,
    riskLevel,
    summary,
  };
}
