import { CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Invite a reviewer into a clean, focused dashboard.",
  "Capture repository defaults and future AI preferences in one place.",
  "Reserve dedicated flows for PR ingestion and diff-based review.",
  "Keep the UI ready for Supabase auth and persistence without coupling Phase 1 to a database.",
];

export function Workflow() {
  return (
    <section id="workflow" className="px-6 pb-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
            Workflow
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Phase 1 keeps the shape of the product honest.
          </h2>
          <p className="text-base leading-7 text-slate-400">
            Instead of overbuilding integrations early, the scaffold creates the
            route map, shell, and settings foundation the rest of the roadmap can grow into.
          </p>
        </div>

        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardTitle>What ships in this milestone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-cyan-300" />
                <p className="text-sm leading-6 text-slate-300">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
