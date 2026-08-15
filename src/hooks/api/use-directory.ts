"use client";

import { useQuery } from "@apollo/client/react";
import { GET_ALUMNI_DIRECTORY, GET_PUBLIC_PROFILE } from "@/graphql/queries";
import type {
  DirectoryFilter,
  DirectoryPage,
  DirectorySort,
  DirectoryUser,
} from "@/lib/api/services/network.service";

export function useAlumniDirectory(options: {
  filter?: DirectoryFilter;
  sort?: DirectorySort;
  page?: number;
  pageSize?: number;
}) {
  const { data, loading, error, refetch } = useQuery<{ alumniDirectory: DirectoryPage }>(
    GET_ALUMNI_DIRECTORY,
    {
      variables: {
        filter: options.filter,
        sort: options.sort ?? "RECENT",
        page: options.page ?? 1,
        pageSize: options.pageSize ?? 12,
      },
      errorPolicy: "all",
    }
  );

  return {
    page: data?.alumniDirectory ?? null,
    items: data?.alumniDirectory?.items ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function usePublicProfile(id: string) {
  const { data, loading, error, refetch } = useQuery<{ publicProfile: DirectoryUser | null }>(
    GET_PUBLIC_PROFILE,
    {
      variables: { id },
      skip: !id,
      errorPolicy: "all",
    }
  );

  return {
    profile: data?.publicProfile ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}
