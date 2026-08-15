"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useAdminOverview } from "@/hooks/api/use-admin";
import { cn } from "@/lib/utils";

const CARDS: Array<{
  key: keyof NonNullable<ReturnType<typeof useAdminOverview>["overview"]>;
  label: string;
  href: string;
}> = [
  { key: "users", label: "Users", href: "/admin/users" },
  {
    key: "pendingVerifications",
    label: "Pending verification",
    href: "/admin/verification",
  },
  { key: "jobs", label: "Jobs", href: "/jobs" },
  { key: "applications", label: "Applications", href: "/jobs" },
  { key: "events", label: "Events", href: "/admin/events" },
  { key: "communities", label: "Communities", href: "/communities" },
  { key: "campaigns", label: "Campaigns", href: "/admin/campaigns" },
  { key: "contributions", label: "Contribution records", href: "/admin/campaigns" },
  { key: "openReports", label: "Open reports", href: "/admin/reports" },
];

export default function AdminOverviewPage() {
  const { overview, loading, error, refetch } = useAdminOverview();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Admin desk</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Counts come from MongoDB, not placeholders. Open a card to manage that area.
          </p>
        </div>
        <Link
          href="/admin/analytics"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Open analytics
        </Link>
      </div>

      {loading ? (
        <LoadingState variant="cards" count={6} message="Loading overview..." />
      ) : error ? (
        <ErrorState
          title="Could not load overview"
          message={error}
          onRetry={() => refetch()}
        />
      ) : !overview ? (
        <EmptyState
          title="No overview yet"
          description="Seed the database, then refresh this desk."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <Link
              key={card.key}
              href={card.href}
              className="frosted-glass-card p-5 space-y-2 hover:border-[#e5e5e5]/30 transition-colors"
            >
              <div className="text-xs text-[#686868]">{card.label}</div>
              <div className="text-2xl font-medium">{overview[card.key]}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
