import { Activity, FileCode2, GitPullRequestArrow, Settings2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: GitPullRequestArrow,
    title: "Review intake flows",
    description: "Dedicated routes are already reserved for new reviews, history, and per-review drilldowns.",
  },
  {
    icon: Activity,
    title: "Operational overview",
    description: "The dashboard shell uses metric cards, activity states, and action panels tuned for SaaS products.",
  },
  {
    icon: Settings2,
    title: "Profile + preferences",
    description: "Settings already anticipate GitHub defaults and AI provider choices without persisting anything yet.",
  },
  {
    icon: FileCode2,
    title: "Phase-friendly architecture",
    description: "Layouts, utility layers, and placeholders keep later Supabase and analysis work cleanly separated.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Product foundation
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            A scaffold built for review operations, not just a generic starter.
          </h2>
          <p className="text-base leading-7 text-slate-400">
            This first phase focuses on route shape, dark UI polish, and a reusable
            component baseline so later backend work can slot in cleanly.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="bg-white/[0.03]">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
