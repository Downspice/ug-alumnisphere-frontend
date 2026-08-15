"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { GET_NOTIFICATIONS, GET_UNREAD_COUNT } from "@/graphql/queries";
import { MARK_ALL_NOTIFICATIONS_READ, MARK_NOTIFICATION_READ } from "@/graphql/mutations";
import type { AppNotification } from "@/lib/api/services/giving.service";
import { toast } from "sonner";

export function useNotifications() {
  const { data, loading, error, refetch } = useQuery<{
    notifications: AppNotification[];
  }>(GET_NOTIFICATIONS, { pollInterval: 15000, errorPolicy: "all" });
  return {
    notifications: data?.notifications ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useUnreadCount() {
  const { data, refetch } = useQuery<{ unreadNotificationCount: number }>(
    GET_UNREAD_COUNT,
    {
      pollInterval: 15000,
      errorPolicy: "all",
    }
  );
  return { count: data?.unreadNotificationCount ?? 0, refetch };
}

export function useNotificationActions() {
  const refetchQueries = [{ query: GET_NOTIFICATIONS }, { query: GET_UNREAD_COUNT }];
  const [markOne] = useMutation(MARK_NOTIFICATION_READ, {
    refetchQueries,
    onError: (err) => toast.error("Could not mark as read", { description: err.message }),
  });
  const [markAll, allState] = useMutation(MARK_ALL_NOTIFICATIONS_READ, {
    refetchQueries,
    onCompleted: () => toast.success("All notifications marked read"),
    onError: (err) =>
      toast.error("Could not update notifications", { description: err.message }),
  });
  return {
    markRead: (id: string) => markOne({ variables: { id } }),
    markAllRead: () => markAll(),
    markingAll: allState.loading,
  };
}
