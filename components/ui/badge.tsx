import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = {
  neutral: "bg-white/10 text-slate-200",
  success: "bg-emerald-500/15 text-emerald-300",
  warning: "bg-amber-500/15 text-amber-300",
  notice: "bg-orange-500/15 text-orange-300",
  danger: "bg-rose-500/15 text-rose-300",
  accent: "bg-cyan-500/15 text-cyan-300",
};

type BadgeProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof badgeVariants;
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
