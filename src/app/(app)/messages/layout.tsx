"use client";

import { usePathname } from "next/navigation";
import { ConversationList } from "@/components/domain/conversation-list";
import { cn } from "@/lib/utils";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeId = pathname.startsWith("/messages/") ? pathname.split("/")[2] : undefined;
  const inThread = Boolean(activeId);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className={cn(inThread && "hidden md:block")}>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#ba8f4a]">Inbox</p>
        <h1 className="text-3xl font-medium tracking-tight">Messages</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Direct notes with people you are connected to. Threads refresh on their own —
          this is not a live socket chat.
        </p>
      </div>

      <div className="frosted-glass-card min-h-0 flex-1 overflow-hidden grid md:grid-cols-[minmax(280px,34%)_1fr]">
        <aside
          className={cn(
            "min-h-0 border-[#e5e5e5]/10 md:border-r",
            inThread ? "hidden md:flex md:flex-col" : "flex flex-col"
          )}
        >
          <ConversationList activeId={activeId} />
        </aside>
        <section
          className={cn(
            "min-h-0 h-full",
            inThread ? "flex flex-col" : "hidden md:flex md:flex-col"
          )}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
