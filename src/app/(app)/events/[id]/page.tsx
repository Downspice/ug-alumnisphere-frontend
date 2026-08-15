"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatEventDate } from "@/components/domain/event-card";
import { CoverMedia } from "@/components/domain/cover-media";
import { useEvent, useEventActions } from "@/hooks/api/use-events";
import { cn } from "@/lib/utils";

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const { event, loading, error, refetch } = useEvent(params.id);
  const { registerForEvent, cancelRegistration, registering, leaving } = useEventActions(
    params.id
  );

  if (loading)
    return <LoadingState variant="rows" count={3} message="Loading event..." />;
  if (error)
    return (
      <ErrorState title="Event unavailable" message={error} onRetry={() => refetch()} />
    );
  if (!event) {
    return (
      <EmptyState
        title="Event not found"
        description="This event may be unpublished or cancelled."
        actionElement={
          <Link href="/events" className={cn(buttonVariants())}>
            Back to events
          </Link>
        }
      />
    );
  }

  const full = Boolean(event.capacity && event.registeredCount >= event.capacity);

  return (
    <div className="space-y-6">
      <Link
        href="/events"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Back to events
      </Link>
      <CoverMedia url={event.coverImageUrl} alt={event.title} />
      <section className="gradient-hero-panel p-6 sm:p-8 space-y-4">
        <Badge variant="outline" className="capitalize">
          {event.status}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
          {event.title}
        </h1>
        <p className="text-sm text-[#c2c2c2]">{event.location}</p>
        <p className="text-sm text-[#c2c2c2]">{formatEventDate(event.startsAt)}</p>
        {event.endsAt && (
          <p className="text-xs text-[#686868]">Ends {formatEventDate(event.endsAt)}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {event.status === "published" && !event.registeredByMe && (
            <Button
              type="button"
              disabled={registering || full}
              onClick={() => registerForEvent(event.id)}
            >
              {full ? "Event full" : registering ? "Registering…" : "Register"}
            </Button>
          )}
          {event.registeredByMe && (
            <Button
              type="button"
              variant="outline"
              disabled={leaving}
              onClick={() => cancelRegistration(event.id)}
            >
              {leaving ? "Cancelling…" : "Cancel registration"}
            </Button>
          )}
        </div>
        <p className="text-xs text-[#c2c2c2]">
          {event.registeredCount} registered
          {event.capacity ? ` of ${event.capacity}` : ""}
        </p>
      </section>
      <section className="frosted-glass-card p-5 space-y-2">
        <h2 className="text-base font-medium">About</h2>
        <p className="text-sm text-[#c2c2c2] whitespace-pre-wrap">{event.description}</p>
      </section>
    </div>
  );
}
