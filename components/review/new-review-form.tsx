"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import type { NewReviewActionState } from "@/app/dashboard/new-review/actions";
import { createReviewAction } from "@/app/dashboard/new-review/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: NewReviewActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Analyzing review..." : "Analyze review"}
    </Button>
  );
}

export function NewReviewForm() {
  const [sourceType, setSourceType] = useState<"github_pr" | "diff_upload">("github_pr");
  const [state, formAction] = useActionState(createReviewAction, initialState);

  return (
    <Card className="bg-white/[0.03]">
      <CardHeader>
        <CardTitle>Review intake</CardTitle>
        <CardDescription>
          Analyze a GitHub pull request or a pasted unified diff, then save the report into your dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-6">
          {state.error ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {state.error}
            </div>
          ) : null}

          <input type="hidden" name="sourceType" value={sourceType} />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSourceType("github_pr")}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                sourceType === "github_pr"
                  ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
              }`}
            >
              GitHub PR URL
            </button>
            <button
              type="button"
              onClick={() => setSourceType("diff_upload")}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                sourceType === "diff_upload"
                  ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
              }`}
            >
              Pasted diff
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prUrl">GitHub pull request URL</Label>
              <Input
                id="prUrl"
                name="prUrl"
                placeholder="https://github.com/owner/repo/pull/123"
                disabled={sourceType !== "github_pr"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubToken">Optional GitHub token</Label>
              <Input
                id="githubToken"
                name="githubToken"
                type="password"
                placeholder="Used only for this request. Not stored."
                disabled={sourceType !== "github_pr"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diffText">Paste unified diff</Label>
            <Textarea
              id="diffText"
              name="diffText"
              className="min-h-72 font-mono text-xs leading-6"
              placeholder={`diff --git a/src/auth.ts b/src/auth.ts
index 1234567..89abcde 100644
--- a/src/auth.ts
+++ b/src/auth.ts
@@ -1,3 +1,5 @@
-const mode = "legacy";
+const mode = "strict";
+const secret = "demo-secret";
 export function login() {}`}
              disabled={sourceType !== "diff_upload"}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <Badge variant="accent" className="mb-3">
                Input handling
              </Badge>
              <p className="text-sm leading-6 text-slate-400">
                PR URLs support public repositories without a token. Tokens help with private repositories and GitHub rate limits.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <Badge variant="warning" className="mb-3">
                Explainable rules
              </Badge>
              <p className="text-sm leading-6 text-slate-400">
                Results are deterministic today: secret checks, risky patterns, dependency changes, deleted tests, and diff-size heuristics.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <Badge variant="notice" className="mb-3">
                Persisted reports
              </Badge>
              <p className="text-sm leading-6 text-slate-400">
                Successful analysis is saved directly to Supabase so each report becomes browsable in your review history.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
