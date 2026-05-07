import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const reviews = [
  {
    repo: "acme/platform-web",
    title: "Tighten checkout auth edge cases",
    risk: "High",
    riskVariant: "warning" as const,
    delta: "+18 -6",
  },
  {
    repo: "acme/data-pipeline",
    title: "Refactor report scheduler internals",
    risk: "Medium",
    riskVariant: "accent" as const,
    delta: "+42 -17",
  },
  {
    repo: "acme/mobile-app",
    title: "Payment retry flow cleanup",
    risk: "Critical",
    riskVariant: "danger" as const,
    delta: "+91 -28",
  },
];

export function ReviewListCard() {
  return (
    <Card className="bg-white/[0.03]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Recent review queue</CardTitle>
          <CardDescription>Sample shell content for upcoming persisted reviews.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.title}
            className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <p className="text-sm text-slate-400">{review.repo}</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-white">{review.title}</p>
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-400">{review.delta}</p>
              <Badge variant={review.riskVariant}>{review.risk}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
