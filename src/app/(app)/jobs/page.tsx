"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "@/components/domain/job-card";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useJobActions,
  useJobs,
  useMyJobApplications,
  useMyPostedJobs,
  useSavedJobs,
} from "@/hooks/api/use-jobs";
import {
  jobFilterSchema,
  jobSchema,
  type JobFilterValues,
  type JobFormValues,
} from "@/lib/validations/career";

const EMPTY_FILTERS: JobFilterValues = {
  search: "",
  type: "any",
  location: "",
  industry: "",
  sort: "RECENT",
};

export default function JobsPage() {
  const { user } = useAuth();
  const [applied, setApplied] = useState<JobFilterValues>(EMPTY_FILTERS);
  const [createOpen, setCreateOpen] = useState(false);
  const jobs = useJobs(applied);
  const saved = useSavedJobs();
  const mine = useMyJobApplications();
  const posted = useMyPostedJobs();
  const { createJob, creating } = useJobActions();
  const canPost = user?.role === "alumni" || user?.role === "admin";

  const filterForm = useForm<JobFilterValues>({
    resolver: zodResolver(jobFilterSchema),
    defaultValues: EMPTY_FILTERS,
  });
  const createForm = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "full_time",
      industry: "",
      description: "",
      requirements: "",
      applicationUrl: "",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Jobs</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Search alumni-posted roles, save listings, and track applications. Attach a
            PDF or Word resume when you apply.
          </p>
        </div>
        {canPost && (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Post a job
          </Button>
        )}
      </div>

      <Form {...filterForm}>
        <form
          onSubmit={filterForm.handleSubmit((values) => setApplied(values))}
          className="frosted-glass-card p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <FormInput
            control={filterForm.control}
            name="search"
            label="Search"
            placeholder="Title or company"
          />
          <FormInput control={filterForm.control} name="location" label="Location" />
          <FormInput control={filterForm.control} name="industry" label="Industry" />
          <FormSelect
            control={filterForm.control}
            name="type"
            label="Type"
            options={[
              { value: "any", label: "Any type" },
              { value: "full_time", label: "Full-time" },
              { value: "part_time", label: "Part-time" },
              { value: "internship", label: "Internship" },
              { value: "contract", label: "Contract" },
            ]}
          />
          <FormSelect
            control={filterForm.control}
            name="sort"
            label="Sort"
            options={[
              { value: "RECENT", label: "Most recent" },
              { value: "TITLE_ASC", label: "Title A–Z" },
            ]}
          />
          <div className="lg:col-span-5 flex justify-end">
            <Button type="submit" variant="outline">
              Apply filters
            </Button>
          </div>
        </form>
      </Form>

      <Tabs defaultValue="open" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12 flex-wrap h-auto">
          <TabsTrigger value="open" className="rounded-full text-xs">
            Open ({jobs.jobs.length})
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-full text-xs">
            Saved ({saved.jobs.length})
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-full text-xs">
            Applications ({mine.applications.length})
          </TabsTrigger>
          {canPost && (
            <TabsTrigger value="posted" className="rounded-full text-xs">
              Posted ({posted.jobs.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="open">
          {jobs.loading ? (
            <LoadingState variant="cards" count={3} message="Loading jobs..." />
          ) : jobs.error ? (
            <ErrorState
              title="Could not load jobs"
              message={jobs.error}
              onRetry={() => jobs.refetch()}
            />
          ) : jobs.jobs.length === 0 ? (
            <EmptyState
              title="No open roles"
              description="Try a broader search, or post a role if you are hiring."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {saved.loading ? (
            <LoadingState variant="cards" count={2} message="Loading saved jobs..." />
          ) : saved.error ? (
            <ErrorState
              title="Could not load saved jobs"
              message={saved.error}
              onRetry={() => saved.refetch()}
            />
          ) : saved.jobs.length === 0 ? (
            <EmptyState
              title="Nothing saved"
              description="Save a role from the listing to find it later."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {saved.jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications">
          {mine.loading ? (
            <LoadingState variant="rows" count={3} message="Loading applications..." />
          ) : mine.error ? (
            <ErrorState
              title="Could not load applications"
              message={mine.error}
              onRetry={() => mine.refetch()}
            />
          ) : mine.applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Open a role and submit a cover note to apply."
            />
          ) : (
            <div className="space-y-3">
              {mine.applications.map((application) => (
                <article
                  key={application.id}
                  className="frosted-glass-card p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium">{application.job?.title}</div>
                    <div className="text-xs text-[#c2c2c2]">
                      {application.job?.company}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {application.status}
                  </Badge>
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        {canPost && (
          <TabsContent value="posted">
            {posted.loading ? (
              <LoadingState
                variant="cards"
                count={2}
                message="Loading your listings..."
              />
            ) : posted.error ? (
              <ErrorState
                title="Could not load listings"
                message={posted.error}
                onRetry={() => posted.refetch()}
              />
            ) : posted.jobs.length === 0 ? (
              <EmptyState
                title="You have not posted a job"
                description="Alumni and administrators can publish roles for the network."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posted.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <ResponsiveModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Post a job"
        description="Listings stay on AlumniSphere. External apply links are optional."
      >
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(async (values) => {
              await createJob({
                ...values,
                industry: values.industry || undefined,
                requirements: values.requirements || undefined,
                applicationUrl: values.applicationUrl || undefined,
              });
              createForm.reset();
              setCreateOpen(false);
            })}
            className="space-y-4"
          >
            <FormInput control={createForm.control} name="title" label="Title" />
            <FormInput control={createForm.control} name="company" label="Company" />
            <FormInput control={createForm.control} name="location" label="Location" />
            <FormSelect
              control={createForm.control}
              name="type"
              label="Type"
              options={[
                { value: "full_time", label: "Full-time" },
                { value: "part_time", label: "Part-time" },
                { value: "internship", label: "Internship" },
                { value: "contract", label: "Contract" },
              ]}
            />
            <FormInput control={createForm.control} name="industry" label="Industry" />
            <FormTextarea
              control={createForm.control}
              name="description"
              label="Description"
            />
            <FormTextarea
              control={createForm.control}
              name="requirements"
              label="Requirements"
            />
            <FormInput
              control={createForm.control}
              name="applicationUrl"
              label="External apply URL (optional)"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Publishing…" : "Publish job"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
