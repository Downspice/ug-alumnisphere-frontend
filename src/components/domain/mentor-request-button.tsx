"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useMentorshipActions,
  useMentorshipRequestStatus,
} from "@/hooks/api/use-mentorship";
import {
  mentorshipRequestSchema,
  type MentorshipRequestValues,
} from "@/lib/validations/career";

export function MentorRequestButton({
  mentorId,
  openToMentor,
  compact = false,
}: {
  mentorId: string;
  openToMentor?: boolean;
  compact?: boolean;
}) {
  const { user } = useAuth();
  const { request, refetch } = useMentorshipRequestStatus(mentorId);
  const { requestMentorship, requesting } = useMentorshipActions(mentorId);
  const [open, setOpen] = useState(false);
  const form = useForm<MentorshipRequestValues>({
    resolver: zodResolver(mentorshipRequestSchema),
    defaultValues: { message: "" },
  });

  if (!user || user.id === mentorId || !openToMentor) return null;

  if (request?.status === "pending") {
    return (
      <Button type="button" variant="outline" size={compact ? "sm" : "default"} disabled>
        Request sent
      </Button>
    );
  }
  if (request?.status === "accepted") {
    return (
      <Button type="button" variant="outline" size={compact ? "sm" : "default"} disabled>
        Mentoring
      </Button>
    );
  }

  return (
    <>
      <Button
        type="button"
        size={compact ? "sm" : "default"}
        onClick={() => setOpen(true)}
      >
        Request mentor
      </Button>
      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Request mentorship"
        description="Tell this alumni what you want help with. They can accept or decline."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await requestMentorship(mentorId, values.message);
              setOpen(false);
              form.reset({ message: "" });
              await refetch();
            })}
            className="space-y-4"
          >
            <FormTextarea
              control={form.control}
              name="message"
              label="What do you need help with?"
              placeholder="I am preparing for product interviews and would like monthly feedback."
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={requesting}>
                {requesting ? "Sending…" : "Send request"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </>
  );
}
