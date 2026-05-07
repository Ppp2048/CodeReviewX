import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeGitHubFiles } from "@/lib/analyzer/rules";
import { GitHubApiError } from "@/lib/github/errors";
import { fetchPrFiles } from "@/lib/github/fetch-pr-files";
import { fetchPrMetadata } from "@/lib/github/fetch-pr-metadata";
import { parseGitHubPrUrl } from "@/lib/github/parse-pr-url";
import type { AnalyzeGitHubPrResult } from "@/lib/github/types";

const analyzeGitHubPrSchema = z.object({
  prUrl: z
    .string()
    .trim()
    .min(1, "A GitHub pull request URL is required."),
  githubToken: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedBody = analyzeGitHubPrSchema.safeParse(json);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_request",
            message: parsedBody.error.issues[0]?.message ?? "Request body is invalid.",
          },
        },
        { status: 400 },
      );
    }

    const parsedPrUrl = parseGitHubPrUrl(parsedBody.data.prUrl);
    const [pullRequest, files] = await Promise.all([
      fetchPrMetadata({
        owner: parsedPrUrl.owner,
        repo: parsedPrUrl.repo,
        pullNumber: parsedPrUrl.pullNumber,
        token: parsedBody.data.githubToken,
      }),
      fetchPrFiles({
        owner: parsedPrUrl.owner,
        repo: parsedPrUrl.repo,
        pullNumber: parsedPrUrl.pullNumber,
        token: parsedBody.data.githubToken,
      }),
    ]);

    const result: AnalyzeGitHubPrResult = {
      source: "github_pr",
      parsed: parsedPrUrl,
      pullRequest,
      files,
      analysis: analyzeGitHubFiles(files),
    };

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof GitHubApiError) {
      return NextResponse.json(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        error: {
          code: "unexpected_error",
          message: "Unexpected error while analyzing the GitHub pull request source.",
        },
      },
      { status: 500 },
    );
  }
}
