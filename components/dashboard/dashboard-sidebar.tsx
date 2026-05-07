"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-80 shrink-0 border-r border-white/10 bg-slate-950/70 px-5 py-6 lg:flex lg:flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-sm font-semibold text-cyan-300">
          CR
        </div>
        <div>
          <p className="text-sm font-semibold text-white">CodeReviewX</p>
          <p className="text-xs text-slate-400">Phase 1 dashboard shell</p>
        </div>
      </Link>

      <div className="space-y-2">
        {dashboardNavItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-4 py-3 transition",
                isActive
                  ? "border-cyan-400/30 bg-cyan-400/10"
                  : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.03]",
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl",
                  isActive ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-400",
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className={cn("text-sm font-medium", isActive ? "text-white" : "text-slate-200")}>
                  {item.label}
                </p>
                <p className="text-xs leading-5 text-slate-400">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
