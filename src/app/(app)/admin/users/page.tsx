"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useAdminActions } from "@/hooks/api/use-admin";
import { useUsers } from "@/hooks/api/use-users";

export default function AdminUsersPage() {
  const { users, loading, error, refetch } = useUsers();
  const { setUserAccountStatus, updatingUser } = useAdminActions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Users</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Suspend or restore accounts. You cannot change your own status from here.
        </p>
      </div>
      {loading ? (
        <LoadingState variant="rows" count={5} message="Loading users..." />
      ) : error ? (
        <ErrorState
          title="Could not load users"
          message={error}
          onRetry={() => refetch()}
        />
      ) : users.length === 0 ? (
        <EmptyState title="No users" description="The user collection is empty." />
      ) : (
        <div className="space-y-3">
          {users.map((person) => (
            <article
              key={person.id}
              className="frosted-glass-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <div className="text-sm font-medium">{person.name}</div>
                <div className="text-xs text-[#c2c2c2]">
                  {person.email} · {person.role}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {person.accountStatus ?? "active"}
                </Badge>
                {person.accountStatus === "suspended" ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={updatingUser}
                    onClick={() => setUserAccountStatus(person.id, "active")}
                  >
                    Restore
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={updatingUser}
                    onClick={() => setUserAccountStatus(person.id, "suspended")}
                  >
                    Suspend
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
