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
          Future flow placeholder
        </Badge>
        <h2 className="text-3xl font-semibold text-white">New review</h2>
        <p className="max-w-3xl text-sm leading-6 text-slate-400">
          This route is scaffolded now so the product structure matches the spec.
          GitHub PR ingestion and diff analysis will be added later.
        </p>
      </div>

      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Review intake</CardTitle>
          <CardDescription>UI only for Phase 1. No backend actions are wired yet.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pr-url">GitHub pull request URL</Label>
              <Input id="pr-url" placeholder="https://github.com/owner/repo/pull/123" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Optional GitHub token</Label>
              <Input id="token" placeholder="Will remain unimplemented until later phases" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diff">Paste diff text</Label>
            <Textarea id="diff" placeholder="Future diff upload or paste flow goes here." />
          </div>
          <div className="flex justify-end">
            <Button variant="outline">Analyze later</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
