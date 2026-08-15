"use client";

import { authorizedFileUrl } from "@/lib/api/upload";

export function CoverMedia({
  url,
  alt,
  className = "w-full h-44 sm:h-52 object-cover rounded-[16px] border border-[#e5e5e5]/12 bg-[#161616]",
}: {
  url?: string | null;
  alt: string;
  className?: string;
}) {
  const src = authorizedFileUrl(url);
  if (!src) return null;
  return <img src={src} alt={alt} className={className} />;
}
