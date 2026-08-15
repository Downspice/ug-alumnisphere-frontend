"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { GET_ME } from "@/graphql/queries";
import { LOGIN, LOGOUT, REGISTER, UPDATE_MY_PROFILE } from "@/graphql/mutations";
import {
  AuthPayload,
  AuthUser,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "@/lib/api/services/auth.service";
import { toast } from "sonner";

export function useMe(skip = false) {
  const { data, loading, error, refetch } = useQuery<{ me: AuthUser | null }>(GET_ME, {
    skip,
    errorPolicy: "all",
    fetchPolicy: "network-only",
  });

  return {
    user: data?.me ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useLogin() {
  const [mutate, { loading, error }] = useMutation<
    { login: AuthPayload },
    { input: LoginInput }
  >(LOGIN);

  return {
    login: (input: LoginInput) => mutate({ variables: { input } }),
    loading,
    error: error?.message ?? null,
  };
}

export function useRegister() {
  const [mutate, { loading, error }] = useMutation<
    { register: AuthPayload },
    { input: RegisterInput }
  >(REGISTER);

  return {
    register: (input: RegisterInput) => mutate({ variables: { input } }),
    loading,
    error: error?.message ?? null,
  };
}

export function useLogoutMutation() {
  const [mutate] = useMutation<{ logout: boolean }>(LOGOUT);
  return mutate;
}

export function useUpdateMyProfile(onSuccess?: (user: AuthUser) => void) {
  const [mutate, { loading, error }] = useMutation<
    { updateMyProfile: AuthUser },
    { input: UpdateProfileInput }
  >(UPDATE_MY_PROFILE, {
    refetchQueries: [{ query: GET_ME }],
    onCompleted: (data) => {
      if (data?.updateMyProfile) {
        toast.success("Profile updated");
        onSuccess?.(data.updateMyProfile);
      }
    },
    onError: (err) => {
      toast.error("Could not update profile", { description: err.message });
    },
  });

  return {
    updateProfile: (input: UpdateProfileInput) => mutate({ variables: { input } }),
    loading,
    error: error?.message ?? null,
  };
}
