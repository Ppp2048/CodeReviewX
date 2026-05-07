import { SettingsForm } from "@/components/dashboard/settings-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="accent" className="w-fit">
          Profile scaffold
        </Badge>
        <div>
          <h2 className="text-3xl font-semibold text-white">Settings</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-400">
            These profile and integration preference inputs mirror the product spec,
            but they do not persist yet. Database-backed saves arrive in a later phase.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SettingsForm />

        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardTitle>Implementation guardrails</CardTitle>
            <CardDescription>What this milestone intentionally excludes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-400">
            <p>No Supabase database tables or auth sessions are connected yet.</p>
            <p>No GitHub PAT storage or PR parsing is implemented.</p>
            <p>No AI provider requests, key handling, or server routes are present.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
