"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_CAMPAIGN,
  GET_CAMPAIGNS,
  GET_CAMPAIGN_CONTRIBUTIONS,
  GET_MY_CONTRIBUTIONS,
} from "@/graphql/queries";
import {
  CLOSE_CAMPAIGN,
  CREATE_CAMPAIGN,
  PUBLISH_CAMPAIGN,
  RECORD_CONTRIBUTION,
  UPDATE_CAMPAIGN,
} from "@/graphql/mutations";
import type { Campaign, ContributionRecord } from "@/lib/api/services/giving.service";
import { toast } from "sonner";

const CAMPAIGN_QUERIES = [
  { query: GET_CAMPAIGNS },
  { query: GET_CAMPAIGNS, variables: { includeUnpublished: true } },
  { query: GET_MY_CONTRIBUTIONS },
];

export function useCampaigns(search?: string, includeUnpublished?: boolean) {
  const { data, loading, error, refetch } = useQuery<{ campaigns: Campaign[] }>(
    GET_CAMPAIGNS,
    {
      variables: {
        search: search || undefined,
        includeUnpublished: includeUnpublished || undefined,
      },
      errorPolicy: "all",
    }
  );
  return {
    campaigns: data?.campaigns ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useCampaign(id?: string) {
  const { data, loading, error, refetch } = useQuery<{ campaign: Campaign | null }>(
    GET_CAMPAIGN,
    {
      variables: { id },
      skip: !id,
      errorPolicy: "all",
    }
  );
  return {
    campaign: data?.campaign ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useCampaignContributions(campaignId?: string) {
  const { data, loading, error, refetch } = useQuery<{
    campaignContributions: ContributionRecord[];
  }>(GET_CAMPAIGN_CONTRIBUTIONS, {
    variables: { campaignId },
    skip: !campaignId,
    errorPolicy: "all",
  });
  return {
    contributions: data?.campaignContributions ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useMyContributions() {
  const { data, loading, error, refetch } = useQuery<{
    myContributions: ContributionRecord[];
  }>(GET_MY_CONTRIBUTIONS, { errorPolicy: "all" });
  return {
    contributions: data?.myContributions ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useCampaignActions(campaignId?: string) {
  const refetchQueries = [
    ...CAMPAIGN_QUERIES,
    ...(campaignId
      ? [
          { query: GET_CAMPAIGN, variables: { id: campaignId } },
          { query: GET_CAMPAIGN_CONTRIBUTIONS, variables: { campaignId } },
        ]
      : []),
  ];
  const [create, createState] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: CAMPAIGN_QUERIES,
    onCompleted: () => toast.success("Campaign saved as draft"),
    onError: (err) =>
      toast.error("Could not create campaign", { description: err.message }),
  });
  const [update, updateState] = useMutation(UPDATE_CAMPAIGN, {
    refetchQueries,
    onCompleted: () => toast.success("Campaign updated"),
    onError: (err) =>
      toast.error("Could not update campaign", { description: err.message }),
  });
  const [publish, publishState] = useMutation(PUBLISH_CAMPAIGN, {
    refetchQueries,
    onCompleted: () => toast.success("Campaign published"),
    onError: (err) => toast.error("Could not publish", { description: err.message }),
  });
  const [close, closeState] = useMutation(CLOSE_CAMPAIGN, {
    refetchQueries,
    onCompleted: () => toast.success("Campaign closed"),
    onError: (err) =>
      toast.error("Could not close campaign", { description: err.message }),
  });
  const [record, recordState] = useMutation(RECORD_CONTRIBUTION, {
    refetchQueries,
    onCompleted: () => toast.success("Contribution recorded. No payment was taken."),
    onError: (err) =>
      toast.error("Could not record contribution", { description: err.message }),
  });

  return {
    createCampaign: (input: Record<string, unknown>) => create({ variables: { input } }),
    updateCampaign: (id: string, input: Record<string, unknown>) =>
      update({ variables: { id, input } }),
    publishCampaign: (id: string) => publish({ variables: { id } }),
    closeCampaign: (id: string) => close({ variables: { id } }),
    recordContribution: (id: string, amount: number, anonymous: boolean, note?: string) =>
      record({ variables: { campaignId: id, amount, anonymous, note } }),
    creating: createState.loading,
    updating: updateState.loading,
    publishing: publishState.loading,
    closing: closeState.loading,
    recording: recordState.loading,
  };
}
