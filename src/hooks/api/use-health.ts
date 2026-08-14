"use client";

import { useQuery } from "@apollo/client/react";
import { GET_HEALTH } from "@/graphql/queries";
import { HealthStatus } from "@/lib/api/services/health.service";

/**
 * Hook to poll GraphQL service health status
 */
export function useHealth(pollInterval: number = 10000) {
  const { data, loading, error, refetch } = useQuery<{ health: HealthStatus }>(
    GET_HEALTH,
    {
      pollInterval,
      errorPolicy: "all",
    }
  );

  const isConnected = !!data?.health && data.health.status === "OK";

  return {
    health: data?.health ?? null,
    loading,
    error: error?.message ?? null,
    isConnected,
    refetch,
  };
}
