import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewReviewPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Badge variant="accent" className="w-fit">
          GitHub source intake
        </Badge>
        <h2 className="text-3xl font-semibold text-white">New review</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-400">
          Phase 3 adds the GitHub PR parser and changed-files fetch foundation.
          Static analysis and AI summaries are still intentionally deferred.
        </p>
      </div>

      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Review intake</CardTitle>
          <CardDescription>
            Use the API foundation at <code>/api/analyze/github-pr</code> to fetch
            pull request metadata and changed files.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pr-url">GitHub pull request URL</Label>
              <Input
                id="pr-url"
                placeholder="https://github.com/owner/repo/pull/123"
                defaultValue="https://github.com/vercel/next.js/pull/123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Optional GitHub token</Label>
              <Input
                id="token"
                type="password"
                placeholder="Supports private repos and rate-limit recovery"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diff">Paste diff text</Label>
            <Textarea
              id="diff"
              placeholder="Diff upload and parser flow stay deferred until the next implementation phase."
            />
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-400">
            Current backend scope:
            public PRs work without a token, private repos can use an optional token,
            and the API returns metadata plus changed files with structured error responses.
          </div>
          <div className="flex justify-end">
            <Button variant="outline">UI wiring comes next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
