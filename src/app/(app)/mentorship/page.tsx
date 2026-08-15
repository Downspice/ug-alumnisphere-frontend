"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlumniCard } from "@/components/domain/alumni-card";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useIncomingMentorship,
  useMentorshipActions,
  useMyMentorships,
  useSentMentorship,
} from "@/hooks/api/use-mentorship";
import {
  mentorshipGoalSchema,
  type MentorshipGoalValues,
} from "@/lib/validations/career";

function GoalForm({
  mentorshipId,
  onAdd,
  adding,
}: {
  mentorshipId: string;
  onAdd: (mentorshipId: string, text: string) => Promise<unknown>;
  adding: boolean;
}) {
  const form = useForm<MentorshipGoalValues>({
    resolver: zodResolver(mentorshipGoalSchema),
    defaultValues: { text: "" },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onAdd(mentorshipId, values.text);
          form.reset({ text: "" });
        })}
        className="flex flex-col sm:flex-row gap-3"
      >
        <FormInput
          control={form.control}
          name="text"
          placeholder="Add a goal"
          containerClassName="flex-1"
        />
        <Button type="submit" variant="outline" disabled={adding}>
          Add goal
        </Button>
      </form>
    </Form>
  );
}

export default function MentorshipPage() {
  const { user } = useAuth();
  const incoming = useIncomingMentorship();
  const sent = useSentMentorship();
  const mine = useMyMentorships();
  const {
    acceptRequest,
    declineRequest,
    addGoal,
    toggleGoal,
    closeMentorship,
    deciding,
    addingGoal,
    closing,
  } = useMentorshipActions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Mentorship</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Review requests, keep a short goal list, and close the relationship when it is
          done.
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12 flex-wrap h-auto">
          <TabsTrigger value="active" className="rounded-full text-xs">
            Active ({mine.mentorships.filter((item) => item.status === "active").length})
          </TabsTrigger>
          <TabsTrigger value="incoming" className="rounded-full text-xs">
            Incoming ({incoming.requests.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="rounded-full text-xs">
            Sent ({sent.requests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {mine.loading ? (
            <LoadingState variant="cards" count={2} message="Loading mentorships..." />
          ) : mine.error ? (
            <ErrorState
              title="Could not load mentorships"
              message={mine.error}
              onRetry={() => mine.refetch()}
            />
          ) : mine.mentorships.length === 0 ? (
            <EmptyState
              title="No mentorships yet"
              description="Find someone open to mentor, or wait for a request if you offer mentorship."
            />
          ) : (
            mine.mentorships.map((item) => {
              const other = item.mentor?.id === user?.id ? item.mentee : item.mentor;
              return (
                <article key={item.id} className="frosted-glass-card p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        {other?.name ?? "Mentorship"}
                      </div>
                      <div className="text-xs text-[#686868]">
                        Mentor: {item.mentor?.name} · Mentee: {item.mentee?.name}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {item.goals.length === 0 ? (
                      <p className="text-sm text-[#c2c2c2]">
                        No goals yet. Add one below.
                      </p>
                    ) : (
                      item.goals.map((goal) => (
                        <Button
                          key={goal.id}
                          type="button"
                          variant={goal.done ? "default" : "outline"}
                          className="w-full justify-between"
                          onClick={() => toggleGoal(item.id, goal.id)}
                        >
                          <span>{goal.text}</span>
                          <span className="text-xs">{goal.done ? "Done" : "Open"}</span>
                        </Button>
                      ))
                    )}
                  </div>
                  {item.status === "active" && (
                    <GoalForm
                      mentorshipId={item.id}
                      onAdd={addGoal}
                      adding={addingGoal}
                    />
                  )}
                  {item.status === "active" && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={closing}
                      onClick={() => closeMentorship(item.id)}
                    >
                      Close mentorship
                    </Button>
                  )}
                </article>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="incoming">
          {incoming.loading ? (
            <LoadingState variant="rows" count={2} message="Loading requests..." />
          ) : incoming.error ? (
            <ErrorState
              title="Could not load requests"
              message={incoming.error}
              onRetry={() => incoming.refetch()}
            />
          ) : incoming.requests.length === 0 ? (
            <EmptyState
              title="No incoming requests"
              description="When someone asks you to mentor, they appear here."
            />
          ) : (
            <div className="space-y-3">
              {incoming.requests.map((request) =>
                request.mentee ? (
                  <AlumniCard
                    key={request.id}
                    person={request.mentee}
                    footer={
                      <div className="space-y-2">
                        <p className="text-xs text-[#c2c2c2]">{request.message}</p>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            disabled={deciding}
                            onClick={() => acceptRequest(request.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={deciding}
                            onClick={() => declineRequest(request.id)}
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    }
                  />
                ) : null
              )}
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
              description="Browse mentors and send a request when you are ready."
            />
          ) : (
            <div className="space-y-3">
              {sent.requests.map((request) => (
                <article
                  key={request.id}
                  className="frosted-glass-card p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium">{request.mentor?.name}</div>
                    <p className="text-xs text-[#c2c2c2]">{request.message}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {request.status}
                  </Badge>
                </article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
