import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/layout/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Create workspace"
      title="Set up a cleaner place to review change risk."
      description="The sign-up route is ready for later Supabase integration while already matching the product’s dark SaaS visual language."
    >
      <AuthForm
        title="Sign up"
        description="Create your account once auth is connected in the next phase."
        submitLabel="Create account"
        footerLabel="Already have an account?"
        footerHref="/login"
        footerLinkText="Log in"
        fields={[
          {
            id: "name",
            label: "Full name",
            placeholder: "Jordan Lee",
          },
          {
            id: "email",
            label: "Work email",
            type: "email",
            placeholder: "you@company.com",
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Create a secure password",
          },
        ]}
      />
    </AuthShell>
  );
}
