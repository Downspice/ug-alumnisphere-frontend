"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { useConnectionActions, useConnectionStatus } from "@/hooks/api/use-connections";

export function ConnectionActions({
  userId,
  compact = false,
}: {
  userId: string;
  compact?: boolean;
}) {
  const { user } = useAuth();
  const { connection, refetch } = useConnectionStatus(userId);
  const { sendRequest, acceptRequest, declineRequest, removeConnection, sending, deciding, removing } =
    useConnectionActions();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!user || user.id === userId) return null;

  const isIncoming =
    connection?.status === "pending" && connection.addressee?.id === user.id;
  const isOutgoing =
    connection?.status === "pending" && connection.requester?.id === user.id;

  const refresh = async () => {
    await refetch();
  };

  if (connection?.status === "accepted") {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={() => setConfirmOpen(true)}
        >
          Connected
        </Button>
        <ResponsiveModal
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Remove connection"
          description="You will need to send a new request to connect again."
          footer={
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
                Keep
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={removing}
                onClick={async () => {
                  await removeConnection(userId);
                  setConfirmOpen(false);
                  await refresh();
                }}
              >
                {removing ? "Removing…" : "Remove"}
              </Button>
            </div>
          }
        >
          <p className="text-sm text-[#c2c2c2]">
            This only removes the relationship. Existing message history stays, but you cannot start a new thread until you reconnect.
          </p>
        </ResponsiveModal>
      </>
    );
  }

  if (isIncoming && connection) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size={compact ? "sm" : "default"}
          disabled={deciding}
          onClick={async () => {
            await acceptRequest(connection.id);
            await refresh();
          }}
        >
          Accept
        </Button>
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          disabled={deciding}
          onClick={async () => {
            await declineRequest(connection.id);
            await refresh();
          }}
        >
          Decline
        </Button>
      </div>
    );
  }

  if (isOutgoing) {
    return (
      <Button type="button" variant="outline" size={compact ? "sm" : "default"} disabled>
        Request sent
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size={compact ? "sm" : "default"}
      disabled={sending}
      onClick={async () => {
        await sendRequest(userId);
        await refresh();
      }}
    >
      {sending ? "Sending…" : "Connect"}
    </Button>
  );
}
