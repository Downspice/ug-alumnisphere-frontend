"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { GET_COMMENTS, GET_FEED, GET_POST, GET_SAVED_POSTS } from "@/graphql/queries";
import {
  ADD_COMMENT,
  CREATE_POST,
  DELETE_COMMENT,
  DELETE_POST,
  REPORT_CONTENT,
  TOGGLE_LIKE,
  TOGGLE_SAVE_POST,
  VOTE_POLL,
} from "@/graphql/mutations";
import type {
  CreatePostInput,
  Post,
  PostComment,
} from "@/lib/api/services/social.service";
import { toast } from "sonner";

function postQueries(communityId?: string, postId?: string) {
  return [
    { query: GET_FEED, variables: { communityId: communityId || undefined } },
    { query: GET_FEED },
    { query: GET_SAVED_POSTS },
    ...(postId
      ? [
          { query: GET_POST, variables: { id: postId } },
          { query: GET_COMMENTS, variables: { postId } },
        ]
      : []),
  ];
}

export function useFeed(communityId?: string) {
  const { data, loading, error, refetch } = useQuery<{ feed: Post[] }>(GET_FEED, {
    variables: { communityId: communityId || undefined },
    pollInterval: 15000,
    errorPolicy: "all",
  });
  return {
    posts: data?.feed ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function usePost(id?: string) {
  const { data, loading, error, refetch } = useQuery<{ post: Post | null }>(GET_POST, {
    variables: { id },
    skip: !id,
    errorPolicy: "all",
  });
  return {
    post: data?.post ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useComments(postId?: string) {
  const { data, loading, error, refetch } = useQuery<{ comments: PostComment[] }>(
    GET_COMMENTS,
    {
      variables: { postId },
      skip: !postId,
      errorPolicy: "all",
    }
  );
  return {
    comments: data?.comments ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useSavedPosts() {
  const { data, loading, error, refetch } = useQuery<{ savedPosts: Post[] }>(
    GET_SAVED_POSTS,
    {
      errorPolicy: "all",
    }
  );
  return {
    posts: data?.savedPosts ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function usePostActions(communityId?: string, postId?: string) {
  const refetchQueries = postQueries(communityId, postId);
  const [create, createState] = useMutation(CREATE_POST, {
    refetchQueries,
    onCompleted: () => toast.success("Post published"),
    onError: (err) => toast.error("Could not publish", { description: err.message }),
  });
  const [remove, removeState] = useMutation(DELETE_POST, {
    refetchQueries,
    onCompleted: () => toast.success("Post deleted"),
    onError: (err) => toast.error("Could not delete post", { description: err.message }),
  });
  const [like] = useMutation(TOGGLE_LIKE, {
    refetchQueries,
    onError: (err) => toast.error("Could not update like", { description: err.message }),
  });
  const [comment, commentState] = useMutation(ADD_COMMENT, {
    refetchQueries,
    onCompleted: () => toast.success("Comment added"),
    onError: (err) => toast.error("Could not comment", { description: err.message }),
  });
  const [removeComment] = useMutation(DELETE_COMMENT, {
    refetchQueries,
    onCompleted: () => toast.success("Comment deleted"),
    onError: (err) =>
      toast.error("Could not delete comment", { description: err.message }),
  });
  const [save] = useMutation(TOGGLE_SAVE_POST, {
    refetchQueries,
    onError: (err) => toast.error("Could not save post", { description: err.message }),
  });
  const [report, reportState] = useMutation(REPORT_CONTENT, {
    onCompleted: () => toast.success("Report submitted"),
    onError: (err) => toast.error("Could not report", { description: err.message }),
  });
  const [vote, voteState] = useMutation(VOTE_POLL, {
    refetchQueries,
    onCompleted: () => toast.success("Vote recorded"),
    onError: (err) => toast.error("Could not vote", { description: err.message }),
  });

  return {
    createPost: (input: CreatePostInput) => create({ variables: { input } }),
    deletePost: (id: string) => remove({ variables: { id } }),
    toggleLike: (id: string) => like({ variables: { postId: id } }),
    addComment: (id: string, body: string, parentId?: string) =>
      comment({ variables: { postId: id, body, parentId } }),
    deleteComment: (id: string) => removeComment({ variables: { id } }),
    toggleSave: (id: string) => save({ variables: { postId: id } }),
    reportContent: (targetType: "post" | "comment", targetId: string, reason: string) =>
      report({ variables: { targetType, targetId, reason } }),
    votePoll: (id: string, optionIndex: number) =>
      vote({ variables: { postId: id, optionIndex } }),
    creating: createState.loading,
    deleting: removeState.loading,
    commenting: commentState.loading,
    reporting: reportState.loading,
    voting: voteState.loading,
  };
}
