"use client";

import { AdminSubnav } from "@/components/layout/admin-subnav";
import { useAuth } from "@/components/providers/auth-provider";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading)
    return <LoadingState variant="rows" count={2} message="Checking access..." />;
  if (user?.role !== "admin") {
    return (
      <EmptyState
        title="Administrators only"
        description="This desk is limited to administrator accounts."
        actionLabel="Back home"
        onAction={() => router.push("/home")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <AdminSubnav />
      {children}
    </div>
  );
}
