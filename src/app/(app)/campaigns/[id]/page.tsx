"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormSwitch } from "@/components/forms/form-switch";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import {
  useCampaign,
  useCampaignActions,
  useCampaignContributions,
} from "@/hooks/api/use-campaigns";
import {
  contributionSchema,
  type ContributionFormValues,
} from "@/lib/validations/giving";
import { CoverMedia } from "@/components/domain/cover-media";
import { cn } from "@/lib/utils";

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const { campaign, loading, error, refetch } = useCampaign(params.id);
  const contributions = useCampaignContributions(params.id);
  const { recordContribution, recording } = useCampaignActions(params.id);
  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { amount: "", anonymous: false, note: "" },
  });

  if (loading)
    return <LoadingState variant="rows" count={3} message="Loading campaign..." />;
  if (error)
    return (
      <ErrorState
        title="Campaign unavailable"
        message={error}
        onRetry={() => refetch()}
      />
    );
  if (!campaign) {
    return (
      <EmptyState
        title="Campaign not found"
        description="It may still be a draft, or the link is incorrect."
        actionElement={
          <Link href="/campaigns" className={cn(buttonVariants())}>
            Back to campaigns
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/campaigns"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Back to campaigns
      </Link>
      <CoverMedia url={campaign.coverImageUrl} alt={campaign.title} />
      <section className="gradient-hero-panel p-6 sm:p-8 space-y-4">
        <Badge variant="outline" className="capitalize">
          {campaign.status}
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
          {campaign.title}
        </h1>
        <p className="text-sm text-[#c2c2c2] max-w-2xl">{campaign.description}</p>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${campaign.progressPercent}%` }}
          />
        </div>
        <p className="text-sm text-[#c2c2c2]">
          GHS {campaign.raisedAmount} raised of {campaign.goalAmount} ·{" "}
          {campaign.remainingAmount} remaining · {campaign.contributorCount} records
        </p>
        {campaign.deadline && (
          <p className="text-xs text-[#686868]">
            Deadline {new Date(campaign.deadline).toLocaleDateString()}
          </p>
        )}
      </section>

      {campaign.status === "active" ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await recordContribution(
                campaign.id,
                Number(values.amount),
                values.anonymous,
                values.note
              );
              form.reset({ amount: "", anonymous: false, note: "" });
            })}
            className="frosted-glass-card p-5 space-y-4"
          >
            <h2 className="text-base font-medium">Record a contribution</h2>
            <p className="text-xs text-[#686868]">
              This stores an amount only. There is no card checkout and no money moves.
              Paystack is the recommended later provider for Ghana.
            </p>
            <FormInput
              control={form.control}
              name="amount"
              label="Amount (GHS)"
              placeholder="100"
            />
            <FormTextarea control={form.control} name="note" label="Note (optional)" />
            <FormSwitch
              control={form.control}
              name="anonymous"
              label="Record anonymously"
              description="Other alumni will not see your name. Administrators still can."
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={recording}>
                {recording ? "Recording…" : "Record amount"}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <EmptyState
          title="Not accepting records"
          description="This campaign is closed or unpublished."
          compact
        />
      )}

      <section className="space-y-3">
        <h2 className="text-base font-medium">Recent records</h2>
        {contributions.loading ? (
          <LoadingState variant="rows" count={3} message="Loading records..." />
        ) : contributions.error ? (
          <ErrorState
            title="Could not load records"
            message={contributions.error}
            onRetry={() => contributions.refetch()}
          />
        ) : contributions.contributions.length === 0 ? (
          <EmptyState
            title="No records yet"
            description="Be the first to record an amount for this campaign."
          />
        ) : (
          <div className="space-y-3">
            {contributions.contributions.map((item) => (
              <article
                key={item.id}
                className="frosted-glass-card p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-sm font-medium">
                    {item.anonymous && !item.contributor
                      ? "Anonymous"
                      : (item.contributor?.name ?? "Alumni")}
                  </div>
                  {item.note && <p className="text-xs text-[#c2c2c2]">{item.note}</p>}
                </div>
                <div className="text-sm">GHS {item.amount}</div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
