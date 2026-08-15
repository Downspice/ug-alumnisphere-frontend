"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { Job } from "@/lib/api/services/career.service";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  contract: "Contract",
};

export function JobCard({ job, footer }: { job: Job; footer?: React.ReactNode }) {
  return (
    <article className="frosted-glass-card p-5 flex flex-col gap-3 animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-medium truncate">{job.title}</h3>
          <p className="text-xs text-[#c2c2c2]">
            {job.company} · {job.location}
          </p>
        </div>
        <Badge variant={job.status === "open" ? "secondary" : "outline"} className="capitalize">
          {job.status}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1.5 text-[11px] text-[#c2c2c2]">
        <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5">
          {TYPE_LABEL[job.type] ?? job.type}
        </span>
        {job.industry && (
          <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5">{job.industry}</span>
        )}
        {job.myApplication && (
          <span className="rounded-full border border-[#e5e5e5]/12 px-2 py-0.5 capitalize">
            {job.myApplication.status}
          </span>
        )}
      </div>
      <p className="text-sm text-[#c2c2c2] line-clamp-3">{job.description}</p>
      <div className="mt-auto flex items-center justify-between gap-2">
        <Link href={`/jobs/${job.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          View role
        </Link>
        {footer}
      </div>
    </article>
  );
}
