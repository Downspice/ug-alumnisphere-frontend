"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { useCampaigns, useMyContributions } from "@/hooks/api/use-campaigns";
import {
  campaignFilterSchema,
  type CampaignFilterValues,
} from "@/lib/validations/giving";
import { cn } from "@/lib/utils";

export default function CampaignsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const campaigns = useCampaigns(search);
  const mine = useMyContributions();
  const form = useForm<CampaignFilterValues>({
    resolver: zodResolver(campaignFilterSchema),
    defaultValues: { search: "" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Campaigns</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Record a pledge amount. AlumniSphere does not take card payments — records
            stay in MongoDB until a provider such as Paystack is configured.
          </p>
        </div>
        {user?.role === "admin" && (
          <Link
            href="/admin/campaigns"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Manage campaigns
          </Link>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => setSearch(values.search?.trim() ?? ""))}
          className="frosted-glass-card p-4 flex flex-col sm:flex-row gap-3"
        >
          <FormInput
            control={form.control}
            name="search"
            label="Search"
            placeholder="Scholarship, library, clinic"
            containerClassName="flex-1"
          />
          <Button type="submit" variant="outline" className="sm:self-end">
            Search
          </Button>
        </form>
      </Form>

      <Tabs defaultValue="open" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12">
          <TabsTrigger value="open" className="rounded-full text-xs">
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="mine" className="rounded-full text-xs">
            My records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open">
          {campaigns.loading ? (
            <LoadingState variant="cards" count={3} message="Loading campaigns..." />
          ) : campaigns.error ? (
            <ErrorState
              title="Could not load campaigns"
              message={campaigns.error}
              onRetry={() => campaigns.refetch()}
            />
          ) : campaigns.campaigns.length === 0 ? (
            <EmptyState
              title="No published campaigns"
              description="Administrators publish giving campaigns from the admin desk."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.campaigns.map((campaign) => (
                <article key={campaign.id} className="frosted-glass-card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-medium">{campaign.title}</h3>
                    <Badge variant="outline" className="capitalize">
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#c2c2c2] line-clamp-3">
                    {campaign.description}
                  </p>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${campaign.progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#686868]">
                    GHS {campaign.raisedAmount} of {campaign.goalAmount} ·{" "}
                    {campaign.contributorCount} records
                  </p>
                  <Link
                    href={`/campaigns/${campaign.id}`}
                    className={cn(buttonVariants({ size: "sm" }))}
                  >
                    Open
                  </Link>
                </article>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mine">
          {mine.loading ? (
            <LoadingState variant="rows" count={3} message="Loading your records..." />
          ) : mine.error ? (
            <ErrorState
              title="Could not load records"
              message={mine.error}
              onRetry={() => mine.refetch()}
            />
          ) : mine.contributions.length === 0 ? (
            <EmptyState
              title="No contribution records"
              description="Open a campaign and record an amount. Nothing is charged."
            />
          ) : (
            <div className="space-y-3">
              {mine.contributions.map((item) => (
                <article
                  key={item.id}
                  className="frosted-glass-card p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium">{item.campaign?.title}</div>
                    <div className="text-xs text-[#c2c2c2]">
                      GHS {item.amount} · {item.status}
                      {item.anonymous ? " · anonymous" : ""}
                    </div>
                  </div>
                  {item.campaign && (
                    <Link
                      href={`/campaigns/${item.campaign.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      View
                    </Link>
                  )}
                </article>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
