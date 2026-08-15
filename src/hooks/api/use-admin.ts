"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_ADMIN_ANALYTICS,
  GET_ADMIN_OVERVIEW,
  GET_CONTENT_REPORTS,
  GET_USERS,
} from "@/graphql/queries";
import { REVIEW_REPORT, SET_USER_ACCOUNT_STATUS } from "@/graphql/mutations";
import type {
  AdminAnalytics,
  AdminOverview,
  ContentReport,
} from "@/lib/api/services/giving.service";
import type { User } from "@/lib/api/services/users.service";
import { toast } from "sonner";

export function useAdminOverview() {
  const { data, loading, error, refetch } = useQuery<{ adminOverview: AdminOverview }>(
    GET_ADMIN_OVERVIEW,
    {
      errorPolicy: "all",
    }
  );
  return {
    overview: data?.adminOverview ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useAdminAnalytics() {
  const { data, loading, error, refetch } = useQuery<{ adminAnalytics: AdminAnalytics }>(
    GET_ADMIN_ANALYTICS,
    { errorPolicy: "all" }
  );
  return {
    analytics: data?.adminAnalytics ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useContentReports(status?: string) {
  const { data, loading, error, refetch } = useQuery<{ contentReports: ContentReport[] }>(
    GET_CONTENT_REPORTS,
    { variables: { status }, errorPolicy: "all" }
  );
  return {
    reports: data?.contentReports ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useAdminActions() {
  const [setStatus, statusState] = useMutation(SET_USER_ACCOUNT_STATUS, {
    refetchQueries: [{ query: GET_USERS }, { query: GET_ADMIN_OVERVIEW }],
    onCompleted: () => toast.success("Account status updated"),
    onError: (err) => toast.error("Could not update user", { description: err.message }),
  });
  const [review, reviewState] = useMutation(REVIEW_REPORT, {
    refetchQueries: [{ query: GET_CONTENT_REPORTS }, { query: GET_ADMIN_OVERVIEW }],
    onCompleted: () => toast.success("Report marked reviewed"),
    onError: (err) =>
      toast.error("Could not review report", { description: err.message }),
  });
  return {
    setUserAccountStatus: (id: string, status: string) =>
      setStatus({ variables: { id, status } }),
    reviewReport: (id: string) => review({ variables: { id } }),
    updatingUser: statusState.loading,
    reviewing: reviewState.loading,
  };
}

export type AdminUser = User & { accountStatus?: string; verificationStatus?: string };
