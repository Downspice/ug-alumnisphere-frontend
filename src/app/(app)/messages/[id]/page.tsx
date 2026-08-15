"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useConversation,
  useMessages,
  useMessagingActions,
} from "@/hooks/api/use-messaging";
import { messageSchema, type MessageFormValues } from "@/lib/validations/social";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    if (params.id) void markRead(params.id);
  }, [params.id, markRead]);

  const other = conversationQuery.conversation?.participants.find(
    (person) => person.id !== user?.id
  );

  if (conversationQuery.loading) {
    return <LoadingState variant="rows" count={4} message="Opening conversation..." />;
  }
  if (conversationQuery.error) {
    return (
      <ErrorState
        title="Conversation unavailable"
        message={conversationQuery.error}
        onRetry={() => conversationQuery.refetch()}
      />
    );
  }
  if (!conversationQuery.conversation) {
    return (
      <EmptyState
        title="Conversation not found"
        description="You can only open threads you participate in."
        actionElement={
          <Link href="/messages" className={cn(buttonVariants())}>
            Back to messages
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">
            {other?.name ?? "Conversation"}
          </h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Messages refresh every few seconds. This is not a live chat.
          </p>
        </div>
        <Link
          href="/messages"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          All messages
        </Link>
      </div>

      {messagesQuery.loading ? (
        <LoadingState variant="rows" count={4} message="Loading messages..." />
      ) : messagesQuery.error ? (
        <ErrorState
          title="Could not load messages"
          message={messagesQuery.error}
          onRetry={() => messagesQuery.refetch()}
        />
      ) : messagesQuery.messages.length === 0 ? (
        <EmptyState
          title="No messages yet"
          description="Send the first note in this thread."
        />
      ) : (
        <div className="space-y-3">
          {messagesQuery.messages.map((message) => {
            const mine = message.sender.id === user?.id;
            return (
              <div
                key={message.id}
                className={cn("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-[20px] px-4 py-3 text-sm",
                    mine
                      ? "bg-white text-[#161616]"
                      : "bg-[#161616] border border-[#e5e5e5]/12 text-[#ededed]"
                  )}
                >
                  <div className="text-[11px] opacity-70 mb-1">{message.sender.name}</div>
                  <p className="whitespace-pre-wrap">{message.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await sendMessage(params.id, values.body);
            form.reset({ body: "" });
          })}
          className="frosted-glass-card p-4 space-y-3"
        >
          <FormTextarea
            control={form.control}
            name="body"
            label="Message"
            placeholder="Write a message"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
