"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function authRedirect(
  pathname: "/login" | "/signup",
  kind: "error" | "success",
  message: string,
): never {
  redirect(`${pathname}?${kind}=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    authRedirect("/login", "error", parsed.error.issues[0]?.message ?? "Invalid login details.");
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    authRedirect("/login", "error", "Supabase environment variables are not configured.");
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    authRedirect("/login", "error", error.message);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    authRedirect("/signup", "error", parsed.error.issues[0]?.message ?? "Invalid signup details.");
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    authRedirect("/signup", "error", "Supabase environment variables are not configured.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.full_name,
      },
    },
  });

  if (error) {
    authRedirect("/signup", "error", error.message);
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/settings?success=Your account is ready. Finish your profile settings.");
  }

  authRedirect("/login", "success", "Account created. Check your email to confirm your sign-in.");
}
