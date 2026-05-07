import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardHeader({ userEmail }: { userEmail?: string | null }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 px-5 py-4 backdrop-blur xl:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-slate-400">Review operations</p>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[16rem]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input className="pl-10" placeholder="Search reviews, repos, authors" />
          </div>
          <Button variant="outline" size="sm" className="rounded-2xl">
            <Bell className="mr-2 h-4 w-4" />
            Alerts
          </Button>
          <Link href="/dashboard/new-review">
            <Button size="sm" className="rounded-2xl">
              New review
            </Button>
          </Link>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-medium text-slate-200">
                {userEmail ?? "reviewer@local.dev"}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
