import type { GeneratedReviewSummary, AiProvider } from "@/lib/ai/types";
import type { AnalyzerResult } from "@/lib/analyzer/types";
import type { GitHubPrFile, GitHubPrMetadata } from "@/lib/github/types";

type BuildReviewSummaryInput = {
  providerPreference: AiProvider;
  reviewTitle: string;
  sourceType: "github_pr" | "diff_upload";
  analysis: AnalyzerResult;
  files: GitHubPrFile[];
  pullRequest?: GitHubPrMetadata;
};

type ProviderPromptInput = {
  reviewTitle: string;
  sourceType: "github_pr" | "diff_upload";
  analysis: AnalyzerResult;
  files: GitHubPrFile[];
  pullRequest?: GitHubPrMetadata;
};

const AI_SUMMARY_PREFIX = "CodeReviewX AI Summary v1";

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}

function buildFallbackSummary({
  reviewTitle,
  analysis,
  files,
}: Omit<BuildReviewSummaryInput, "providerPreference" | "sourceType" | "pullRequest">): GeneratedReviewSummary {
  const highestRiskFiles = analysis.fileRisks.slice(0, 3).map((file) => file.filePath);
  const topIssues = analysis.issues.slice(0, 4);
  const keyRisks =
    topIssues.length > 0
      ? topIssues.map((issue) => issue.title)
      : [
          `No high-signal rules were triggered, but ${files.length} changed file${files.length === 1 ? "" : "s"} still merit normal review.`,
        ];

  const reviewerChecklist = Array.from(
    new Set(
      [
        "Confirm the highest-risk files align with the intended change scope before approving.",
        analysis.issues.some((issue) => issue.category === "secret_exposure")
          ? "Verify any exposed credentials are rotated and scrubbed from the diff."
          : undefined,
        analysis.issues.some((issue) => issue.category === "sql_injection_pattern")
          ? "Check all query-building paths use parameterized database access."
          : undefined,
        analysis.issues.some((issue) => issue.category === "dependency_change")
          ? "Review package and lockfile changes for version drift or unnecessary dependency additions."
          : undefined,
        analysis.issues.some((issue) => issue.category === "missing_tests")
          ? "Ask for regression coverage on the touched sensitive code paths before merge."
          : undefined,
        highestRiskFiles[0]
          ? `Inspect ${highestRiskFiles[0]} closely because it currently carries the highest static risk score.`
          : undefined,
      ].filter((item): item is string => Boolean(item)),
    ),
  );

  return {
    provider: "rule-based",
    prSummary:
      analysis.issues.length === 0
        ? `${reviewTitle} looks relatively low risk from the configured rule set, with an overall risk score of ${analysis.overallRiskScore}/100.`
        : `${reviewTitle} triggered ${analysis.issues.length} rule-based finding${analysis.issues.length === 1 ? "" : "s"} across ${files.length} changed file${files.length === 1 ? "" : "s"}, resulting in an overall ${analysis.riskLevel} risk score of ${analysis.overallRiskScore}/100.`,
    keyRisks,
    suggestedTests:
      analysis.summary.suggestedTests.length > 0
        ? analysis.summary.suggestedTests
        : ["Run focused regression coverage on the most sensitive changed files before merge."],
    reviewerChecklist,
  };
}

function buildPrompt({
  reviewTitle,
  sourceType,
  analysis,
  files,
  pullRequest,
}: ProviderPromptInput) {
  const payload = {
    reviewTitle,
    sourceType,
    riskLevel: analysis.riskLevel,
    overallRiskScore: analysis.overallRiskScore,
    pullRequest: pullRequest
      ? {
          number: pullRequest.number,
          author: pullRequest.user.login,
          changedFiles: pullRequest.changed_files,
          additions: pullRequest.additions,
          deletions: pullRequest.deletions,
          body: truncate(pullRequest.body ?? "", 1000),
        }
      : null,
    fileRisks: analysis.fileRisks.slice(0, 12).map((file) => ({
      filePath: file.filePath,
      riskLevel: file.riskLevel,
      score: file.score,
      additions: file.additions,
      deletions: file.deletions,
    })),
    issues: analysis.issues.slice(0, 20).map((issue) => ({
      severity: issue.severity,
      category: issue.category,
      title: issue.title,
      description: truncate(issue.description, 300),
      recommendation: truncate(issue.recommendation, 220),
      filePath: issue.filePath,
      lineNumber: issue.lineNumber,
    })),
    suggestedTests: analysis.summary.suggestedTests,
    changedFiles: files.slice(0, 20).map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      patchPreview: truncate(file.patch ?? "", 500),
    })),
  };

  return [
    "You are generating a pull request review summary for CodeReviewX.",
    "Return strict JSON with this exact shape:",
    '{"prSummary":"string","keyRisks":["string"],"suggestedTests":["string"],"reviewerChecklist":["string"]}',
    "Constraints:",
    "- Keep prSummary to 2-4 sentences.",
    "- keyRisks must contain 2-5 concise bullets.",
    "- suggestedTests must contain 2-5 concrete tests.",
    "- reviewerChecklist must contain 3-6 practical reviewer checks.",
    "- Base the output only on the provided data.",
    "- Do not wrap JSON in markdown.",
    "",
    JSON.stringify(payload),
  ].join("\n");
}

