import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "bg-white text-slate-950 hover:bg-slate-200 focus-visible:ring-slate-300",
  secondary:
    "bg-slate-900 text-slate-100 hover:bg-slate-800 focus-visible:ring-slate-700",
  ghost:
    "bg-transparent text-slate-200 hover:bg-white/10 hover:text-white focus-visible:ring-slate-700",
  outline:
    "border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10 focus-visible:ring-slate-700",
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-6",
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
