import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  let userEmail: string | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    userEmail = user?.email ?? null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader userEmail={userEmail} />
          <main className="flex-1 px-5 py-8 xl:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
