"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormDatePicker } from "@/components/forms/form-date-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { useCampaignActions, useCampaigns } from "@/hooks/api/use-campaigns";
import { campaignSchema, type CampaignFormValues } from "@/lib/validations/giving";
import type { Campaign } from "@/lib/api/services/giving.service";

const EMPTY: CampaignFormValues = { title: "", description: "", goalAmount: "", deadline: "" };

export default function AdminCampaignsPage() {
  const { campaigns, loading, error, refetch } = useCampaigns(undefined, true);
  const { createCampaign, publishCampaign, closeCampaign, creating, publishing, closing } = useCampaignActions();
  const [open, setOpen] = useState(false);
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: EMPTY,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Campaign desk</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Draft, publish, and close giving campaigns. Cover images wait for storage buckets. No payment checkout is attached.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Create campaign
        </Button>
      </div>

      {loading ? (
        <LoadingState variant="rows" count={3} message="Loading campaigns..." />
      ) : error ? (
        <ErrorState title="Could not load campaigns" message={error} onRetry={() => refetch()} />
      ) : campaigns.length === 0 ? (
        <EmptyState title="No campaigns" description="Create a draft, then publish it to the alumni giving list." />
      ) : (
        <div className="space-y-3">
          {campaigns.map((campaign: Campaign) => (
            <article key={campaign.id} className="frosted-glass-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">{campaign.title}</div>
                  <div className="text-xs text-[#c2c2c2]">
                    GHS {campaign.raisedAmount} / {campaign.goalAmount} · {campaign.contributorCount} records
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {campaign.status === "draft" && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={publishing}
                    onClick={() => publishCampaign(campaign.id)}
                  >
                    Publish
                  </Button>
                )}
                {campaign.status === "active" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={closing}
                    onClick={() => closeCampaign(campaign.id)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Create campaign"
        description="Drafts stay hidden until you publish them."
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await createCampaign({
                title: values.title,
                description: values.description,
                goalAmount: Number(values.goalAmount),
                deadline: values.deadline || undefined,
              });
              form.reset(EMPTY);
              setOpen(false);
            })}
            className="space-y-4"
          >
            <FormInput control={form.control} name="title" label="Title" />
            <FormTextarea control={form.control} name="description" label="Description" />
            <FormInput control={form.control} name="goalAmount" label="Goal (GHS)" placeholder="50000" />
            <FormDatePicker control={form.control} name="deadline" label="Deadline (optional)" />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={creating}>
                Save draft
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
