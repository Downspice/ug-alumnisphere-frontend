"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useNotificationActions, useNotifications } from "@/hooks/api/use-notifications";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { notifications, loading, error, refetch } = useNotifications();
  const { markRead, markAllRead, markingAll } = useNotificationActions();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Notifications</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Unread items poll every 15 seconds. Open a notification to jump to the related screen.
          </p>
        </div>
        <Button type="button" variant="outline" disabled={markingAll} onClick={() => markAllRead()}>
          Mark all read
        </Button>
      </div>

      {loading ? (
        <LoadingState variant="rows" count={4} message="Loading notifications..." />
      ) : error ? (
        <ErrorState title="Could not load notifications" message={error} onRetry={() => refetch()} />
      ) : notifications.length === 0 ? (
        <EmptyState title="Inbox is empty" description="Connection, verification, job, mentorship, and giving events appear here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <article
              key={item.id}
              className={cn(
                "frosted-glass-card p-4 space-y-2",
                !item.read && "border-[#e5e5e5]/30"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{item.title}</div>
                  <p className="text-xs text-[#c2c2c2] mt-1">{item.body}</p>
                </div>
                {!item.read && (
                  <Button type="button" size="sm" variant="outline" onClick={() => markRead(item.id)}>
                    Mark read
                  </Button>
                )}
              </div>
              <Link
                href={item.href || "/home"}
                onClick={() => {
                  if (!item.read) void markRead(item.id);
                }}
                className="text-xs text-[#c2c2c2] underline-offset-4 hover:underline"
              >
                Open related page
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
