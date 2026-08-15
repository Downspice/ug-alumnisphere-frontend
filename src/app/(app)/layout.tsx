"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { LoadingState } from "@/components/ui/loading-state";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-16">
        <LoadingState message="Restoring your session..." variant="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] px-4 py-16">
        <LoadingState message="Redirecting to sign in..." variant="spinner" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
