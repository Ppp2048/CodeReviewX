"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { ProfileInsert } from "@/lib/db/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  full_name: z.string().trim().max(120).optional(),
  github_username: z.string().trim().max(39).optional(),
  github_profile_url: z.union([z.literal(""), z.string().url("Enter a valid GitHub profile URL.")]),
  default_repo_owner: z.string().trim().max(120).optional(),
  default_repo_name: z.string().trim().max(120).optional(),
  preferred_ai_provider: z.enum(["none", "openai", "gemini"]),
});

function toNullable(value?: string) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function saveProfileAction(formData: FormData) {
  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    github_username: formData.get("github_username"),
    github_profile_url: formData.get("github_profile_url"),
    default_repo_owner: formData.get("default_repo_owner"),
    default_repo_name: formData.get("default_repo_name"),
    preferred_ai_provider: formData.get("preferred_ai_provider"),
  });

  if (!parsed.success) {
    redirect(`/settings?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Profile data is invalid.")}`);
  }

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/settings?error=Supabase environment variables are not configured.");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?error=Your session expired. Please sign in again.");
  }

  const payload: ProfileInsert = {
    id: user.id,
    full_name: toNullable(parsed.data.full_name),
    github_username: toNullable(parsed.data.github_username),
    github_profile_url: toNullable(parsed.data.github_profile_url),
    default_repo_owner: toNullable(parsed.data.default_repo_owner),
    default_repo_name: toNullable(parsed.data.default_repo_name),
    preferred_ai_provider: parsed.data.preferred_ai_provider,
  };

  const { error } = await supabase.from("profiles").upsert(payload, { onConflict: "id" });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  redirect("/settings?success=Profile settings saved.");
}
