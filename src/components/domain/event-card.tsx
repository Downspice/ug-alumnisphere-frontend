"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { AlumniEvent } from "@/lib/api/services/career.service";
import { cn } from "@/lib/utils";

export function formatEventDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event, href }: { event: AlumniEvent; href?: string }) {
  return (
    <article className="frosted-glass-card p-5 space-y-3 animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium">{event.title}</h3>
        <Badge variant="outline" className="capitalize">
          {event.status}
        </Badge>
      </div>
      <p className="text-xs text-[#c2c2c2]">{event.location}</p>
      <p className="text-xs text-[#686868]">{formatEventDate(event.startsAt)}</p>
      <p className="text-sm text-[#c2c2c2] line-clamp-3">{event.description}</p>
      <div className="text-xs text-[#686868]">
        {event.registeredCount} registered
        {event.capacity ? ` / ${event.capacity}` : ""}
        {event.registeredByMe ? " · you are going" : ""}
      </div>
      <Link
        href={href ?? `/events/${event.id}`}
        className={cn(buttonVariants({ size: "sm" }))}
      >
        Open
      </Link>
    </article>
  );
}
