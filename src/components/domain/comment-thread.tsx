"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { useAuth } from "@/components/providers/auth-provider";
import { useComments, usePostActions } from "@/hooks/api/use-posts";
import { commentSchema, type CommentFormValues } from "@/lib/validations/social";

export function CommentThread({ postId, communityId }: { postId: string; communityId?: string }) {
  const { user } = useAuth();
  const { comments, loading, error, refetch } = useComments(postId);
  const { addComment, deleteComment, commenting } = usePostActions(communityId, postId);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { body: "" },
  });

  const roots = comments.filter((item) => !item.parentId);
  const replies = (parentId: string) => comments.filter((item) => item.parentId === parentId);

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await addComment(postId, values.body, replyTo ?? undefined);
            form.reset({ body: "" });
            setReplyTo(null);
          })}
          className="frosted-glass-card p-4 space-y-3"
        >
          <FormTextarea
            control={form.control}
            name="body"
            label={replyTo ? "Reply" : "Comment"}
            placeholder={replyTo ? "Write a reply" : "Add a comment"}
          />
          <div className="flex justify-end gap-2">
            {replyTo && (
              <Button type="button" variant="outline" onClick={() => setReplyTo(null)}>
                Cancel reply
              </Button>
            )}
            <Button type="submit" disabled={commenting}>
              {commenting ? "Posting…" : "Post comment"}
            </Button>
          </div>
        </form>
      </Form>

      {loading ? (
        <LoadingState variant="rows" count={3} message="Loading comments..." />
      ) : error ? (
        <ErrorState title="Could not load comments" message={error} onRetry={() => refetch()} />
      ) : roots.length === 0 ? (
        <EmptyState title="No comments yet" description="Be the first to reply to this post." />
      ) : (
        <div className="space-y-3">
          {roots.map((comment) => (
            <div key={comment.id} className="frosted-glass-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{comment.author?.name ?? "Alumni"}</div>
                  <p className="text-sm text-[#c2c2c2] mt-1 whitespace-pre-wrap">{comment.body}</p>
                </div>
                {user?.id === comment.author?.id && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => deleteComment(comment.id)}>
                    Delete
                  </Button>
                )}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setReplyTo(comment.id)}>
                Reply
              </Button>
              {replies(comment.id).map((reply) => (
                <div key={reply.id} className="ml-4 border-l border-[#e5e5e5]/12 pl-4 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{reply.author?.name ?? "Alumni"}</div>
                      <p className="text-sm text-[#c2c2c2] mt-1 whitespace-pre-wrap">{reply.body}</p>
                    </div>
                    {user?.id === reply.author?.id && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => deleteComment(reply.id)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
