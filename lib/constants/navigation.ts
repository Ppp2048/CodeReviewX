import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  FolderGit2,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";

export type DashboardNavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const dashboardNavItems: DashboardNavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    description: "High-level metrics and active review queues.",
  },
  {
    href: "/dashboard/new-review",
    label: "New review",
    icon: PlusCircle,
    description: "Start a pull request or diff review flow.",
  },
  {
    href: "/dashboard/reviews",
    label: "Reviews",
    icon: FolderGit2,
    description: "Browse recent and saved review sessions.",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Manage profile, GitHub defaults, and AI preferences.",
  },
];
