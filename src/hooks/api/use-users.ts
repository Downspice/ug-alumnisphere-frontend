"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_USERS } from "@/graphql/queries";
import { CREATE_USER } from "@/graphql/mutations";
import { User, CreateUserInput } from "@/lib/api/services/users.service";
import { toast } from "sonner";

/**
 * Hook to fetch all users
 */
export function useUsers() {
  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(GET_USERS, {
    errorPolicy: "all",
  });

  return {
    users: data?.users ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
    count: data?.users?.length ?? 0,
  };
}

/**
 * Hook to create a new user with automatic toast feedback and cache update
 */
export function useCreateUser(onSuccess?: (user: User) => void) {
  const [createUserMutation, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    onCompleted: (data) => {
      if (data?.createUser) {
        toast.success("User Created", {
          description: `${data.createUser.name} (${data.createUser.role}) has been added.`,
        });
        onSuccess?.(data.createUser);
      }
    },
    onError: (err) => {
      toast.error("Failed to create user", {
        description: err.message,
      });
    },
  });

  const createUser = async (input: CreateUserInput) => {
    return createUserMutation({
      variables: { input },
    });
  };

  return {
    createUser,
    loading,
    error: error?.message ?? null,
  };
}
