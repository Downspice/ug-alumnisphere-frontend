"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-8",
  md: "h-10",
  lg: "h-24 sm:h-28",
} as const;

type BrandMarkProps = {
  href?: string | null;
  size?: keyof typeof SIZES;
  showWordmark?: boolean;
  stacked?: boolean;
  className?: string;
};

export function BrandMark({
  href = "/",
  size = "md",
  showWordmark = true,
  stacked = false,
  className,
}: BrandMarkProps) {
  const mark = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 min-w-0",
        stacked && "flex-col items-center text-center gap-3",
        className
      )}
    >
      <img
        src="/brand/ug-crest.svg"
        alt="University of Ghana crest"
        className={cn("w-auto shrink-0", SIZES[size])}
      />
      {showWordmark && (
        <span className="min-w-0 leading-tight">
          <span
            className={cn(
              "block font-medium tracking-tight text-[#ededed]",
              size === "lg" ? "text-2xl sm:text-3xl" : "text-sm"
            )}
          >
            AlumniSphere
          </span>
          <span
            className={cn(
              "block uppercase text-[#ba8f4a] tracking-[0.08em]",
              size === "lg" ? "text-xs mt-1" : "text-[10px]"
            )}
          >
            University of Ghana
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} className="shrink-0 hover:opacity-90 transition-opacity">
      {mark}
    </Link>
  );
}
