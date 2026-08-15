"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  GET_CONNECTION_STATUS,
  GET_MY_CONNECTIONS,
  GET_PENDING_CONNECTIONS,
  GET_SENT_CONNECTIONS,
  GET_SUGGESTED_CONNECTIONS,
} from "@/graphql/queries";
import {
  ACCEPT_CONNECTION_REQUEST,
  DECLINE_CONNECTION_REQUEST,
  REMOVE_CONNECTION,
  SEND_CONNECTION_REQUEST,
} from "@/graphql/mutations";
import type { ConnectionRecord, SuggestedConnection } from "@/lib/api/services/network.service";
import { toast } from "sonner";

const CONNECTION_QUERIES = [
  { query: GET_MY_CONNECTIONS },
  { query: GET_PENDING_CONNECTIONS },
  { query: GET_SENT_CONNECTIONS },
  { query: GET_SUGGESTED_CONNECTIONS },
];

export function useMyConnections() {
  const { data, loading, error, refetch } = useQuery<{ myConnections: ConnectionRecord[] }>(
    GET_MY_CONNECTIONS,
    { errorPolicy: "all" }
  );
  return {
    connections: data?.myConnections ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function usePendingConnections() {
  const { data, loading, error, refetch } = useQuery<{
    pendingConnectionRequests: ConnectionRecord[];
  }>(GET_PENDING_CONNECTIONS, { errorPolicy: "all" });
  return {
    requests: data?.pendingConnectionRequests ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useSentConnections() {
  const { data, loading, error, refetch } = useQuery<{
    sentConnectionRequests: ConnectionRecord[];
  }>(GET_SENT_CONNECTIONS, { errorPolicy: "all" });
  return {
    requests: data?.sentConnectionRequests ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useSuggestedConnections() {
  const { data, loading, error, refetch } = useQuery<{
    suggestedConnections: SuggestedConnection[];
  }>(GET_SUGGESTED_CONNECTIONS, { errorPolicy: "all" });
  return {
    suggestions: data?.suggestedConnections ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useConnectionStatus(userId?: string) {
  const { data, loading, refetch } = useQuery<{ connectionStatus: ConnectionRecord | null }>(
    GET_CONNECTION_STATUS,
    {
      variables: { userId },
      skip: !userId,
      errorPolicy: "all",
    }
  );
  return {
    connection: data?.connectionStatus ?? null,
    loading,
    refetch,
  };
}

export function useConnectionActions() {
  const [send, sendState] = useMutation(SEND_CONNECTION_REQUEST, {
    refetchQueries: CONNECTION_QUERIES,
    onCompleted: () => toast.success("Connection request sent"),
    onError: (err) => toast.error("Could not send request", { description: err.message }),
  });
  const [accept, acceptState] = useMutation(ACCEPT_CONNECTION_REQUEST, {
    refetchQueries: CONNECTION_QUERIES,
    onCompleted: () => toast.success("Connection accepted"),
    onError: (err) => toast.error("Could not accept request", { description: err.message }),
  });
  const [decline, declineState] = useMutation(DECLINE_CONNECTION_REQUEST, {
    refetchQueries: CONNECTION_QUERIES,
    onCompleted: () => toast.success("Request declined"),
    onError: (err) => toast.error("Could not decline request", { description: err.message }),
  });
  const [remove, removeState] = useMutation(REMOVE_CONNECTION, {
    refetchQueries: CONNECTION_QUERIES,
    onCompleted: () => toast.success("Connection removed"),
    onError: (err) => toast.error("Could not remove connection", { description: err.message }),
  });

  return {
    sendRequest: (userId: string) => send({ variables: { userId } }),
    acceptRequest: (id: string) => accept({ variables: { id } }),
    declineRequest: (id: string) => decline({ variables: { id } }),
    removeConnection: (userId: string) => remove({ variables: { userId } }),
    sending: sendState.loading,
    deciding: acceptState.loading || declineState.loading,
    removing: removeState.loading,
  };
}
