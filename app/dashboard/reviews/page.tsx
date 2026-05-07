import type { Route } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const rows = [
  {
    id: "checkout-risk",
    title: "Checkout auth edge cases",
    repo: "acme/platform-web",
    risk: "High",
    variant: "warning" as const,
  },
  {
    id: "scheduler-refactor",
    title: "Report scheduler refactor",
    repo: "acme/data-pipeline",
    risk: "Medium",
    variant: "accent" as const,
  },
];

export default function ReviewsPage() {
  return (
    <Card className="bg-white/[0.03]">
      <CardHeader>
        <CardTitle>Review history</CardTitle>
        <CardDescription>
          Placeholder list route matching the future persisted review experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <Link
            key={row.id}
            href={`/dashboard/reviews/${row.id}` as Route}
            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-cyan-400/30 hover:bg-white/[0.04] md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm text-slate-400">{row.repo}</p>
              <p className="font-medium text-white">{row.title}</p>
            </div>
            <Badge variant={row.variant}>{row.risk}</Badge>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
