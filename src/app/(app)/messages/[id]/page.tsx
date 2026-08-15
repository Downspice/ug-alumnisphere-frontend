"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { UserAvatar } from "@/components/domain/user-avatar";
import { VerifiedMark } from "@/components/domain/verified-mark";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useConversation,
  useMessages,
  useMessagingActions,
} from "@/hooks/api/use-messaging";
import { messageSchema, type MessageFormValues } from "@/lib/validations/social";
import { formatDayLabel, formatMessageTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/api/services/social.service";

type ThreadItem =
  { kind: "day"; id: string; label: string } | { kind: "message"; message: ChatMessage };

function buildThread(messages: ChatMessage[]): ThreadItem[] {
  const items: ThreadItem[] = [];
  let lastDay = "";
  for (const message of messages) {
    const day = formatDayLabel(message.createdAt);
    if (day && day !== lastDay) {
      items.push({ kind: "day", id: `day-${message.createdAt}`, label: day });
      lastDay = day;
    }
    items.push({ kind: "message", message });
  }
  return items;
}

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const conversationQuery = useConversation(params.id);
  const messagesQuery = useMessages(params.id);
  const { sendMessage, markRead, sending } = useMessagingActions();
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { body: "" },
  });
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) void markRead(params.id);
  }, [params.id, markRead]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messagesQuery.messages.length]);

  const other = conversationQuery.conversation?.participants.find(
    (person) => person.id !== user?.id
  );
  const thread = useMemo(
    () => buildThread(messagesQuery.messages),
    [messagesQuery.messages]
  );
  const subtitle =
    other?.headline ||
    [other?.jobTitle, other?.company].filter(Boolean).join(" · ") ||
    [other?.programme, other?.graduationYear ? `Class of ${other.graduationYear}` : null]
      .filter(Boolean)
      .join(" · ") ||
    "University of Ghana";

  async function onSend(values: MessageFormValues) {
    await sendMessage(params.id, values.body);
    form.reset({ body: "" });
  }

  if (conversationQuery.loading) {
    return (
      <div className="p-4">
        <LoadingState variant="rows" count={4} message="Opening conversation..." />
      </div>
    );
  }
  if (conversationQuery.error) {
    return (
      <div className="p-4">
        <ErrorState
          title="Conversation unavailable"
          message={conversationQuery.error}
          onRetry={() => conversationQuery.refetch()}
          compact
        />
      </div>
    );
  }
  if (!conversationQuery.conversation) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <EmptyState
          compact
          title="Conversation not found"
          description="You can only open threads you participate in."
          actionElement={
            <Link href="/messages" className={cn(buttonVariants({ size: "sm" }))}>
              Back to messages
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 flex items-center gap-3 px-3 sm:px-4 py-3 border-b border-[#e5e5e5]/10">
        <Link
          href="/messages"
          aria-label="All messages"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "md:hidden"
          )}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <UserAvatar name={other?.name} avatarUrl={other?.avatarUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-medium truncate">
              {other?.name ?? "Conversation"}
            </p>
            {other?.verificationStatus === "verified" && <VerifiedMark size="sm" />}
          </div>
          <p className="text-xs text-[#686868] truncate">{subtitle}</p>
        </div>
        {other && (
          <Link
            href={`/directory/${other.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View profile
          </Link>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 sm:px-5 py-4 space-y-3">
        {messagesQuery.loading ? (
          <LoadingState variant="rows" count={4} message="Loading messages..." />
        ) : messagesQuery.error ? (
          <ErrorState
            title="Could not load messages"
            message={messagesQuery.error}
            onRetry={() => messagesQuery.refetch()}
            compact
          />
        ) : thread.length === 0 ? (
          <div className="h-full min-h-[220px] flex items-center justify-center">
            <EmptyState
              compact
              title="No messages yet"
              description={`Send the first note to ${other?.name ?? "this connection"}. Threads refresh every few seconds.`}
            />
          </div>
        ) : (
          thread.map((item) => {
            if (item.kind === "day") {
              return (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-[#e5e5e5]/10" />
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#686868]">
                    {item.label}
                  </span>
                  <div className="h-px flex-1 bg-[#e5e5e5]/10" />
                </div>
              );
            }

            const mine = item.message.sender.id === user?.id;
            return (
              <div
                key={item.message.id}
                className={cn(
                  "flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both",
                  mine ? "justify-end" : "justify-start"
                )}
              >
                {!mine && (
                  <UserAvatar
                    name={item.message.sender.name}
                    avatarUrl={item.message.sender.avatarUrl}
                    size="sm"
                    className="mb-0.5"
                  />
                )}
                <div
                  className={cn(
                    "max-w-[78%] rounded-[20px] px-4 py-2.5 text-sm",
                    mine
                      ? "bg-white text-[#161616] rounded-br-[8px]"
                      : "bg-[#161616] border border-[#e5e5e5]/12 text-[#ededed] rounded-bl-[8px]"
                  )}
                >
                  {!mine && (
                    <div className="text-[11px] text-[#ba8f4a] mb-1">
                      {item.message.sender.name}
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {item.message.body}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] mt-1.5",
                      mine ? "text-[#686868] text-right" : "text-[#686868]"
                    )}
                  >
                    {formatMessageTime(item.message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSend)}
          className="shrink-0 border-t border-[#e5e5e5]/10 p-3 sm:p-4"
        >
          <div className="flex items-end gap-2">
            <FormTextarea
              control={form.control}
              name="body"
              aria-label="Message"
              placeholder={`Write to ${other?.name ?? "this connection"}…`}
              rows={2}
              disabled={sending}
              containerClassName="flex-1"
              className="min-h-[52px] max-h-32 resize-none"
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void form.handleSubmit(onSend)();
                }
              }}
            />
            <Button
              type="submit"
              size="icon-lg"
              disabled={sending}
              aria-label={sending ? "Sending" : "Send message"}
              className="mb-0.5"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="text-[11px] text-[#686868] mt-2">
            Enter to send · Shift + Enter for a new line · Refreshes every few seconds
          </p>
        </form>
      </Form>
    </div>
  );
}
