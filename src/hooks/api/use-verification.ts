"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ME, GET_MY_VERIFICATION, GET_VERIFICATION_REQUESTS } from "@/graphql/queries";
import { REVIEW_VERIFICATION, SUBMIT_VERIFICATION } from "@/graphql/mutations";
import type { VerificationRequest } from "@/lib/api/services/network.service";
import type { VerificationStatus } from "@/lib/api/services/auth.service";
import { toast } from "sonner";

export function useMyVerification() {
  const { data, loading, error, refetch } = useQuery<{
    myVerificationRequest: VerificationRequest | null;
  }>(GET_MY_VERIFICATION, { errorPolicy: "all" });

  return {
    request: data?.myVerificationRequest ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useVerificationRequests(status?: VerificationStatus) {
  const { data, loading, error, refetch } = useQuery<{
    verificationRequests: VerificationRequest[];
  }>(GET_VERIFICATION_REQUESTS, {
    variables: { status },
    errorPolicy: "all",
  });

  return {
    requests: data?.verificationRequests ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useSubmitVerification(onSuccess?: () => void) {
  const [mutate, { loading, error }] = useMutation(SUBMIT_VERIFICATION, {
    refetchQueries: [{ query: GET_MY_VERIFICATION }, { query: GET_ME }],
    onCompleted: () => {
      toast.success("Verification submitted", {
        description: "An administrator will review your request.",
      });
      onSuccess?.();
    },
    onError: (err) => toast.error("Could not submit verification", { description: err.message }),
  });

  return {
    submitVerification: (input: {
      graduationYear: number;
      programme: string;
      studentNumber: string;
      notes?: string;
      documentFileId?: string;
    }) => mutate({ variables: { input } }),
    loading,
    error: error?.message ?? null,
  };
}

export function useReviewVerification(onSuccess?: () => void) {
  const [mutate, { loading }] = useMutation(REVIEW_VERIFICATION, {
    refetchQueries: [{ query: GET_VERIFICATION_REQUESTS }],
    onCompleted: () => {
      toast.success("Review saved");
      onSuccess?.();
    },
    onError: (err) => toast.error("Review failed", { description: err.message }),
  });

  return {
    review: (id: string, approve: boolean, rejectionReason?: string) =>
      mutate({ variables: { id, approve, rejectionReason } }),
    loading,
  };
}
