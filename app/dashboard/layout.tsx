import type { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 px-5 py-8 xl:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
