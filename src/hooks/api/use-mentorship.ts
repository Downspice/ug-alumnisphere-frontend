"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_INCOMING_MENTORSHIP,
  GET_MENTORS,
  GET_MENTORSHIP_REQUEST_STATUS,
  GET_MY_MENTORSHIPS,
  GET_SENT_MENTORSHIP,
} from "@/graphql/queries";
import {
  ACCEPT_MENTORSHIP,
  ADD_MENTORSHIP_GOAL,
  CLOSE_MENTORSHIP,
  DECLINE_MENTORSHIP,
  REQUEST_MENTORSHIP,
  TOGGLE_MENTORSHIP_GOAL,
} from "@/graphql/mutations";
import type { DirectoryUser } from "@/lib/api/services/network.service";
import type { Mentorship, MentorshipRequest } from "@/lib/api/services/career.service";
import { toast } from "sonner";

const MENTORSHIP_QUERIES = [
  { query: GET_INCOMING_MENTORSHIP },
  { query: GET_SENT_MENTORSHIP },
  { query: GET_MY_MENTORSHIPS },
];

export function useMentors(filters: {
  search?: string;
  industry?: string;
  location?: string;
}) {
  const { data, loading, error, refetch } = useQuery<{ mentors: DirectoryUser[] }>(
    GET_MENTORS,
    {
      variables: {
        search: filters.search || undefined,
        industry: filters.industry || undefined,
        location: filters.location || undefined,
      },
      errorPolicy: "all",
    }
  );
  return {
    mentors: data?.mentors ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useMentorshipRequestStatus(userId?: string) {
  const { data, loading, refetch } = useQuery<{
    mentorshipRequestStatus: MentorshipRequest | null;
  }>(GET_MENTORSHIP_REQUEST_STATUS, {
    variables: { userId },
    skip: !userId,
    errorPolicy: "all",
  });
  return { request: data?.mentorshipRequestStatus ?? null, loading, refetch };
}

export function useIncomingMentorship() {
  const { data, loading, error, refetch } = useQuery<{
    incomingMentorshipRequests: MentorshipRequest[];
  }>(GET_INCOMING_MENTORSHIP, { errorPolicy: "all" });
  return {
    requests: data?.incomingMentorshipRequests ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useSentMentorship() {
  const { data, loading, error, refetch } = useQuery<{
    sentMentorshipRequests: MentorshipRequest[];
  }>(GET_SENT_MENTORSHIP, { errorPolicy: "all" });
  return {
    requests: data?.sentMentorshipRequests ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useMyMentorships() {
  const { data, loading, error, refetch } = useQuery<{ myMentorships: Mentorship[] }>(
    GET_MY_MENTORSHIPS,
    { errorPolicy: "all" }
  );
  return {
    mentorships: data?.myMentorships ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useMentorshipActions(userId?: string) {
  const refetchQueries = [
    ...MENTORSHIP_QUERIES,
    ...(userId ? [{ query: GET_MENTORSHIP_REQUEST_STATUS, variables: { userId } }] : []),
  ];
  const [request, requestState] = useMutation(REQUEST_MENTORSHIP, {
    refetchQueries,
    onCompleted: () => toast.success("Mentorship request sent"),
    onError: (err) => toast.error("Could not send request", { description: err.message }),
  });
  const [accept, acceptState] = useMutation(ACCEPT_MENTORSHIP, {
    refetchQueries: MENTORSHIP_QUERIES,
    onCompleted: () => toast.success("Mentorship accepted"),
    onError: (err) => toast.error("Could not accept", { description: err.message }),
  });
  const [decline, declineState] = useMutation(DECLINE_MENTORSHIP, {
    refetchQueries: MENTORSHIP_QUERIES,
    onCompleted: () => toast.success("Request declined"),
    onError: (err) => toast.error("Could not decline", { description: err.message }),
  });
  const [addGoal, goalState] = useMutation(ADD_MENTORSHIP_GOAL, {
    refetchQueries: MENTORSHIP_QUERIES,
    onCompleted: () => toast.success("Goal added"),
    onError: (err) => toast.error("Could not add goal", { description: err.message }),
  });
  const [toggleGoal] = useMutation(TOGGLE_MENTORSHIP_GOAL, {
    refetchQueries: MENTORSHIP_QUERIES,
    onError: (err) => toast.error("Could not update goal", { description: err.message }),
  });
  const [close, closeState] = useMutation(CLOSE_MENTORSHIP, {
    refetchQueries: MENTORSHIP_QUERIES,
    onCompleted: () => toast.success("Mentorship closed"),
    onError: (err) =>
      toast.error("Could not close mentorship", { description: err.message }),
  });

  return {
    requestMentorship: (mentorId: string, message: string) =>
      request({ variables: { mentorId, message } }),
    acceptRequest: (id: string) => accept({ variables: { id } }),
    declineRequest: (id: string) => decline({ variables: { id } }),
    addGoal: (mentorshipId: string, text: string) =>
      addGoal({ variables: { mentorshipId, text } }),
    toggleGoal: (mentorshipId: string, goalId: string) =>
      toggleGoal({ variables: { mentorshipId, goalId } }),
    closeMentorship: (id: string) => close({ variables: { id } }),
    requesting: requestState.loading,
    deciding: acceptState.loading || declineState.loading,
    addingGoal: goalState.loading,
    closing: closeState.loading,
  };
}
