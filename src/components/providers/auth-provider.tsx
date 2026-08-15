"use client";

import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, LoginInput, RegisterInput } from "@/lib/api/services/auth.service";
import { clearAccessToken, setAccessToken, useAccessToken } from "@/lib/auth/session";
import { useLogin, useLogoutMutation, useMe, useRegister } from "@/hooks/api/use-auth";
import { toast } from "sonner";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<boolean>;
  register: (input: RegisterInput) => Promise<boolean>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAccessToken();
  const hasToken = Boolean(token);
  const { user, loading, refetch } = useMe(!hasToken);
  const { login: loginMutation, loading: loginLoading } = useLogin();
  const { register: registerMutation, loading: registerLoading } = useRegister();
  const logoutMutation = useLogoutMutation();

  const persistSession = useCallback((tokenValue: string) => {
    setAccessToken(tokenValue);
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      try {
        const result = await loginMutation(input);
        const payload = result.data?.login;
        if (!payload) return false;
        persistSession(payload.token);
        await refetch();
        toast.success("Welcome back", { description: payload.user.name });
        router.push("/home");
        return true;
      } catch (error) {
        toast.error("Sign in failed", {
          description: error instanceof Error ? error.message : "Check your credentials.",
        });
        return false;
      }
    },
    [loginMutation, persistSession, refetch, router]
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const result = await registerMutation(input);
        const payload = result.data?.register;
        if (!payload) return false;
        persistSession(payload.token);
        await refetch();
        toast.success("Account created", { description: "Your AlumniSphere workspace is ready." });
        router.push("/home");
        return true;
      } catch (error) {
        toast.error("Registration failed", {
          description: error instanceof Error ? error.message : "Try a different email.",
        });
        return false;
      }
    },
    [persistSession, refetch, registerMutation, router]
  );

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch {
      // Client session is cleared regardless of server response.
    }
    clearAccessToken();
    toast.success("Signed out");
    router.push("/login");
  }, [logoutMutation, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: (hasToken && loading) || loginLoading || registerLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refetchUser: refetch,
    }),
    [hasToken, loading, login, loginLoading, logout, refetch, register, registerLoading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
