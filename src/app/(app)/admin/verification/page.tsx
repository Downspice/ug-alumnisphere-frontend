"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useReviewVerification,
  useVerificationRequests,
} from "@/hooks/api/use-verification";
import { Button, buttonVariants } from "@/components/ui/button";
import { authorizedFileUrl } from "@/lib/api/upload";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { rejectionSchema, type RejectionFormValues } from "@/lib/validations/network";
import type { VerificationRequest } from "@/lib/api/services/network.service";

export default function AdminVerificationPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { requests, loading, error, refetch } = useVerificationRequests("pending");
  const { review, loading: reviewing } = useReviewVerification(() => refetch());
  const [rejecting, setRejecting] = useState<VerificationRequest | null>(null);
  const form = useForm<RejectionFormValues>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: { rejectionReason: "" },
  });

  if (authLoading) return <LoadingState variant="spinner" message="Checking access..." />;
  if (user?.role !== "admin") {
    return (
      <EmptyState
        title="Administrators only"
        description="Verification review is limited to administrator accounts."
        actionLabel="Back home"
        onAction={() => router.push("/home")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Alumni verification</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Approve or reject pending identity requests. Supporting documents stay private
          to administrators.
        </p>
      </div>

      {loading ? (
        <LoadingState variant="rows" count={3} message="Loading requests..." />
      ) : error ? (
        <ErrorState
          title="Could not load requests"
          message={error}
          onRetry={() => refetch()}
        />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No pending requests"
          description="New alumni submissions will appear here for review."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <article key={request.id} className="frosted-glass-card p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-medium">{request.applicant?.name}</h3>
                  <p className="text-xs text-[#c2c2c2]">{request.applicant?.email}</p>
                </div>
                <Badge>Pending</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <div className="text-[#686868]">Programme</div>
                  <div>{request.programme}</div>
                </div>
                <div>
                  <div className="text-[#686868]">Graduation year</div>
                  <div>{request.graduationYear}</div>
                </div>
                <div>
                  <div className="text-[#686868]">Student number</div>
                  <div>{request.studentNumber}</div>
                </div>
              </div>
              {request.notes && <p className="text-sm text-[#c2c2c2]">{request.notes}</p>}
              <div className="flex flex-wrap items-center gap-2">
                {request.documentDownloadUrl ? (
                  <a
                    href={authorizedFileUrl(request.documentDownloadUrl) ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Open {request.documentFileName || "document"}
                  </a>
                ) : (
                  <p className="text-[11px] text-[#686868]">
                    No supporting document uploaded.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  disabled={reviewing}
                  onClick={() => review(request.id, true)}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset({ rejectionReason: "" });
                    setRejecting(request);
                  }}
                >
                  Reject
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ResponsiveModal
        open={Boolean(rejecting)}
        onOpenChange={(open) => {
          if (!open) setRejecting(null);
        }}
        title="Reject verification"
        description="The applicant will see this reason and can submit again."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              if (!rejecting) return;
              await review(rejecting.id, false, values.rejectionReason);
              setRejecting(null);
            })}
            className="space-y-4"
          >
            <FormTextarea
              control={form.control}
              name="rejectionReason"
              label="Rejection reason"
              placeholder="The student number could not be matched to university records."
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setRejecting(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={reviewing}>
                {reviewing ? "Saving…" : "Reject request"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
