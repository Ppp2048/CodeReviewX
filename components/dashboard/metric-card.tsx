import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <Card className="bg-white/[0.03]">
      <CardContent className="flex items-start justify-between p-6">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-3xl font-semibold text-white">{value}</p>
          <p className="text-sm text-slate-500">{helper}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
