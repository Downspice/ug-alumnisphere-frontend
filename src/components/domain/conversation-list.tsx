"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { UserAvatar } from "@/components/domain/user-avatar";
import { VerifiedMark } from "@/components/domain/verified-mark";
import { useAuth } from "@/components/providers/auth-provider";
import { useConversations } from "@/hooks/api/use-messaging";
import { searchSchema, type SearchFormValues } from "@/lib/validations/social";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ConversationList({ activeId }: { activeId?: string }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const { conversations, loading, error, refetch } = useConversations(search);
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const rows = useMemo(
    () =>
      conversations.map((conversation) => {
        const other = conversation.participants.find((person) => person.id !== user?.id);
        return { conversation, other };
      }),
    [conversations, user?.id]
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => setSearch(values.query?.trim() ?? ""))}
          className="shrink-0 border-b border-[#e5e5e5]/10 p-3 flex gap-2"
        >
          <FormInput
            control={form.control}
            name="query"
            label="Search"
            placeholder="Name or recent message"
            containerClassName="flex-1"
            leftIcon={<Search />}
          />
          <Button type="submit" variant="outline" className="self-end">
            Search
          </Button>
        </form>
      </Form>

      <div className="min-h-0 flex-1 overflow-y-auto p-2 space-y-1">
        {loading ? (
          <LoadingState variant="rows" count={5} message="Loading conversations..." />
        ) : error ? (
          <ErrorState
            title="Could not load messages"
            message={error}
            onRetry={() => refetch()}
            compact
          />
        ) : rows.length === 0 ? (
          <EmptyState
            compact
            title="No conversations yet"
            description="Connect with someone in the directory, then open their profile and choose Message."
            actionElement={
              <Link href="/directory" className={cn(buttonVariants({ size: "sm" }))}>
                Open directory
              </Link>
            }
          />
        ) : (
          rows.map(({ conversation, other }, index) => {
            const active = conversation.id === activeId;
            const unread = conversation.unreadCount > 0;
            const subtitle =
              other?.headline ||
              [other?.jobTitle, other?.company].filter(Boolean).join(" · ") ||
              other?.programme ||
              "University of Ghana";

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-[18px] px-3 py-2.5 transition-colors animate-in fade-in slide-in-from-left-2 duration-500 fill-mode-both",
                  active
                    ? "bg-white/[0.07] border border-[#ba8f4a]/30"
                    : "border border-transparent hover:bg-white/[0.04]",
                  unread && !active && "bg-white/[0.03]"
                )}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="relative shrink-0">
                  <UserAvatar name={other?.name} avatarUrl={other?.avatarUrl} />
                  {unread && (
                    <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#ba8f4a] shadow-[0_0_8px_rgba(186,143,74,0.7)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm truncate inline-flex items-center gap-1 min-w-0",
                        unread ? "text-white font-medium" : "text-[#ededed]"
                      )}
                    >
                      <span className="truncate">{other?.name ?? "Conversation"}</span>
                      {other?.verificationStatus === "verified" && (
                        <VerifiedMark size="sm" />
                      )}
                    </p>
                    <span className="text-[11px] text-[#686868] shrink-0">
                      {formatRelativeTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#686868] truncate">{subtitle}</p>
                  <p
                    className={cn(
                      "text-xs truncate mt-0.5",
                      unread ? "text-[#ededed]" : "text-[#c2c2c2]"
                    )}
                  >
                    {conversation.lastMessagePreview || "No messages yet"}
                  </p>
                </div>
                {unread && (
                  <Badge className="rounded-full bg-white text-[#161616] border-transparent min-w-5 justify-center px-1.5">
                    {conversation.unreadCount}
                  </Badge>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
