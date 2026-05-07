import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Structured review flow", value: "Phase 1 ready" },
  { label: "Dashboard surfaces", value: "5 routes" },
  { label: "Future integrations", value: "Supabase + GitHub + AI" },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Risk-first review workspace",
    description: "Frame every review around signal, severity, and reviewer attention.",
  },
  {
    icon: Zap,
    title: "Fast operator dashboard",
    description: "Move from incoming PR to actionable summary without UI clutter.",
  },
  {
    icon: Sparkles,
    title: "Built for later intelligence",
    description: "The scaffold already leaves room for analyzers, exports, and AI summaries.",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-8 lg:pt-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_55%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="space-y-8">
          <Badge variant="accent" className="w-fit">
            Phase 1 scaffold live
          </Badge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Give every pull request a sharper first read.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              CodeReviewX is a modern review operations workspace designed for teams
              who want clean triage, thoughtful risk visibility, and a foundation for
              future GitHub and AI-assisted analysis.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Create workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Preview dashboard
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-white/[0.03]">
                <CardContent className="space-y-2 p-5">
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden border-cyan-400/20 bg-slate-950/85 shadow-[0_0_90px_rgba(34,211,238,0.12)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div>
                <p className="text-sm text-slate-400">Incoming review queue</p>
                <p className="mt-1 text-xl font-semibold text-white">7 pull requests</p>
              </div>
              <Badge variant="warning">2 high-risk</Badge>
            </div>

            <div className="grid gap-4">
              {highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                    <highlight.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-white">{highlight.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
