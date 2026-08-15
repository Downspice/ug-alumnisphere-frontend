"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_COMMUNITIES,
  GET_COMMUNITY,
  GET_COMMUNITY_JOIN_REQUESTS,
  GET_COMMUNITY_MEMBERS,
} from "@/graphql/queries";
import {
  ASSIGN_MODERATOR,
  CREATE_COMMUNITY,
  JOIN_COMMUNITY,
  LEAVE_COMMUNITY,
  REVIEW_JOIN_REQUEST,
} from "@/graphql/mutations";
import type {
  Community,
  CommunityJoinRequest,
  CommunityMember,
} from "@/lib/api/services/social.service";
import { toast } from "sonner";

function communityQueries(communityId?: string) {
  return [
    { query: GET_COMMUNITIES },
    { query: GET_COMMUNITIES, variables: { mine: true } },
    ...(communityId
      ? [
          { query: GET_COMMUNITY, variables: { id: communityId } },
          { query: GET_COMMUNITY_MEMBERS, variables: { communityId } },
          { query: GET_COMMUNITY_JOIN_REQUESTS, variables: { communityId } },
        ]
      : []),
  ];
}

export function useCommunities(search?: string, mine?: boolean) {
  const { data, loading, error, refetch } = useQuery<{ communities: Community[] }>(
    GET_COMMUNITIES,
    {
      variables: { search: search || undefined, mine: mine || undefined },
      errorPolicy: "all",
    }
  );
  return {
    communities: data?.communities ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useCommunity(id?: string) {
  const { data, loading, error, refetch } = useQuery<{ community: Community | null }>(
    GET_COMMUNITY,
    {
      variables: { id },
      skip: !id,
      errorPolicy: "all",
    }
  );
  return {
    community: data?.community ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useCommunityMembers(communityId?: string) {
  const { data, loading, error, refetch } = useQuery<{
    communityMembers: CommunityMember[];
  }>(GET_COMMUNITY_MEMBERS, {
    variables: { communityId },
    skip: !communityId,
    errorPolicy: "all",
  });
  return {
    members: data?.communityMembers ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useCommunityJoinRequests(communityId?: string, skip = false) {
  const { data, loading, error, refetch } = useQuery<{
    communityJoinRequests: CommunityJoinRequest[];
  }>(GET_COMMUNITY_JOIN_REQUESTS, {
    variables: { communityId },
    skip: skip || !communityId,
    errorPolicy: "all",
  });
  return {
    requests: data?.communityJoinRequests ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useCommunityActions(communityId?: string) {
  const refetchQueries = communityQueries(communityId);
  const [create, createState] = useMutation<{ createCommunity: Community }>(
    CREATE_COMMUNITY,
    {
      refetchQueries: [
        { query: GET_COMMUNITIES },
        { query: GET_COMMUNITIES, variables: { mine: true } },
      ],
      onCompleted: () => toast.success("Community created"),
      onError: (err) =>
        toast.error("Could not create community", { description: err.message }),
    }
  );
  const [join, joinState] = useMutation(JOIN_COMMUNITY, {
    refetchQueries,
    onCompleted: (data) => {
      const community = (data as { joinCommunity?: Community }).joinCommunity;
      toast.success(
        community?.isPrivate && !community.myRole
          ? "Join request sent"
          : "You joined the community"
      );
    },
    onError: (err) => toast.error("Could not join", { description: err.message }),
  });
  const [leave, leaveState] = useMutation(LEAVE_COMMUNITY, {
    refetchQueries,
    onCompleted: () => toast.success("You left the community"),
    onError: (err) => toast.error("Could not leave", { description: err.message }),
  });
  const [review, reviewState] = useMutation(REVIEW_JOIN_REQUEST, {
    refetchQueries,
    onCompleted: () => toast.success("Join request updated"),
    onError: (err) =>
      toast.error("Could not review request", { description: err.message }),
  });
  const [assign, assignState] = useMutation(ASSIGN_MODERATOR, {
    refetchQueries,
    onCompleted: () => toast.success("Member role updated"),
    onError: (err) => toast.error("Could not update role", { description: err.message }),
  });

  return {
    createCommunity: (input: {
      name: string;
      description?: string;
      isPrivate?: boolean;
    }) => create({ variables: { input } }),
    joinCommunity: (id: string) => join({ variables: { id } }),
    leaveCommunity: (id: string) => leave({ variables: { id } }),
    reviewJoinRequest: (id: string, approve: boolean) =>
      review({ variables: { id, approve } }),
    assignModerator: (userId: string, makeModerator: boolean) =>
      assign({ variables: { communityId, userId, makeModerator } }),
    creating: createState.loading,
    joining: joinState.loading,
    leaving: leaveState.loading,
    reviewing: reviewState.loading,
    assigning: assignState.loading,
  };
}
