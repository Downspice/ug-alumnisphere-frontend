"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Briefcase,
  CalendarDays,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Home,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Newspaper,
  SlidersHorizontal,
  UserRound,
  Users,
  Waypoints,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useAuth } from "@/components/providers/auth-provider";
import { useUnreadCount } from "@/hooks/api/use-notifications";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/feed", label: "Feed", icon: Newspaper },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/mentors", label: "Mentors", icon: Handshake },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/campaigns", label: "Give", icon: HeartHandshake },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/communities", label: "Communities", icon: Landmark },
  { href: "/directory", label: "Directory", icon: Users },
  { href: "/network", label: "Network", icon: Waypoints },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count: unread } = useUnreadCount();
  const [open, setOpen] = useState(false);

  const items =
    user?.role === "admin"
      ? [
          ...NAV_ITEMS,
          { href: "/admin", label: "Admin", icon: LayoutDashboard },
          { href: "/dev/playground", label: "Playground", icon: SlidersHorizontal },
        ]
      : NAV_ITEMS;

  const links = items.map((item) => {
    const Icon = item.icon;
    const active =
      pathname === item.href ||
      (item.href !== "/home" && pathname.startsWith(`${item.href}/`));
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors border",
          active
            ? "bg-white text-[#161616] border-white"
            : "text-[#ededed]/85 border-[#e5e5e5]/12 hover:border-[#e5e5e5]/30"
        )}
      >
        <Icon className="size-3.5" />
        {item.label}
        {item.href === "/notifications" && unread > 0 && (
          <span className="rounded-full bg-white text-[#161616] px-1.5 text-[10px] leading-4">
            {unread}
          </span>
        )}
      </Link>
    );
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <div className="dusk-violet-wash fixed top-0 inset-x-0 z-50 pointer-events-none" />

      <header className="sticky top-3 z-40 px-4 sm:px-6 max-w-[1100px] mx-auto mt-3">
        <nav className="frosted-floating-nav px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <Link href="/home" className="flex items-center gap-2.5 shrink-0">
            <div className="h-8 w-8 rounded-[10px] bg-white text-[#161616] flex items-center justify-center font-medium text-xs">
              UG
            </div>
            <span className="font-medium text-sm tracking-tight hidden xs:inline">
              AlumniSphere
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2 overflow-x-auto">{links}</div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-xs text-[#ededed] leading-none">{user?.name}</span>
              <span className="text-[11px] text-[#686868] capitalize">{user?.role}</span>
            </div>
            {user?.verificationStatus === "verified" && (
              <Badge className="hidden sm:inline-flex rounded-full bg-white/5 text-[#c2c2c2] border-[#e5e5e5]/12">
                <GraduationCap className="size-3" />
                Verified
              </Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => logout()}
              aria-label="Sign out"
            >
              <LogOut className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-3.5" />
            </Button>
          </div>
        </nav>
      </header>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="bg-[#161616] border-[#e5e5e5]/12">
          <DrawerHeader>
            <DrawerTitle className="text-[#ededed]">Navigate</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 px-4 pb-8">{links}</div>
        </DrawerContent>
      </Drawer>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </main>
    </div>
  );
}
