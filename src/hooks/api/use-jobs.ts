"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_JOB,
  GET_JOBS,
  GET_JOB_APPLICATIONS,
  GET_MY_JOB_APPLICATIONS,
  GET_MY_POSTED_JOBS,
  GET_SAVED_JOBS,
} from "@/graphql/queries";
import {
  APPLY_TO_JOB,
  CLOSE_JOB,
  CREATE_JOB,
  TOGGLE_SAVE_JOB,
  UPDATE_APPLICATION_STATUS,
  WITHDRAW_APPLICATION,
} from "@/graphql/mutations";
import type {
  ApplicationStatus,
  Job,
  JobApplication,
  JobSort,
  JobType,
} from "@/lib/api/services/career.service";
import { toast } from "sonner";

const JOB_QUERIES = [
  { query: GET_JOBS },
  { query: GET_SAVED_JOBS },
  { query: GET_MY_POSTED_JOBS },
  { query: GET_MY_JOB_APPLICATIONS },
];

export function useJobs(filters: {
  search?: string;
  type?: JobType | "any";
  location?: string;
  industry?: string;
  sort?: JobSort;
}) {
  const { data, loading, error, refetch } = useQuery<{ jobs: Job[] }>(GET_JOBS, {
    variables: {
      search: filters.search || undefined,
      type: filters.type && filters.type !== "any" ? filters.type : undefined,
      location: filters.location || undefined,
      industry: filters.industry || undefined,
      sort: filters.sort ?? "RECENT",
    },
    errorPolicy: "all",
  });
  return { jobs: data?.jobs ?? [], loading, error: error?.message ?? null, refetch };
}

export function useJob(id?: string) {
  const { data, loading, error, refetch } = useQuery<{ job: Job | null }>(GET_JOB, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
  return { job: data?.job ?? null, loading, error: error?.message ?? null, refetch };
}

export function useSavedJobs() {
  const { data, loading, error, refetch } = useQuery<{ savedJobs: Job[] }>(
    GET_SAVED_JOBS,
    {
      errorPolicy: "all",
    }
  );
  return { jobs: data?.savedJobs ?? [], loading, error: error?.message ?? null, refetch };
}

export function useMyPostedJobs() {
  const { data, loading, error, refetch } = useQuery<{ myPostedJobs: Job[] }>(
    GET_MY_POSTED_JOBS,
    {
      errorPolicy: "all",
    }
  );
  return {
    jobs: data?.myPostedJobs ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useMyJobApplications() {
  const { data, loading, error, refetch } = useQuery<{
    myJobApplications: JobApplication[];
  }>(GET_MY_JOB_APPLICATIONS, { errorPolicy: "all" });
  return {
    applications: data?.myJobApplications ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useJobApplications(jobId?: string) {
  const { data, loading, error, refetch } = useQuery<{
    jobApplications: JobApplication[];
  }>(GET_JOB_APPLICATIONS, {
    variables: { jobId },
    skip: !jobId,
    errorPolicy: "all",
  });
  return {
    applications: data?.jobApplications ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useJobActions(jobId?: string) {
  const refetchQueries = [
    ...JOB_QUERIES,
    ...(jobId
      ? [
          { query: GET_JOB, variables: { id: jobId } },
          { query: GET_JOB_APPLICATIONS, variables: { jobId } },
        ]
      : []),
  ];
  const [create, createState] = useMutation(CREATE_JOB, {
    refetchQueries: JOB_QUERIES,
    onCompleted: () => toast.success("Job published"),
    onError: (err) => toast.error("Could not create job", { description: err.message }),
  });
  const [close, closeState] = useMutation(CLOSE_JOB, {
    refetchQueries,
    onCompleted: () => toast.success("Job closed"),
    onError: (err) => toast.error("Could not close job", { description: err.message }),
  });
  const [apply, applyState] = useMutation(APPLY_TO_JOB, {
    refetchQueries,
    onCompleted: () => toast.success("Application submitted"),
    onError: (err) => toast.error("Could not apply", { description: err.message }),
  });
  const [withdraw, withdrawState] = useMutation(WITHDRAW_APPLICATION, {
    refetchQueries,
    onCompleted: () => toast.success("Application withdrawn"),
    onError: (err) => toast.error("Could not withdraw", { description: err.message }),
  });
  const [updateStatus, statusState] = useMutation(UPDATE_APPLICATION_STATUS, {
    refetchQueries,
    onCompleted: () => toast.success("Application updated"),
    onError: (err) =>
      toast.error("Could not update status", { description: err.message }),
  });
  const [save] = useMutation(TOGGLE_SAVE_JOB, {
    refetchQueries,
    onError: (err) => toast.error("Could not save job", { description: err.message }),
  });

  return {
    createJob: (input: Record<string, unknown>) => create({ variables: { input } }),
    closeJob: (id: string) => close({ variables: { id } }),
    applyToJob: (id: string, coverNote: string, resumeFileId?: string) =>
      apply({ variables: { jobId: id, coverNote, resumeFileId } }),
    withdrawApplication: (id: string) => withdraw({ variables: { id } }),
    updateApplicationStatus: (id: string, status: ApplicationStatus) =>
      updateStatus({ variables: { id, status } }),
    toggleSave: (id: string) => save({ variables: { jobId: id } }),
    creating: createState.loading,
    closing: closeState.loading,
    applying: applyState.loading,
    withdrawing: withdrawState.loading,
    updating: statusState.loading,
  };
}
