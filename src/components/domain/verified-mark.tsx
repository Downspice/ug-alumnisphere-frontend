import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

const ICON = {
  sm: "size-2.5",
  md: "size-2.5",
  lg: "size-3",
} as const;

export function VerifiedMark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      title="Verified alumni"
      aria-label="Verified alumni"
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-[#1d9bf0] text-white shrink-0",
        SIZES[size],
        className
      )}
    >
      <Check className={ICON[size]} strokeWidth={3} aria-hidden />
    </span>
  );
}
