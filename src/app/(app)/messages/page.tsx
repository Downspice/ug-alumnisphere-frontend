"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  return (
    <div className="flex h-full min-h-0 items-center justify-center p-6">
      <EmptyState
        compact
        icon={MessageCircle}
        title="Choose a conversation"
        description="Pick someone from the list, or find a connection in the directory and send the first note."
        actionElement={
          <Link href="/directory" className={cn(buttonVariants({ size: "sm" }))}>
            Browse directory
          </Link>
        }
      />
    </div>
  );
}
