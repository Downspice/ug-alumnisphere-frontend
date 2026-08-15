"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import {
  AnalyticsBarChart,
  AnalyticsLineChart,
} from "@/components/domain/analytics-charts";
import { Badge } from "@/components/ui/badge";
import { useAdminAnalytics } from "@/hooks/api/use-admin";

export default function AdminAnalyticsPage() {
  const { analytics, loading, error, refetch } = useAdminAnalytics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Analytics</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Charts are built with Recharts from live Mongo aggregations. Empty series mean
          that collection has no documents yet.
        </p>
      </div>

      {loading ? (
        <LoadingState variant="cards" count={3} message="Loading analytics..." />
      ) : error ? (
        <ErrorState
          title="Could not load analytics"
          message={error}
          onRetry={() => refetch()}
        />
      ) : !analytics ? (
        <EmptyState
          title="No analytics yet"
          description="Create users, jobs, events, or contributions, then return."
        />
      ) : (
        <div className="space-y-4">
          <Badge variant="outline">Source: {analytics.source}</Badge>
          <section className="frosted-glass-card p-5 space-y-3">
            <h2 className="text-base font-medium">Users by role</h2>
            {analytics.usersByRole.length === 0 ? (
              <p className="text-sm text-[#c2c2c2]">No users yet.</p>
            ) : (
              <AnalyticsBarChart data={analytics.usersByRole} label="Users" />
            )}
          </section>
          <section className="frosted-glass-card p-5 space-y-3">
            <h2 className="text-base font-medium">Jobs by type</h2>
            {analytics.jobsByType.length === 0 ? (
              <p className="text-sm text-[#c2c2c2]">No jobs yet.</p>
            ) : (
              <AnalyticsBarChart data={analytics.jobsByType} label="Jobs" />
            )}
          </section>
          <section className="frosted-glass-card p-5 space-y-3">
            <h2 className="text-base font-medium">Events by status</h2>
            {analytics.eventsByStatus.length === 0 ? (
              <p className="text-sm text-[#c2c2c2]">No events yet.</p>
            ) : (
              <AnalyticsBarChart data={analytics.eventsByStatus} label="Events" />
            )}
          </section>
          <section className="frosted-glass-card p-5 space-y-3">
            <h2 className="text-base font-medium">Campaign records (GHS)</h2>
            {analytics.campaignProgress.length === 0 ? (
              <p className="text-sm text-[#c2c2c2]">No campaigns yet.</p>
            ) : (
              <AnalyticsBarChart data={analytics.campaignProgress} label="Raised" />
            )}
          </section>
          <section className="frosted-glass-card p-5 space-y-3">
            <h2 className="text-base font-medium">Contribution records by month</h2>
            {analytics.contributionsByMonth.length === 0 ? (
              <p className="text-sm text-[#c2c2c2]">No contribution records yet.</p>
            ) : (
              <AnalyticsLineChart
                data={analytics.contributionsByMonth}
                label="GHS recorded"
              />
            )}
          </section>
        </div>
      )}
    </div>
  );
}
