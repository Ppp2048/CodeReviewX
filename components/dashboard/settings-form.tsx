import type { ProfileRow } from "@/lib/db/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SettingsFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  profile: ProfileRow | null;
  message?: {
    type: "error" | "success";
    text: string;
  };
  disabled?: boolean;
};

export function SettingsForm({
  action,
  profile,
  message,
  disabled = false,
}: SettingsFormProps) {
  return (
    <Card className="bg-white/[0.03]">
      <CardHeader>
        <CardTitle>Workspace preferences</CardTitle>
        <CardDescription>
          Save your reviewer profile, GitHub defaults, and AI preference metadata.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={action} className="space-y-6">
          {message ? (
            <div
              className={
                message.type === "error"
                  ? "rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
                  : "rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
              }
            >
              {message.text}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Jordan Lee"
                defaultValue={profile?.full_name ?? ""}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_username">GitHub username</Label>
              <Input
                id="github_username"
                name="github_username"
                placeholder="jordanlee"
                defaultValue={profile?.github_username ?? ""}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_profile_url">GitHub profile URL</Label>
              <Input
                id="github_profile_url"
                name="github_profile_url"
                placeholder="https://github.com/jordanlee"
                defaultValue={profile?.github_profile_url ?? ""}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_ai_provider">Preferred AI provider</Label>
              <select
                id="preferred_ai_provider"
                name="preferred_ai_provider"
                defaultValue={profile?.preferred_ai_provider ?? "none"}
                className="flex h-11 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/20"
                disabled={disabled}
              >
                <option value="none">None</option>
                <option value="openai">OpenAI</option>
                <option value="gemini">Gemini</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_repo_owner">Default repo owner</Label>
              <Input
                id="default_repo_owner"
                name="default_repo_owner"
                placeholder="acme"
                defaultValue={profile?.default_repo_owner ?? ""}
                disabled={disabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_repo_name">Default repo name</Label>
              <Input
                id="default_repo_name"
                name="default_repo_name"
                placeholder="platform-web"
                defaultValue={profile?.default_repo_name ?? ""}
                disabled={disabled}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-400">
            Optional AI API keys are intentionally not stored here yet. Phase 2 only persists the profile fields needed for future review workflows.
          </div>

          <div className="flex justify-end">
            <Button variant="outline" type="submit" disabled={disabled}>
              Save profile settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
