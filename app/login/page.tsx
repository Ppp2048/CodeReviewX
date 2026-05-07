import { redirect } from "next/navigation";

import { loginAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth/auth-form";
import { SupabaseEnvNotice } from "@/components/layout/supabase-env-notice";
import { AuthShell } from "@/components/layout/auth-shell";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LoginPage({
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
      eyebrow="Welcome back"
      title="Pick up where your review queue left off."
      description="Sign in with Supabase Auth to access your dashboard, profile settings, and upcoming review workflows."
    >
      <div className="w-full max-w-md space-y-4">
        {!hasSupabaseEnv() ? <SupabaseEnvNotice /> : null}
        <AuthForm
          title="Log in"
          description="Use your email and password to continue into the protected dashboard."
          submitLabel="Continue to dashboard"
          action={loginAction}
          footerLabel="Need an account?"
          footerHref="/signup"
          footerLinkText="Create one"
          disabled={!hasSupabaseEnv()}
          message={message}
          fields={[
            {
              id: "email",
              label: "Email",
              type: "email",
              placeholder: "you@company.com",
              autoComplete: "email",
            },
            {
              id: "password",
              label: "Password",
              type: "password",
              placeholder: "Enter your password",
              autoComplete: "current-password",
            },
          ]}
        />
      </div>
    </AuthShell>
  );
}
