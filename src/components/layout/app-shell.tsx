"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, GraduationCap, LogOut, Menu } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useAuth } from "@/components/providers/auth-provider";
import { useUnreadCount } from "@/hooks/api/use-notifications";
import { cn } from "@/lib/utils";
import { AppSidebarNav, currentNavLabel } from "@/components/layout/app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count: unread } = useUnreadCount();
  const [open, setOpen] = useState(false);
  const pageLabel = currentNavLabel(pathname, user?.role);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed]">
      <div className="dusk-violet-wash fixed top-0 inset-x-0 z-50 pointer-events-none" />

      <header className="sticky top-3 z-40 px-4 sm:px-6 max-w-[1400px] mx-auto mt-3">
        <div className="frosted-floating-nav px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3 min-w-0">
            <BrandMark href="/home" size="sm" />
            <span className="hidden lg:inline text-[#686868]">/</span>
            <span className="hidden lg:inline truncate text-sm text-[#c2c2c2]">
              {pageLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              aria-label="Alerts"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon-sm" }),
                "relative"
              )}
            >
              <Bell className="size-3.5" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-white text-[#161616] text-[10px] leading-4 text-center">
                  {unread}
                </span>
              )}
            </Link>
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
        </div>
      </header>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="bg-[#161616] border-[#e5e5e5]/12">
          <DrawerHeader>
            <DrawerTitle className="text-[#ededed]">Navigate</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <AppSidebarNav
              role={user?.role}
              unread={unread}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-10 flex gap-6 items-start">
        <aside className="hidden md:block w-60 shrink-0 sticky top-20 h-[calc(100vh-6.5rem)] animate-in fade-in slide-in-from-left-2 duration-500">
          <div className="frosted-sidebar h-full overflow-y-auto p-3">
            <AppSidebarNav role={user?.role} unread={unread} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
