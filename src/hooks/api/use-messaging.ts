"use client";

import { useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_CONVERSATION, GET_CONVERSATIONS, GET_MESSAGES } from "@/graphql/queries";
import { MARK_CONVERSATION_READ, SEND_MESSAGE, START_CONVERSATION } from "@/graphql/mutations";
import type { ChatMessage, Conversation } from "@/lib/api/services/social.service";
import { toast } from "sonner";

const CONVERSATION_QUERIES = [{ query: GET_CONVERSATIONS }];

export function useConversations(search?: string) {
  const { data, loading, error, refetch } = useQuery<{ conversations: Conversation[] }>(
    GET_CONVERSATIONS,
    {
      variables: { search: search || undefined },
      pollInterval: 10000,
      errorPolicy: "all",
    }
  );
  return {
    conversations: data?.conversations ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useConversation(id?: string) {
  const { data, loading, error, refetch } = useQuery<{ conversation: Conversation | null }>(
    GET_CONVERSATION,
    {
      variables: { id },
      skip: !id,
      pollInterval: 10000,
      errorPolicy: "all",
    }
  );
  return {
    conversation: data?.conversation ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useMessages(conversationId?: string) {
  const { data, loading, error, refetch } = useQuery<{ messages: ChatMessage[] }>(GET_MESSAGES, {
    variables: { conversationId },
    skip: !conversationId,
    pollInterval: 8000,
    errorPolicy: "all",
  });
  return {
    messages: data?.messages ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useMessagingActions() {
  const [start, startState] = useMutation<{ startConversation: Conversation }>(START_CONVERSATION, {
    refetchQueries: CONVERSATION_QUERIES,
    onError: (err) => toast.error("Could not open conversation", { description: err.message }),
  });
  const [send, sendState] = useMutation(SEND_MESSAGE, {
    refetchQueries: CONVERSATION_QUERIES,
    onError: (err) => toast.error("Could not send message", { description: err.message }),
  });
  const [markRead] = useMutation(MARK_CONVERSATION_READ, {
    refetchQueries: CONVERSATION_QUERIES,
  });

  return {
    startConversation: async (userId: string) => {
      const result = await start({ variables: { userId } });
      return result.data?.startConversation ?? null;
    },
    sendMessage: (conversationId: string, body: string) =>
      send({
        variables: { conversationId, body },
        refetchQueries: [...CONVERSATION_QUERIES, { query: GET_MESSAGES, variables: { conversationId } }],
      }),
    markRead: useCallback(
      (conversationId: string) => markRead({ variables: { conversationId } }),
      [markRead]
    ),
    starting: startState.loading,
    sending: sendState.loading,
  };
}
