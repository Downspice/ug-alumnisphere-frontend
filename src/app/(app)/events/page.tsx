"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/domain/event-card";
import { useAuth } from "@/components/providers/auth-provider";
import { useEvents, useMyEventRegistrations } from "@/hooks/api/use-events";
import { eventFilterSchema, type EventFilterValues } from "@/lib/validations/career";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const { user } = useAuth();
  const [applied, setApplied] = useState<EventFilterValues>({ search: "", location: "" });
  const events = useEvents(applied);
  const mine = useMyEventRegistrations();
  const form = useForm<EventFilterValues>({
    resolver: zodResolver(eventFilterSchema),
    defaultValues: applied,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Events</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Published alumni events. Registration is unique per person — you cannot register twice.
          </p>
        </div>
        {user?.role === "admin" && (
          <Link href="/admin/events" className={cn(buttonVariants({ variant: "outline" }))}>
            Manage events
          </Link>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => setApplied(values))}
          className="frosted-glass-card p-5 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <FormInput control={form.control} name="search" label="Search" placeholder="Title or description" />
          <FormInput control={form.control} name="location" label="Location" />
          <Button type="submit" variant="outline" className="md:self-end">
            Search
          </Button>
        </form>
      </Form>

      <Tabs defaultValue="upcoming" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12">
          <TabsTrigger value="upcoming" className="rounded-full text-xs">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="mine" className="rounded-full text-xs">
            My registrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {events.loading ? (
            <LoadingState variant="cards" count={3} message="Loading events..." />
          ) : events.error ? (
            <ErrorState title="Could not load events" message={events.error} onRetry={() => events.refetch()} />
          ) : events.events.length === 0 ? (
            <EmptyState title="No published events" description="Administrators publish events from the events desk." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine">
          {mine.loading ? (
            <LoadingState variant="cards" count={2} message="Loading registrations..." />
          ) : mine.error ? (
            <ErrorState title="Could not load registrations" message={mine.error} onRetry={() => mine.refetch()} />
          ) : mine.registrations.length === 0 ? (
            <EmptyState title="You are not registered" description="Open an event and register when you can attend." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mine.registrations.map((item) => (
                <EventCard key={item.id} event={item.event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
