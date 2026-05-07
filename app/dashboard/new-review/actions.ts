"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { buildReviewSummary } from "@/lib/ai/summary";
import { parseUnifiedDiff } from "@/lib/analyzer/diff-parser";
import { analyzeGitHubFiles } from "@/lib/analyzer/rules";
import { getDemoChangedFilesFixture, getDemoPullRequestFixture } from "@/lib/demo/fixtures";
import { GitHubApiError } from "@/lib/github/errors";
import { fetchPrFiles } from "@/lib/github/fetch-pr-files";
import { fetchPrMetadata } from "@/lib/github/fetch-pr-metadata";
import { parseGitHubPrUrl } from "@/lib/github/parse-pr-url";
import { persistReview } from "@/lib/reviews/persist";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const newReviewSchema = z
  .object({
    sourceType: z.enum(["github_pr", "diff_upload"]),
    prUrl: z.string().trim().optional(),
    githubToken: z.string().trim().optional(),
    diffText: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.sourceType === "github_pr" && !value.prUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["prUrl"],
        message: "Enter a GitHub pull request URL to analyze.",
      });
    }

    if (value.sourceType === "diff_upload" && !value.diffText?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["diffText"],
        message: "Paste a unified diff before running analysis.",
      });
    }
  });

export type NewReviewActionState = {
  error?: string;
};

export async function createReviewAction(
  _previousState: NewReviewActionState,
  formData: FormData,
): Promise<NewReviewActionState> {
  const parsed = newReviewSchema.safeParse({
    sourceType: formData.get("sourceType"),
    prUrl: formData.get("prUrl"),
    githubToken: formData.get("githubToken"),
    diffText: formData.get("diffText"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Review request is invalid.",
    };
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      error: "Supabase environment variables are not configured.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=Your session expired. Please sign in again.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_ai_provider")
    .eq("id", user.id)
    .maybeSingle();

  const providerPreference = profile?.preferred_ai_provider ?? "none";

  try {
    if (parsed.data.sourceType === "github_pr") {
      const parsedPrUrl = parseGitHubPrUrl(parsed.data.prUrl ?? "");
      const [pullRequest, files] = await Promise.all([
        fetchPrMetadata({
          owner: parsedPrUrl.owner,
          repo: parsedPrUrl.repo,
          pullNumber: parsedPrUrl.pullNumber,
          token: parsed.data.githubToken || undefined,
        }),
        fetchPrFiles({
          owner: parsedPrUrl.owner,
          repo: parsedPrUrl.repo,
          pullNumber: parsedPrUrl.pullNumber,
          token: parsed.data.githubToken || undefined,
        }),
      ]);

      const analysis = analyzeGitHubFiles(files);
      const summary = await buildReviewSummary({
        providerPreference,
        reviewTitle: pullRequest.title,
        sourceType: "github_pr",
        analysis,
        files,
        pullRequest,
      });
      const review = await persistReview({
        supabase,
        userId: user.id,
        sourceType: "github_pr",
        parsedPrUrl,
        pullRequest,
        files,
        summary,
        overallRiskScore: analysis.overallRiskScore,
        riskLevel: analysis.riskLevel,
        issues: analysis.issues,
        fileRisks: analysis.fileRisks,
        rawDiff: null,
      });

      redirect(`/dashboard/reviews/${review.id}`);
    }

    const rawDiff = parsed.data.diffText?.trim() ?? "";
    const files = parseUnifiedDiff(rawDiff);

    if (files.length === 0) {
      return {
        error:
          "No changed files were detected in the pasted diff. Paste a unified diff with file hunks and try again.",
      };
    }

    const analysis = analyzeGitHubFiles(files);
    const summary = await buildReviewSummary({
      providerPreference,
      reviewTitle: "Manual diff review",
      sourceType: "diff_upload",
      analysis,
      files,
    });
    const review = await persistReview({
      supabase,
      userId: user.id,
      sourceType: "diff_upload",
      files,
      summary,
      overallRiskScore: analysis.overallRiskScore,
      riskLevel: analysis.riskLevel,
      issues: analysis.issues,
      fileRisks: analysis.fileRisks,
      rawDiff,
    });

    redirect(`/dashboard/reviews/${review.id}`);
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return {
        error: error.message,
      };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Unexpected error while building the review report.",
    };
  }
}

export async function createDemoReviewAction() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/dashboard/new-review?error=Supabase environment variables are not configured.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=Your session expired. Please sign in again.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("preferred_ai_provider")
    .eq("id", user.id)
    .maybeSingle();

  const providerPreference = profile?.preferred_ai_provider ?? "none";
  const pullRequest = getDemoPullRequestFixture();
  const files = getDemoChangedFilesFixture();
  const analysis = analyzeGitHubFiles(files);
  const summary = await buildReviewSummary({
    providerPreference,
    reviewTitle: pullRequest.title,
    sourceType: "github_pr",
    analysis,
    files,
    pullRequest,
  });

  const review = await persistReview({
    supabase,
    userId: user.id,
    sourceType: "github_pr",
    parsedPrUrl: {
      owner: "example",
      repo: "codereviewx",
      pullNumber: pullRequest.number,
      normalizedUrl: pullRequest.html_url,
    },
    pullRequest,
    files,
    summary,
    overallRiskScore: analysis.overallRiskScore,
    riskLevel: analysis.riskLevel,
    issues: analysis.issues,
    fileRisks: analysis.fileRisks,
    rawDiff: files.map((file) => file.patch ?? "").filter(Boolean).join("\n\n"),
  });

  redirect(`/dashboard/reviews/${review.id}`);
}
