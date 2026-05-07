import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/layout/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up where your review queue left off."
      description="This Phase 1 screen is a polished auth entry point. Supabase auth wiring will be added in the next implementation phase."
    >
      <AuthForm
        title="Log in"
        description="Use your email and password once authentication is connected."
        submitLabel="Continue to dashboard"
        footerLabel="Need an account?"
        footerHref="/signup"
        footerLinkText="Create one"
        fields={[
          {
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "you@company.com",
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter your password",
          },
        ]}
      />
    </AuthShell>
  );
}
