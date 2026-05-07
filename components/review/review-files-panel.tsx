"use client";

import { useMemo, useState } from "react";

import type { ReviewFileRow, ReviewIssueRow } from "@/lib/db/types";
import { getRiskBadgeVariant, getSeverityBadgeVariant } from "@/lib/reviews/presentation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ReviewFilesPanelProps = {
  files: ReviewFileRow[];
  issues: ReviewIssueRow[];
};

function renderPatchLine(line: string, index: number) {
  let className = "text-slate-400";

  if (line.startsWith("+") && !line.startsWith("+++")) {
    className = "text-emerald-300";
  } else if (line.startsWith("-") && !line.startsWith("---")) {
    className = "text-rose-300";
  } else if (line.startsWith("@@")) {
    className = "text-cyan-300";
  } else if (line.startsWith("diff --git")) {
    className = "text-slate-200";
  }

  return (
    <div key={`${index}-${line}`} className={className}>
      {line || " "}
    </div>
  );
}

export function ReviewFilesPanel({ files, issues }: ReviewFilesPanelProps) {
  const [selectedFilePath, setSelectedFilePath] = useState(files[0]?.file_path ?? "");

  const selectedFile = useMemo(
    () => files.find((file) => file.file_path === selectedFilePath) ?? files[0] ?? null,
    [files, selectedFilePath],
  );

  const selectedIssues = selectedFile
    ? issues.filter((issue) => issue.file_id === selectedFile.id)
    : [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>File-wise risk</CardTitle>
          <CardDescription>
            Select a changed file to inspect its risk score, diff patch, and file-specific issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {files.map((file) => {
            const isSelected = selectedFile?.id === file.id;

            return (
              <button
                key={file.id}
                type="button"
                onClick={() => setSelectedFilePath(file.file_path)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-cyan-400/30 bg-cyan-400/10"
                    : "border-white/10 bg-slate-950/40 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium text-white">{file.file_path}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {file.status ?? "modified"}
                    </p>
                  </div>
                  <Badge variant={getRiskBadgeVariant(file.risk_level)}>
                    {file.risk_level} · {file.risk_score}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>+{file.additions}</span>
                  <span>-{file.deletions}</span>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Diff viewer</CardTitle>
          <CardDescription>
            {selectedFile
              ? `Inspecting ${selectedFile.file_path}`
              : "No diff patch is available for this review."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {selectedFile ? (
            <>
              {selectedIssues.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedIssues.map((issue) => (
                    <Badge
                      key={issue.id}
                      variant={getSeverityBadgeVariant(issue.severity)}
                    >
                      {issue.severity}: {issue.title}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
                  No file-scoped issues were attached to this file.
                </div>
              )}

              <div className="max-h-[34rem] overflow-auto rounded-2xl border border-white/10 bg-slate-950/80 p-4 font-mono text-xs leading-6">
                {selectedFile.patch ? (
                  selectedFile.patch.split("\n").map((line, index) => renderPatchLine(line, index))
                ) : (
                  <p className="text-slate-500">
                    GitHub did not return an inline patch for this file. Binary files and very large diffs often omit patch content.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
              This review does not include changed-file records yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
