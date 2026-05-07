import Link from "next/link";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-sm font-semibold text-cyan-300">
            CR
          </div>
          <div>
            <p className="text-sm font-semibold text-white">CodeReviewX</p>
            <p className="text-xs text-slate-400">Review intelligence workspace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#workflow" className="transition hover:text-white">
            Workflow
          </a>
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Start free</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
