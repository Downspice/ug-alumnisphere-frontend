"use client";

import { authorizedFileUrl } from "@/lib/api/upload";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-8 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-16 text-base",
} as const;

export function UserAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: {
  name?: string | null;
  avatarUrl?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const src = authorizedFileUrl(avatarUrl);
  const initials = (name ?? "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name ? `${name} portrait` : "Profile photo"}
        className={cn(
          "rounded-full object-cover border border-[#e5e5e5]/12 shrink-0",
          SIZES[size],
          className
        )}
      />
    );
  }

  return (
    <div
      aria-hidden={!name}
      className={cn(
        "rounded-full bg-[#161616] border border-[#ba8f4a]/25 flex items-center justify-center text-[#ba8f4a] font-medium shrink-0",
        SIZES[size],
        className
      )}
    >
      {initials || "?"}
    </div>
  );
}
