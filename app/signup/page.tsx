import { redirect } from "next/navigation";

import { signupAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { SupabaseEnvNotice } from "@/components/layout/supabase-env-notice";
import { AuthShell } from "@/components/layout/auth-shell";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  const message = params.error
    ? { type: "error" as const, text: params.error }
    : params.success
      ? { type: "success" as const, text: params.success }
      : undefined;

  return (
    <AuthShell
      eyebrow="Create workspace"
      title="Set up a cleaner place to review change risk."
      description="Create your account with Supabase Auth, then save your reviewer profile before Phase 3 review storage lands."
    >
      <div className="w-full max-w-md space-y-4">
        {!hasSupabaseEnv() ? <SupabaseEnvNotice /> : null}
        <AuthForm
          title="Sign up"
          description="Create your workspace access and bootstrap the profile row used by settings."
          submitLabel="Create account"
          action={signupAction}
          footerLabel="Already have an account?"
          footerHref="/login"
          footerLinkText="Log in"
          disabled={!hasSupabaseEnv()}
          message={message}
          fields={[
            {
              id: "full_name",
              label: "Full name",
              placeholder: "Jordan Lee",
              autoComplete: "name",
            },
            {
              id: "email",
              label: "Work email",
              type: "email",
              placeholder: "you@company.com",
              autoComplete: "email",
            },
            {
              id: "password",
              label: "Password",
              type: "password",
              placeholder: "Create a secure password",
              autoComplete: "new-password",
            },
          ]}
        />
      </div>
    </AuthShell>
  );
}
