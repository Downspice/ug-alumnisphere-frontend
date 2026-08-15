"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CommentThread } from "@/components/domain/comment-thread";
import { PostCard } from "@/components/domain/post-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { buttonVariants } from "@/components/ui/button";
import { usePost } from "@/hooks/api/use-posts";
import { cn } from "@/lib/utils";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const { post, loading, error, refetch } = usePost(params.id);

  if (loading) return <LoadingState variant="rows" count={3} message="Loading post..." />;
  if (error) return <ErrorState title="Post unavailable" message={error} onRetry={() => refetch()} />;
  if (!post) {
    return (
      <EmptyState
        title="Post not found"
        description="It may have been deleted, or you do not have access."
        actionElement={
          <Link href="/feed" className={cn(buttonVariants())}>
            Back to feed
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/feed" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
        Back to feed
      </Link>
      <PostCard post={post} communityId={post.community?.id} />
      <CommentThread postId={post.id} communityId={post.community?.id} />
    </div>
  );
}
