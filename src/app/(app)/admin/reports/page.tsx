"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useAdminActions, useContentReports } from "@/hooks/api/use-admin";

export default function AdminReportsPage() {
  const { reports, loading, error, refetch } = useContentReports("open");
  const { reviewReport, reviewing } = useAdminActions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Content reports</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Open reports from posts and comments. Marking reviewed does not delete the
          original content.
        </p>
      </div>
      {loading ? (
        <LoadingState variant="rows" count={3} message="Loading reports..." />
      ) : error ? (
        <ErrorState
          title="Could not load reports"
          message={error}
          onRetry={() => refetch()}
        />
      ) : reports.length === 0 ? (
        <EmptyState
          title="No open reports"
          description="When someone reports a post or comment, it appears here."
        />
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <article key={report.id} className="frosted-glass-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium capitalize">
                    {report.targetType}
                  </div>
                  <p className="text-sm text-[#c2c2c2] mt-1">{report.reason}</p>
                  <p className="text-xs text-[#686868] mt-1">
                    Reported by {report.reporter?.name ?? "a member"}
                  </p>
                </div>
                <Badge variant="outline">{report.status}</Badge>
              </div>
              <Button
                type="button"
                size="sm"
                disabled={reviewing}
                onClick={() => reviewReport(report.id)}
              >
                Mark reviewed
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
