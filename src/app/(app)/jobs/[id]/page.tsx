"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormFileInput } from "@/components/forms/form-file-input";
import { asFile, authorizedFileUrl, uploadFile } from "@/lib/api/upload";
import { toast } from "sonner";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { useJob, useJobActions, useJobApplications } from "@/hooks/api/use-jobs";
import { applySchema, type ApplyFormValues } from "@/lib/validations/career";
import type { ApplicationStatus } from "@/lib/api/services/career.service";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  contract: "Contract",
};

const NEXT_STATUS: Partial<Record<ApplicationStatus, ApplicationStatus[]>> = {
  submitted: ["reviewing", "shortlisted", "rejected"],
  reviewing: ["shortlisted", "rejected"],
  shortlisted: ["reviewing", "rejected"],
};

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { job, loading, error, refetch } = useJob(params.id);
  const isPoster = Boolean(
    job && (job.postedBy?.id === user?.id || user?.role === "admin")
  );
  const applications = useJobApplications(isPoster ? params.id : undefined);
  const {
    applyToJob,
    withdrawApplication,
    updateApplicationStatus,
    toggleSave,
    applying,
    withdrawing,
    closing,
    closeJob,
  } = useJobActions(params.id);
  const [applyOpen, setApplyOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const form = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { coverNote: "", resume: undefined },
  });

  if (loading) return <LoadingState variant="rows" count={3} message="Loading job..." />;
  if (error)
    return (
      <ErrorState title="Job unavailable" message={error} onRetry={() => refetch()} />
    );
  if (!job) {
    return (
      <EmptyState
        title="Job not found"
        description="This listing may have been removed."
        actionElement={
          <Link href="/jobs" className={cn(buttonVariants())}>
            Back to jobs
          </Link>
        }
      />
    );
  }

  const canApply =
    job.status === "open" && job.postedBy?.id !== user?.id && !job.myApplication;
  const canWithdraw =
    job.myApplication &&
    job.myApplication.status !== "withdrawn" &&
    job.myApplication.status !== "rejected";

  return (
    <div className="space-y-6">
      <Link
        href="/jobs"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Back to jobs
      </Link>

      <section className="gradient-hero-panel p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{TYPE_LABEL[job.type] ?? job.type}</Badge>
          <Badge variant="outline" className="capitalize">
            {job.status}
          </Badge>
          {job.industry && <Badge variant="outline">{job.industry}</Badge>}
        </div>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
          {job.title}
        </h1>
        <p className="text-sm text-[#c2c2c2]">
          {job.company} · {job.location}
          {job.postedBy?.name ? ` · posted by ${job.postedBy.name}` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => toggleSave(job.id)}>
            {job.savedByMe ? "Saved" : "Save"}
          </Button>
          {canApply && (
            <Button type="button" onClick={() => setApplyOpen(true)}>
              Apply
            </Button>
          )}
          {canWithdraw && job.myApplication && (
            <Button
              type="button"
              variant="outline"
              disabled={withdrawing}
              onClick={() => withdrawApplication(job.myApplication!.id)}
            >
              {withdrawing ? "Withdrawing…" : "Withdraw"}
            </Button>
          )}
          {isPoster && job.status === "open" && (
            <Button
              type="button"
              variant="outline"
              disabled={closing}
              onClick={() => closeJob(job.id)}
            >
              Close listing
            </Button>
          )}
        </div>
        {job.myApplication && (
          <p className="text-xs text-[#c2c2c2] capitalize">
            Your application: {job.myApplication.status}
          </p>
        )}
      </section>

      <section className="frosted-glass-card p-5 space-y-3">
        <h2 className="text-base font-medium">About the role</h2>
        <p className="text-sm text-[#c2c2c2] whitespace-pre-wrap">{job.description}</p>
      </section>

      {job.requirements && (
        <section className="frosted-glass-card p-5 space-y-3">
          <h2 className="text-base font-medium">Requirements</h2>
          <p className="text-sm text-[#c2c2c2] whitespace-pre-wrap">{job.requirements}</p>
        </section>
      )}

      {job.applicationUrl && (
        <a
          href={job.applicationUrl}
          target="_blank"
          rel="noreferrer"
          className="block frosted-glass-card p-4 text-sm truncate"
        >
          External apply link: {job.applicationUrl}
        </a>
      )}

      {isPoster && (
        <section className="space-y-3">
          <h2 className="text-base font-medium">Applications ({job.applicationCount})</h2>
          {applications.loading ? (
            <LoadingState variant="rows" count={2} message="Loading applications..." />
          ) : applications.error ? (
            <ErrorState
              title="Could not load applications"
              message={applications.error}
              onRetry={() => applications.refetch()}
            />
          ) : applications.applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Candidates will appear here after they apply."
            />
          ) : (
            <div className="space-y-3">
              {applications.applications.map((application) => (
                <article
                  key={application.id}
                  className="frosted-glass-card p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        {application.applicant?.name ?? "Applicant"}
                      </div>
                      <p className="text-sm text-[#c2c2c2] mt-1">
                        {application.coverNote}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {application.status}
                    </Badge>
                  </div>
                  {application.resumeDownloadUrl && (
                    <a
                      href={authorizedFileUrl(application.resumeDownloadUrl) ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Open {application.resumeFileName || "resume"}
                    </a>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {(NEXT_STATUS[application.status] ?? []).map((status) => (
                      <Button
                        key={status}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => updateApplicationStatus(application.id, status)}
                      >
                        Mark {status}
                      </Button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      <ResponsiveModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        title="Apply for this role"
        description="Your cover note is required. Attach a PDF or Word resume if you have one."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              const resume = asFile(values.resume);
              let resumeFileId: string | undefined;
              if (resume) {
                try {
                  setUploading(true);
                  resumeFileId = (await uploadFile(resume, "resume")).id;
                } catch (error) {
                  toast.error("Could not upload resume", {
                    description:
                      error instanceof Error
                        ? error.message
                        : "Try a PDF or Word file under 8MB.",
                  });
                  return;
                } finally {
                  setUploading(false);
                }
              }
              await applyToJob(job.id, values.coverNote, resumeFileId);
              setApplyOpen(false);
              form.reset({ coverNote: "", resume: undefined });
            })}
            className="space-y-4"
          >
            <FormTextarea
              control={form.control}
              name="coverNote"
              label="Cover note"
              placeholder="Why this role, and what you can contribute."
            />
            <FormFileInput
              control={form.control}
              name="resume"
              label="Resume"
              accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              maxSizeBytes={8 * 1024 * 1024}
              description="Optional PDF, DOC, or DOCX up to 8MB. Only the poster and administrators can open it."
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setApplyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={applying || uploading}>
                {uploading
                  ? "Uploading…"
                  : applying
                    ? "Submitting…"
                    : "Submit application"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
