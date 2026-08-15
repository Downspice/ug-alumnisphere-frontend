"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormFileInput } from "@/components/forms/form-file-input";
import { Button } from "@/components/ui/button";
import { asFile, uploadFile } from "@/lib/api/upload";
import { Badge } from "@/components/ui/badge";
import { VerifiedMark } from "@/components/domain/verified-mark";
import { useAuth } from "@/components/providers/auth-provider";
import { useMyVerification, useSubmitVerification } from "@/hooks/api/use-verification";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  verificationSchema,
  type VerificationFormValues,
} from "@/lib/validations/network";

export function VerificationPanel() {
  const { user, refetchUser } = useAuth();
  const { request, loading, error, refetch } = useMyVerification();
  const { submitVerification, loading: submitting } = useSubmitVerification(() => {
    void refetch();
    void refetchUser();
  });
  const [uploading, setUploading] = useState(false);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      graduationYear: user?.graduationYear ? String(user.graduationYear) : "",
      programme: user?.programme ?? "",
      studentNumber: "",
      notes: "",
      document: undefined,
    },
  });

  if (!user || user.role !== "alumni") return null;
  if (loading)
    return <LoadingState variant="rows" count={1} message="Loading verification..." />;
  if (error)
    return (
      <ErrorState
        compact
        title="Verification unavailable"
        message={error}
        onRetry={() => refetch()}
      />
    );

  if (user.verificationStatus === "verified") {
    return (
      <div className="frosted-glass-card p-5 space-y-2">
        <div className="flex items-center gap-2">
          <VerifiedMark />
          <p className="text-sm font-medium">Verified alumni</p>
        </div>
        <p className="text-sm text-[#c2c2c2]">
          An administrator has confirmed this alumni identity.
        </p>
      </div>
    );
  }

  if (user.verificationStatus === "pending") {
    return (
      <div className="frosted-glass-card p-5 space-y-2">
        <Badge>Pending review</Badge>
        <p className="text-sm text-[#c2c2c2]">
          Submitted{" "}
          {request ? new Date(request.createdAt).toLocaleDateString() : "recently"}.
          {request?.documentFileName
            ? ` Document on file: ${request.documentFileName}.`
            : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="frosted-glass-card p-5 space-y-4">
      <div>
        <h3 className="text-base font-medium">Alumni verification</h3>
        <p className="text-xs text-[#c2c2c2] mt-1">
          {user.verificationStatus === "rejected"
            ? `Previously rejected: ${user.verificationRejectionReason || "No reason recorded."}`
            : "Submit academic details and an optional supporting document for administrator review."}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            const document = asFile(values.document);
            let documentFileId: string | undefined;
            if (document) {
              try {
                setUploading(true);
                documentFileId = (await uploadFile(document, "verification")).id;
              } catch (error) {
                toast.error("Could not upload document", {
                  description:
                    error instanceof Error
                      ? error.message
                      : "Try a PDF, JPEG, or PNG under 8MB.",
                });
                return;
              } finally {
                setUploading(false);
              }
            }
            await submitVerification({
              graduationYear: Number(values.graduationYear),
              programme: values.programme,
              studentNumber: values.studentNumber,
              notes: values.notes,
              documentFileId,
            });
          })}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="graduationYear"
              label="Graduation year"
            />
            <FormInput control={form.control} name="programme" label="Programme" />
          </div>
          <FormInput
            control={form.control}
            name="studentNumber"
            label="Student / index number"
            description="Visible only to administrators."
          />
          <FormTextarea
            control={form.control}
            name="notes"
            label="Notes"
            placeholder="Optional context for the reviewer"
          />
          <FormFileInput
            control={form.control}
            name="document"
            label="Supporting document"
            accept="application/pdf,image/jpeg,image/png"
            maxSizeBytes={8 * 1024 * 1024}
            description="Optional PDF, JPEG, or PNG up to 8MB. Only administrators can open it."
          />
          <Button type="submit" disabled={submitting || uploading}>
            {uploading ? "Uploading…" : submitting ? "Submitting…" : "Submit for review"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
