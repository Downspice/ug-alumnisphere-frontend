"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/verification", label: "Verification" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminSubnav() {
  const pathname = usePathname();
  return (
    <div className="flex flex-wrap gap-2">
      {ADMIN_LINKS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs border transition-colors",
              active
                ? "bg-white text-[#161616] border-white"
                : "text-[#c2c2c2] border-[#e5e5e5]/12 hover:border-[#e5e5e5]/30"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
