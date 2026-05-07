"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardTrendsProps = {
  reviewVolume: Array<{
    date: string;
    reviews: number;
    avgRisk: number;
  }>;
  riskDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
};

export function DashboardTrends({
  reviewVolume,
  riskDistribution,
}: DashboardTrendsProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Review volume and average risk</CardTitle>
          <CardDescription>
            Track recent report activity and how risky the average review has been over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {reviewVolume.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30 text-sm text-slate-400">
              Run a few reviews to unlock dashboard trend data.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewVolume}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(2, 6, 23, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    color: "#e2e8f0",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgRisk"
                  stroke="#22d3ee"
                  fill="url(#riskGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/[0.03]">
        <CardHeader>
          <CardTitle>Risk distribution</CardTitle>
          <CardDescription>
            Current spread of low, medium, high, and critical saved reviews.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {riskDistribution.every((item) => item.value === 0) ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/30 text-sm text-slate-400">
              Risk distribution appears once saved reviews exist.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "rgba(2, 6, 23, 0.95)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    color: "#e2e8f0",
                  }}
                />
                <Pie
                  data={riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={52}
                >
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
