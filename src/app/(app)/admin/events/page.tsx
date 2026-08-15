"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormDatePicker } from "@/components/forms/form-date-picker";
import { FormFileInput } from "@/components/forms/form-file-input";
import { CoverMedia } from "@/components/domain/cover-media";
import { asFile, uploadFile } from "@/lib/api/upload";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { useEventActions, useEvents } from "@/hooks/api/use-events";
import { eventSchema, type EventFormValues } from "@/lib/validations/career";
import type { AlumniEvent } from "@/lib/api/services/career.service";
import { formatEventDate } from "@/components/domain/event-card";

const EMPTY_EVENT: EventFormValues = {
  title: "",
  description: "",
  location: "",
  startsAt: "",
  endsAt: "",
  capacity: "",
  cover: undefined,
};

export default function AdminEventsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { events, loading, error, refetch } = useEvents({ includeUnpublished: true });
  const {
    createEvent,
    updateEvent,
    publishEvent,
    cancelEvent,
    creating,
    updating,
    publishing,
    cancelling,
  } = useEventActions();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<AlumniEvent | null>(null);
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: EMPTY_EVENT,
  });

  if (authLoading)
    return <LoadingState variant="rows" count={2} message="Checking access..." />;
  if (user?.role !== "admin") {
    return (
      <EmptyState
        title="Administrators only"
        description="Event create, publish, and cancel tools are limited to administrators."
        actionLabel="Back home"
        onAction={() => router.push("/home")}
      />
    );
  }

  const openCreate = () => {
    setEditing(null);
    form.reset(EMPTY_EVENT);
    setOpen(true);
  };

  const openEdit = (event: AlumniEvent) => {
    setEditing(event);
    form.reset({
      title: event.title,
      description: event.description,
      location: event.location,
      startsAt: event.startsAt.slice(0, 10),
      endsAt: event.endsAt ? event.endsAt.slice(0, 10) : "",
      capacity: event.capacity ? String(event.capacity) : "",
      cover: undefined,
    });
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Event desk</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Create drafts, publish when ready, and cancel if plans change. Optional cover
            images are stored in Supabase.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          Create event
        </Button>
      </div>

      {loading ? (
        <LoadingState variant="rows" count={4} message="Loading events..." />
      ) : error ? (
        <ErrorState
          title="Could not load events"
          message={error}
          onRetry={() => refetch()}
        />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events yet"
          description="Create a draft, then publish it to the alumni calendar."
        />
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <article key={event.id} className="frosted-glass-card p-4 space-y-3">
              <CoverMedia url={event.coverImageUrl} alt={event.title} />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{event.title}</div>
                  <div className="text-xs text-[#c2c2c2]">
                    {event.location} · {formatEventDate(event.startsAt)}
                  </div>
                  <div className="text-xs text-[#686868]">
                    {event.registeredCount} registered
                    {event.capacity ? ` / ${event.capacity}` : ""}
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {event.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {event.status !== "cancelled" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(event)}
                  >
                    Edit
                  </Button>
                )}
                {event.status === "draft" && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={publishing}
                    onClick={() => publishEvent(event.id)}
                  >
                    Publish
                  </Button>
                )}
                {event.status !== "cancelled" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={cancelling}
                    onClick={() => cancelEvent(event.id)}
                  >
                    Cancel event
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit event" : "Create event"}
        description="Drafts stay hidden until you publish them."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              const cover = asFile(values.cover);
              let coverFileId: string | undefined;
              if (cover) {
                try {
                  setUploading(true);
                  coverFileId = (await uploadFile(cover, "event")).id;
                } catch (error) {
                  toast.error("Could not upload cover", {
                    description:
                      error instanceof Error
                        ? error.message
                        : "Try a JPEG, PNG, or WebP under 5MB.",
                  });
                  return;
                } finally {
                  setUploading(false);
                }
              }
              const input = {
                title: values.title,
                description: values.description,
                location: values.location,
                startsAt: values.startsAt,
                endsAt: values.endsAt || undefined,
                capacity: values.capacity ? Number(values.capacity) : undefined,
                coverFileId,
              };
              if (editing) {
                await updateEvent(editing.id, input);
              } else {
                await createEvent(input);
              }
              setOpen(false);
              form.reset(EMPTY_EVENT);
            })}
            className="space-y-4"
          >
            <FormInput control={form.control} name="title" label="Title" />
            <FormTextarea control={form.control} name="description" label="Description" />
            <FormInput control={form.control} name="location" label="Location" />
            <FormDatePicker control={form.control} name="startsAt" label="Starts" />
            <FormDatePicker
              control={form.control}
              name="endsAt"
              label="Ends (optional)"
            />
            <FormInput
              control={form.control}
              name="capacity"
              label="Capacity (optional)"
              placeholder="80"
            />
            <FormFileInput
              control={form.control}
              name="cover"
              label="Cover image"
              accept="image/jpeg,image/png,image/webp"
              maxSizeBytes={5 * 1024 * 1024}
              description="Optional JPEG, PNG, or WebP up to 5MB."
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={creating || updating || uploading}>
                {uploading ? "Uploading…" : editing ? "Save changes" : "Save draft"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