function parseGeneratedJson(content: string, provider: "openai" | "gemini"): GeneratedReviewSummary | null {
  try {
    const parsed = JSON.parse(content) as Partial<GeneratedReviewSummary>;

    if (
      typeof parsed.prSummary !== "string" ||
      !Array.isArray(parsed.keyRisks) ||
      !Array.isArray(parsed.suggestedTests) ||
      !Array.isArray(parsed.reviewerChecklist)
    ) {
      return null;
    }

    return {
      provider,
      prSummary: parsed.prSummary.trim(),
      keyRisks: parsed.keyRisks.map((item) => String(item).trim()).filter(Boolean).slice(0, 5),
      suggestedTests: parsed.suggestedTests
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, 5),
      reviewerChecklist: parsed.reviewerChecklist
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, 6),
    };
  } catch {
    return null;
  }
}

async function generateWithOpenAi(input: ProviderPromptInput): Promise<GeneratedReviewSummary | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: buildPrompt(input),
        },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return null;
  }

  return parseGeneratedJson(content, "openai");
}

async function generateWithGemini(input: ProviderPromptInput): Promise<GeneratedReviewSummary | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(input) }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    return null;
  }

  return parseGeneratedJson(content, "gemini");
}

export async function buildReviewSummary(
  input: BuildReviewSummaryInput,
): Promise<GeneratedReviewSummary> {
  const fallback = buildFallbackSummary({
    reviewTitle: input.reviewTitle,
    analysis: input.analysis,
    files: input.files,
  });

  if (input.providerPreference === "none") {
    return fallback;
  }

  try {
    if (input.providerPreference === "openai") {
      return (await generateWithOpenAi(input)) ?? fallback;
    }

    if (input.providerPreference === "gemini") {
      return (await generateWithGemini(input)) ?? fallback;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function serializeGeneratedSummary(summary: GeneratedReviewSummary) {
  return [
    AI_SUMMARY_PREFIX,
    `provider=${summary.provider}`,
    "",
    "## PR Summary",
    summary.prSummary,
    "",
    "## Key Risks",
    ...summary.keyRisks.map((item) => `- ${item}`),
    "",
    "## Reviewer Checklist",
    ...summary.reviewerChecklist.map((item) => `- ${item}`),
  ].join("\n");
}

export function parseStoredGeneratedSummary(summaryText: string | null | undefined) {
  if (!summaryText) {
    return null;
  }

  if (!summaryText.startsWith(AI_SUMMARY_PREFIX)) {
    return {
      provider: "rule-based" as const,
      prSummary: summaryText.trim(),
      keyRisks: [] as string[],
      reviewerChecklist: [] as string[],
    };
  }

  const lines = summaryText.split("\n");
  const providerLine = lines.find((line) => line.startsWith("provider="));
  const provider = (providerLine?.split("=")[1] ?? "rule-based") as GeneratedReviewSummary["provider"];

  const sections = {
    prSummary: [] as string[],
    keyRisks: [] as string[],
    reviewerChecklist: [] as string[],
  };

  let currentSection: keyof typeof sections | null = null;

  for (const line of lines) {
    if (line === "## PR Summary") {
      currentSection = "prSummary";
      continue;
    }
    if (line === "## Key Risks") {
      currentSection = "keyRisks";
      continue;
    }
    if (line === "## Reviewer Checklist") {
      currentSection = "reviewerChecklist";
      continue;
    }
    if (!currentSection || line.startsWith(AI_SUMMARY_PREFIX) || line.startsWith("provider=")) {
      continue;
    }

    if (currentSection === "prSummary") {
      if (line.trim()) {
        sections.prSummary.push(line.trim());
      }
      continue;
    }

    if (line.startsWith("- ")) {
      sections[currentSection].push(line.slice(2).trim());
    }
  }

  return {
    provider,
    prSummary: sections.prSummary.join(" ").trim(),
    keyRisks: sections.keyRisks,
    reviewerChecklist: sections.reviewerChecklist,
  };
}
