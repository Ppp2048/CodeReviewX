import { saveProfileAction } from "@/app/settings/actions";
import { SettingsForm } from "@/components/dashboard/settings-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupabaseEnvNotice } from "@/components/layout/supabase-env-notice";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const message = params.error
    ? { type: "error" as const, text: params.error }
    : params.success
      ? { type: "success" as const, text: params.success }
      : undefined;

  let profile = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      profile = data;
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Badge variant="accent" className="w-fit">
          Profile settings
        </Badge>
        <div>
          <h2 className="text-3xl font-semibold text-white">Settings</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-400">
            Save the reviewer profile fields that will power future GitHub defaults,
            review ownership, and AI preference metadata.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {supabase ? (
          <SettingsForm action={saveProfileAction} profile={profile} message={message} />
        ) : (
          <SupabaseEnvNotice />
        )}

        <Card className="bg-white/[0.03]">
          <CardHeader>
            <CardTitle>AI summary behavior</CardTitle>
            <CardDescription>How provider preference works in the current implementation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-slate-400">
            <p>Choose <strong className="font-medium text-slate-200">None</strong> to always use the deterministic rule-based fallback summary.</p>
            <p>Choose <strong className="font-medium text-slate-200">OpenAI</strong> or <strong className="font-medium text-slate-200">Gemini</strong> to request richer review summaries, key risks, suggested tests, and reviewer checklists from the server when that provider key is configured.</p>
            <p>If the selected provider has no server-side API key configured, CodeReviewX falls back automatically to the rule-based summary without exposing any secret to the client.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
