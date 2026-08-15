"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComposePost } from "@/components/domain/compose-post";
import { PostCard } from "@/components/domain/post-card";
import { AlumniCard } from "@/components/domain/alumni-card";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useCommunity,
  useCommunityActions,
  useCommunityJoinRequests,
  useCommunityMembers,
} from "@/hooks/api/use-communities";
import { useFeed } from "@/hooks/api/use-posts";

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { community, loading, error, refetch } = useCommunity(params.id);
  const members = useCommunityMembers(params.id);
  const isMod =
    community?.myRole === "owner" ||
    community?.myRole === "moderator" ||
    user?.role === "admin";
  const requests = useCommunityJoinRequests(params.id, !isMod);
  const feed = useFeed(params.id);
  const {
    joinCommunity,
    leaveCommunity,
    reviewJoinRequest,
    assignModerator,
    joining,
    leaving,
    reviewing,
    assigning,
  } = useCommunityActions(params.id);
  const [leaveOpen, setLeaveOpen] = useState(false);

  if (loading)
    return <LoadingState variant="rows" count={3} message="Loading community..." />;
  if (error)
    return (
      <ErrorState
        title="Community unavailable"
        message={error}
        onRetry={() => refetch()}
      />
    );
  if (!community) {
    return (
      <EmptyState
        title="Community not found"
        description="This community may have been removed."
      />
    );
  }

  const canSeeFeed =
    !community.isPrivate || Boolean(community.myRole) || user?.role === "admin";
  const canPost = Boolean(community.myRole) || user?.role === "admin";

  return (
    <div className="space-y-6">
      <section className="gradient-hero-panel p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{community.isPrivate ? "Private" : "Public"}</Badge>
          {community.myRole && (
            <Badge variant="outline" className="capitalize">
              {community.myRole}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
          {community.name}
        </h1>
        <p className="text-sm text-[#c2c2c2] max-w-2xl">
          {community.description || "No description yet."}
        </p>
        <div className="text-xs text-[#c2c2c2]">
          {community.memberCount} member{community.memberCount === 1 ? "" : "s"}
          {community.owner?.name ? ` · owned by ${community.owner.name}` : ""}
        </div>
        <div className="flex flex-wrap gap-2">
          {!community.myRole && !community.joinRequestPending && (
            <Button
              type="button"
              disabled={joining}
              onClick={() => joinCommunity(community.id)}
            >
              {joining ? "Working…" : community.isPrivate ? "Request to join" : "Join"}
            </Button>
          )}
          {community.joinRequestPending && (
            <Button type="button" variant="outline" disabled>
              Request pending
            </Button>
          )}
          {community.myRole && community.myRole !== "owner" && (
            <Button type="button" variant="outline" onClick={() => setLeaveOpen(true)}>
              Leave
            </Button>
          )}
        </div>
      </section>

      <Tabs defaultValue="posts" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12 flex-wrap h-auto">
          <TabsTrigger value="posts" className="rounded-full text-xs">
            Posts
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-full text-xs">
            Members ({members.members.length})
          </TabsTrigger>
          {isMod && (
            <TabsTrigger value="requests" className="rounded-full text-xs">
              Requests ({requests.requests.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {!canSeeFeed ? (
            <EmptyState
              title="This community is private"
              description="Request to join. Posts become visible after a moderator approves you."
            />
          ) : (
            <>
              {canPost && <ComposePost communityId={community.id} />}
              {feed.loading ? (
                <LoadingState
                  variant="cards"
                  count={2}
                  message="Loading community posts..."
                />
              ) : feed.error ? (
                <ErrorState
                  title="Could not load posts"
                  message={feed.error}
                  onRetry={() => feed.refetch()}
                />
              ) : feed.posts.length === 0 ? (
                <EmptyState
                  title="No posts yet"
                  description={
                    canPost
                      ? "Start the conversation with a text, link, or poll."
                      : "Join to post here."
                  }
                />
              ) : (
                feed.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    communityId={community.id}
                    compact
                  />
                ))
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="members">
          {members.loading ? (
            <LoadingState variant="cards" count={3} message="Loading members..." />
          ) : members.error ? (
            <ErrorState
              title="Could not load members"
              message={members.error}
              onRetry={() => members.refetch()}
            />
          ) : members.members.length === 0 ? (
            <EmptyState
              title="No members listed"
              description="Membership records will appear here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.members.map((member) =>
                member.user ? (
                  <AlumniCard
                    key={member.id}
                    person={member.user}
                    footer={
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {member.role}
                        </Badge>
                        {community.myRole === "owner" &&
                          member.role !== "owner" &&
                          member.user.id !== user?.id && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={assigning}
                              onClick={() =>
                                assignModerator(
                                  member.user!.id,
                                  member.role !== "moderator"
                                )
                              }
                            >
                              {member.role === "moderator" ? "Remove mod" : "Make mod"}
                            </Button>
                          )}
                      </div>
                    }
                  />
                ) : null
              )}
            </div>
          )}
        </TabsContent>

        {isMod && (
          <TabsContent value="requests">
            {requests.loading ? (
              <LoadingState variant="rows" count={2} message="Loading join requests..." />
            ) : requests.error ? (
              <ErrorState
                title="Could not load requests"
                message={requests.error}
                onRetry={() => requests.refetch()}
              />
            ) : requests.requests.length === 0 ? (
              <EmptyState
                title="No pending requests"
                description="New private-community requests will appear here."
              />
            ) : (
              <div className="space-y-3">
                {requests.requests.map((request) => (
                  <article
                    key={request.id}
                    className="frosted-glass-card p-4 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        {request.user?.name ?? "Applicant"}
                      </div>
                      <div className="text-xs text-[#686868]">
                        {request.user?.headline}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={reviewing}
                        onClick={() => reviewJoinRequest(request.id, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={reviewing}
                        onClick={() => reviewJoinRequest(request.id, false)}
                      >
                        Decline
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <ResponsiveModal
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Leave community"
        description="You can join again later. Private communities will require a new request."
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setLeaveOpen(false)}>
              Stay
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={leaving}
              onClick={async () => {
                await leaveCommunity(community.id);
                setLeaveOpen(false);
              }}
            >
              {leaving ? "Leaving…" : "Leave"}
            </Button>
          </div>
        }
      >
        <p className="text-sm text-[#c2c2c2]">
          Your previous posts stay in the community timeline.
        </p>
      </ResponsiveModal>
    </div>
  );
}
