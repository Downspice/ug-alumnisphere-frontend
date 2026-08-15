"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Bookmark, Flag, Heart, MessageCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { usePostActions } from "@/hooks/api/use-posts";
import type { Post } from "@/lib/api/services/social.service";
import { authorizedFileUrl } from "@/lib/api/upload";
import { reportSchema, type ReportFormValues } from "@/lib/validations/social";
import { cn } from "@/lib/utils";

function formatStamp(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostCard({
  post,
  communityId,
  compact = false,
}: {
  post: Post;
  communityId?: string;
  compact?: boolean;
}) {
  const { user } = useAuth();
  const {
    toggleLike,
    toggleSave,
    votePoll,
    deletePost,
    reportContent,
    voting,
    deleting,
    reporting,
  } = usePostActions(communityId, post.id);
  const [reportOpen, setReportOpen] = useState(false);
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: { reason: "" },
  });

  const canDelete =
    user?.id === post.author?.id ||
    user?.role === "admin" ||
    Boolean(communityId && user);

  return (
    <article className="frosted-glass-card p-5 space-y-4 animate-in fade-in duration-500">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#ededed]">
            {post.author?.name ?? "Alumni"}
          </div>
          <div className="text-[11px] text-[#686868]">{formatStamp(post.createdAt)}</div>
        </div>
        <div className="flex items-center gap-2">
          {post.community && !communityId && (
            <Link href={`/communities/${post.community.id}`}>
              <Badge variant="outline">{post.community.name}</Badge>
            </Link>
          )}
          <Badge variant="secondary" className="capitalize">
            {post.type}
          </Badge>
        </div>
      </div>

      {post.body && (
        <p className="text-sm text-[#c2c2c2] leading-relaxed whitespace-pre-wrap">
          {post.body}
        </p>
      )}

      {post.type === "image" && authorizedFileUrl(post.imageUrl) && (
        <img
          src={authorizedFileUrl(post.imageUrl) ?? ""}
          alt={post.body || "Post image"}
          className="w-full max-h-[420px] object-cover rounded-[16px] border border-[#e5e5e5]/12"
        />
      )}

      {post.type === "link" && post.linkUrl && (
        <a
          href={post.linkUrl}
          target="_blank"
          rel="noreferrer"
          className="block rounded-[16px] border border-[#e5e5e5]/12 px-3 py-2 text-xs text-[#ededed] truncate hover:border-[#e5e5e5]/30"
        >
          {post.linkUrl}
        </a>
      )}

      {post.type === "poll" && (
        <div className="space-y-2">
          <div className="text-sm font-medium">{post.pollQuestion}</div>
          {post.pollOptions.map((option, index) => {
            const percent = post.pollTotalVotes
              ? Math.round((option.voteCount / post.pollTotalVotes) * 100)
              : 0;
            const voted = post.myPollVote === index;
            const locked =
              post.pollClosed ||
              (post.myPollVote !== null && post.myPollVote !== undefined);
            return (
              <Button
                key={`${option.text}-${index}`}
                type="button"
                variant={voted ? "default" : "outline"}
                className="w-full justify-between"
                disabled={locked || voting}
                onClick={() => votePoll(post.id, index)}
              >
                <span>{option.text}</span>
                <span className="text-xs">
                  {percent}% · {option.voteCount}
                </span>
              </Button>
            );
          })}
          <p className="text-[11px] text-[#686868]">
            {post.pollClosed
              ? "This poll is closed."
              : post.myPollVote !== null && post.myPollVote !== undefined
                ? `${post.pollTotalVotes} vote${post.pollTotalVotes === 1 ? "" : "s"} · you already voted`
                : `${post.pollTotalVotes} vote${post.pollTotalVotes === 1 ? "" : "s"} · one vote per person`}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleLike(post.id)}
        >
          <Heart className={cn("size-3.5", post.likedByMe && "fill-current")} />
          {post.likeCount}
        </Button>
        <Link
          href={`/feed/${post.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          <MessageCircle className="size-3.5" />
          {post.commentCount}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => toggleSave(post.id)}
        >
          <Bookmark className={cn("size-3.5", post.savedByMe && "fill-current")} />
          {post.savedByMe ? "Saved" : "Save"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setReportOpen(true)}
        >
          <Flag className="size-3.5" />
          Report
        </Button>
        {canDelete && user?.id === post.author?.id && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={deleting}
            onClick={() => deletePost(post.id)}
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        )}
        {compact && (
          <Link
            href={`/feed/${post.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "ml-auto")}
          >
            Open
          </Link>
        )}
      </div>

      <ResponsiveModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        title="Report this post"
        description="Reports go to administrators. Explain what is wrong."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await reportContent("post", post.id, values.reason);
              setReportOpen(false);
              form.reset({ reason: "" });
            })}
            className="space-y-4"
          >
            <FormTextarea control={form.control} name="reason" label="Reason" />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setReportOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={reporting}>
                {reporting ? "Sending…" : "Submit report"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </article>
  );
}
