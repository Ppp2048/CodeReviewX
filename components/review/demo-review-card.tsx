import { FlaskConical, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DemoReviewCard({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <Card className="bg-white/[0.03]">
      <CardHeader>
        <CardTitle>Demo review mode</CardTitle>
        <CardDescription>
          Seed a realistic risky pull request report from local fixtures when you want to demo the product without a live GitHub request.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-400">
            <p className="mb-2 flex items-center gap-2 font-medium text-slate-200">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              What it includes
            </p>
            <p>GitHub PR metadata, changed files, analyzer findings, AI/rule summary, suggested tests, and file-level risk records.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-400">
            <p className="mb-2 flex items-center gap-2 font-medium text-slate-200">
              <FlaskConical className="h-4 w-4 text-amber-300" />
              Best for
            </p>
            <p>Stakeholder demos, local smoke checks, and dashboard screenshots before real user review history exists.</p>
          </div>
        </div>

        <form action={action} className="flex justify-end">
          <Button variant="outline" type="submit">
            Create demo review
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
