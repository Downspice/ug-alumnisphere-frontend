"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/domain/user-avatar";
import { VerifiedMark } from "@/components/domain/verified-mark";
import type { DirectoryUser } from "@/lib/api/services/network.service";
import { cn } from "@/lib/utils";

export function AlumniCard({
  person,
  footer,
}: {
  person: DirectoryUser;
  footer?: React.ReactNode;
}) {
  return (
    <article className="frosted-glass-card p-5 flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex items-start gap-3">
        <UserAvatar name={person.name} avatarUrl={person.avatarUrl} />
        <div className="space-y-1 min-w-0">
          <h3 className="text-base font-medium text-[#ededed] flex items-center gap-1.5 min-w-0">
            <span className="truncate">{person.name}</span>
            {person.verificationStatus === "verified" && <VerifiedMark size="sm" />}
          </h3>
          <p className="text-xs text-[#c2c2c2] line-clamp-2">
            {person.headline ||
              [person.jobTitle, person.company].filter(Boolean).join(" · ") ||
              "No headline yet"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 text-[11px] text-[#c2c2c2]">
        {person.programme && (
          <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5">
            {person.programme}
          </span>
        )}
        {person.graduationYear && (
          <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5">
            Class of {person.graduationYear}
          </span>
        )}
        {person.location && (
          <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5">
            {person.location}
          </span>
        )}
        {person.openToMentor && (
          <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5">
            Open to mentor
          </span>
        )}
        {person.openToWork && (
          <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5">
            Open to work
          </span>
        )}
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <Link
          href={`/directory/${person.id}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          View profile
        </Link>
        {footer}
      </div>
    </article>
  );
}
