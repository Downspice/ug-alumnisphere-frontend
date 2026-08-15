"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Briefcase,
  CalendarDays,
  Handshake,
  HeartHandshake,
  Home,
  Landmark,
  LayoutDashboard,
  MessageCircle,
  Newspaper,
  SlidersHorizontal,
  UserRound,
  Users,
  Waypoints,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { href: "/home", label: "Home", icon: Home },
      { href: "/feed", label: "Feed", icon: Newspaper },
      { href: "/notifications", label: "Alerts", icon: Bell },
    ],
  },
  {
    label: "Network",
    items: [
      { href: "/directory", label: "Directory", icon: Users },
      { href: "/network", label: "Network", icon: Waypoints },
      { href: "/messages", label: "Messages", icon: MessageCircle },
      { href: "/communities", label: "Communities", icon: Landmark },
    ],
  },
  {
    label: "Opportunity",
    items: [
      { href: "/jobs", label: "Jobs", icon: Briefcase },
      { href: "/mentors", label: "Mentors", icon: Handshake },
      { href: "/events", label: "Events", icon: CalendarDays },
      { href: "/campaigns", label: "Give", icon: HeartHandshake },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/profile", label: "Profile", icon: UserRound }],
  },
];

const ADMIN_GROUP: NavGroup = {
  label: "Desk",
  items: [
    { href: "/admin", label: "Admin", icon: LayoutDashboard },
    { href: "/dev/playground", label: "Playground", icon: SlidersHorizontal },
  ],
};

function isActivePath(pathname: string, href: string) {
  if (href === "/home") return pathname === "/home";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function groupsForRole(role?: string | null): NavGroup[] {
  return role === "admin" ? [...NAV_GROUPS, ADMIN_GROUP] : NAV_GROUPS;
}

export function currentNavLabel(pathname: string, role?: string | null) {
  for (const group of groupsForRole(role)) {
    for (const item of group.items) {
      if (isActivePath(pathname, item.href)) return item.label;
    }
  }
  return "AlumniSphere";
}

export function AppSidebarNav({
  role,
  unread = 0,
  onNavigate,
}: {
  role?: string | null;
  unread?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const groups = groupsForRole(role);

  return (
    <nav className="flex flex-col gap-4" aria-label="Workspace">
      {groups.map((group, index) => (
        <div key={group.label} className="flex flex-col gap-1.5">
          {index > 0 && <Separator className="mb-1.5" />}
          <p className="px-3 text-[11px] uppercase tracking-[0.14em] text-[#ba8f4a]/80">
            {group.label}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "inline-flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-sm transition-colors border",
                  active
                    ? "bg-white text-[#161616] border-white"
                    : "text-[#ededed]/85 border-transparent hover:border-[#ba8f4a]/25 hover:bg-[#ba8f4a]/8"
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.href === "/notifications" && unread > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px] leading-4",
                      active ? "bg-[#161616] text-white" : "bg-white text-[#161616]"
                    )}
                  >
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
