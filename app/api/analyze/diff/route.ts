import { NextResponse } from "next/server";
import { z } from "zod";

import { parseUnifiedDiff } from "@/lib/analyzer/diff-parser";
import { analyzeGitHubFiles } from "@/lib/analyzer/rules";

const analyzeDiffSchema = z.object({
  diffText: z
    .string()
    .trim()
    .min(1, "Paste a unified diff before running analysis."),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsedBody = analyzeDiffSchema.safeParse(json);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_request",
            message:
              parsedBody.error.issues[0]?.message ?? "Request body is invalid.",
          },
        },
        { status: 400 },
      );
    }

    const files = parseUnifiedDiff(parsedBody.data.diffText);

    if (files.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "invalid_diff",
            message:
              "No changed files were detected in the pasted diff. Paste a unified diff with file hunks and try again.",
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      source: "diff_upload",
      files,
      analysis: analyzeGitHubFiles(files),
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "unexpected_error",
          message: "Unexpected error while analyzing the pasted diff source.",
        },
      },
      { status: 500 },
    );
  }
}
