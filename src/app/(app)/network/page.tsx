"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { AlumniCard } from "@/components/domain/alumni-card";
import { ConnectionActions } from "@/components/domain/connection-actions";
import { MessageButton } from "@/components/domain/message-button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useConnectionActions,
  useMyConnections,
  usePendingConnections,
  useSentConnections,
  useSuggestedConnections,
} from "@/hooks/api/use-connections";
import type { DirectoryUser } from "@/lib/api/services/network.service";

function otherUser(
  requester?: DirectoryUser,
  addressee?: DirectoryUser,
  viewerId?: string
) {
  if (!viewerId) return requester ?? addressee ?? null;
  if (requester?.id === viewerId) return addressee ?? null;
  return requester ?? null;
}

export default function NetworkPage() {
  const { user } = useAuth();
  const connections = useMyConnections();
  const pending = usePendingConnections();
  const sent = useSentConnections();
  const suggested = useSuggestedConnections();
  const { acceptRequest, declineRequest, deciding } = useConnectionActions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Network</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Manage requests, see accepted connections, and review rule-based suggestions.
        </p>
      </div>

      <Tabs defaultValue="connections" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12 flex-wrap h-auto">
          <TabsTrigger value="connections" className="rounded-full text-xs">
            Connections ({connections.connections.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-full text-xs">
            Incoming ({pending.requests.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="rounded-full text-xs">
            Sent ({sent.requests.length})
          </TabsTrigger>
          <TabsTrigger value="suggested" className="rounded-full text-xs">
            Suggested ({suggested.suggestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          {connections.loading ? (
            <LoadingState variant="cards" count={3} message="Loading connections..." />
          ) : connections.error ? (
            <ErrorState
              title="Could not load connections"
              message={connections.error}
              onRetry={() => connections.refetch()}
            />
          ) : connections.connections.length === 0 ? (
            <EmptyState
              title="No connections yet"
              description="Search the directory and send a request. Suggestions use programme, year, industry, location, and shared skills."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connections.connections.map((item) => {
                const person = otherUser(item.requester, item.addressee, user?.id);
                if (!person) return null;
                return (
                  <AlumniCard
                    key={item.id}
                    person={person}
                    footer={
                      <div className="flex flex-wrap gap-2">
                        <ConnectionActions userId={person.id} compact />
                        <MessageButton userId={person.id} compact />
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pending.loading ? (
            <LoadingState
              variant="rows"
              count={3}
              message="Loading incoming requests..."
            />
          ) : pending.error ? (
            <ErrorState
              title="Could not load requests"
              message={pending.error}
              onRetry={() => pending.refetch()}
            />
          ) : pending.requests.length === 0 ? (
            <EmptyState
              title="No incoming requests"
              description="When someone wants to connect, they will appear here."
            />
          ) : (
            <div className="space-y-3">
              {pending.requests.map((item) => (
                <div
                  key={item.id}
                  className="frosted-glass-card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium">{item.requester?.name}</div>
                    <div className="text-xs text-[#c2c2c2]">
                      {item.requester?.headline || item.requester?.programme}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      disabled={deciding}
                      onClick={() => acceptRequest(item.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={deciding}
                      onClick={() => declineRequest(item.id)}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent">
          {sent.loading ? (
            <LoadingState variant="rows" count={2} message="Loading sent requests..." />
          ) : sent.error ? (
            <ErrorState
              title="Could not load sent requests"
              message={sent.error}
              onRetry={() => sent.refetch()}
            />
          ) : sent.requests.length === 0 ? (
            <EmptyState
              title="No sent requests"
              description="Requests you send stay here until they are accepted or declined."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sent.requests.map((item) =>
                item.addressee ? (
                  <AlumniCard
                    key={item.id}
                    person={item.addressee}
                    footer={<span className="text-xs text-[#686868]">Pending</span>}
                  />
                ) : null
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="suggested">
          {suggested.loading ? (
            <LoadingState variant="cards" count={3} message="Loading suggestions..." />
          ) : suggested.error ? (
            <ErrorState
              title="Could not load suggestions"
              message={suggested.error}
              onRetry={() => suggested.refetch()}
            />
          ) : suggested.suggestions.length === 0 ? (
            <EmptyState
              title="No rule-based matches yet"
              description="Suggestions appear when another member shares your programme, graduation year, industry, location, or skills. This is not an AI recommender."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggested.suggestions.map((item) => (
                <div key={item.user.id} className="space-y-2">
                  <AlumniCard
                    person={item.user}
                    footer={<ConnectionActions userId={item.user.id} compact />}
                  />
                  <p className="text-[11px] text-[#686868] px-1">
                    {item.reasons.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
