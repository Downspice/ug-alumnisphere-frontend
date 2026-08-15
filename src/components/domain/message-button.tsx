"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMessagingActions } from "@/hooks/api/use-messaging";
import { useConnectionStatus } from "@/hooks/api/use-connections";
import { useAuth } from "@/components/providers/auth-provider";

export function MessageButton({
  userId,
  compact = false,
}: {
  userId: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { connection } = useConnectionStatus(userId);
  const { startConversation, starting } = useMessagingActions();

  if (!user || user.id === userId || connection?.status !== "accepted") return null;

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "sm" : "default"}
      disabled={starting}
      onClick={async () => {
        const conversation = await startConversation(userId);
        if (conversation) router.push(`/messages/${conversation.id}`);
      }}
    >
      {starting ? "Opening…" : "Message"}
    </Button>
  );
}
