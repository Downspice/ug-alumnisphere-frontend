"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useAuth } from "@/components/providers/auth-provider";
import { useConversations } from "@/hooks/api/use-messaging";
import { searchSchema, type SearchFormValues } from "@/lib/validations/social";

export default function MessagesPage() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Messages</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Async direct messages with people you are connected to. Threads refresh
          automatically — no live sockets.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => setSearch(values.query?.trim() ?? ""))}
          className="frosted-glass-card p-4 flex flex-col sm:flex-row gap-3"
        >
          <FormInput
            control={form.control}
            name="query"
            label="Search"
            placeholder="Name or recent message"
            containerClassName="flex-1"
          />
          <Button type="submit" variant="outline" className="sm:self-end">
            Search
          </Button>
        </form>
      </Form>

      {loading ? (
        <LoadingState variant="rows" count={4} message="Loading conversations..." />
      ) : error ? (
        <ErrorState
          title="Could not load messages"
          message={error}
          onRetry={() => refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          title="No conversations yet"
          description="Connect with someone in the directory, then open their profile and choose Message."
        />
      ) : (
        <div className="space-y-3">
          {rows.map(({ conversation, other }) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="frosted-glass-card p-4 flex items-center justify-between gap-3 hover:border-[#e5e5e5]/30 transition-colors"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">{other?.name ?? "Conversation"}</div>
                <p className="text-xs text-[#c2c2c2] truncate">
                  {conversation.lastMessagePreview || "No messages yet"}
                </p>
              </div>
              {conversation.unreadCount > 0 && (
                <Badge className="rounded-full">{conversation.unreadCount}</Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
