"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormFileInput } from "@/components/forms/form-file-input";
import { CoverMedia } from "@/components/domain/cover-media";
import { asFile, uploadFile } from "@/lib/api/upload";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommunities, useCommunityActions } from "@/hooks/api/use-communities";
import {
  communitySchema,
  searchSchema,
  type CommunityFormValues,
  type SearchFormValues,
} from "@/lib/validations/social";
import { cn } from "@/lib/utils";

function CommunityGrid({
  communities,
  loading,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
}: {
  communities: ReturnType<typeof useCommunities>["communities"];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (loading)
    return <LoadingState variant="cards" count={3} message="Loading communities..." />;
  if (error)
    return (
      <ErrorState title="Could not load communities" message={error} onRetry={onRetry} />
    );
  if (communities.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {communities.map((community) => (
        <article key={community.id} className="frosted-glass-card p-5 space-y-3">
          <CoverMedia url={community.coverImageUrl} alt={community.name} />
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-medium">{community.name}</h3>
            <Badge variant="outline">{community.isPrivate ? "Private" : "Public"}</Badge>
          </div>
          <p className="text-sm text-[#c2c2c2] line-clamp-3">
            {community.description || "No description yet."}
          </p>
          <div className="text-xs text-[#686868]">
            {community.memberCount} member{community.memberCount === 1 ? "" : "s"}
            {community.myRole ? ` · ${community.myRole}` : ""}
          </div>
          <Link
            href={`/communities/${community.id}`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Open
          </Link>
        </article>
      ))}
    </div>
  );
}

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const discover = useCommunities(search);
  const mine = useCommunities(search, true);
  const { createCommunity, creating } = useCommunityActions();
  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });
  const createForm = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    defaultValues: { name: "", description: "", isPrivate: false, cover: undefined },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Communities</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Discover public groups or request access to private ones. Owners can appoint
            moderators.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen(true)}>
          Create community
        </Button>
      </div>

      <Form {...searchForm}>
        <form
          onSubmit={searchForm.handleSubmit((values) =>
            setSearch(values.query?.trim() ?? "")
          )}
          className="frosted-glass-card p-4 flex flex-col sm:flex-row gap-3"
        >
          <FormInput
            control={searchForm.control}
            name="query"
            label="Search"
            placeholder="Community name"
            containerClassName="flex-1"
          />
          <Button type="submit" variant="outline" className="sm:self-end">
            Search
          </Button>
        </form>
      </Form>

      <Tabs defaultValue="discover" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12">
          <TabsTrigger value="discover" className="rounded-full text-xs">
            Discover
          </TabsTrigger>
          <TabsTrigger value="mine" className="rounded-full text-xs">
            My communities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="discover">
          <CommunityGrid
            communities={discover.communities}
            loading={discover.loading}
            error={discover.error}
            onRetry={() => discover.refetch()}
            emptyTitle="No communities yet"
            emptyDescription="Create the first public or private community for your class, faculty, or interest."
          />
        </TabsContent>
        <TabsContent value="mine">
          <CommunityGrid
            communities={mine.communities}
            loading={mine.loading}
            error={mine.error}
            onRetry={() => mine.refetch()}
            emptyTitle="You have not joined a community"
            emptyDescription="Join a public community or wait for a private request to be approved."
          />
        </TabsContent>
      </Tabs>

      <ResponsiveModal
        open={open}
        onOpenChange={setOpen}
        title="Create a community"
        description="Public communities can be joined immediately. Private ones require approval."
      >
        <Form {...createForm}>
          <form
            onSubmit={createForm.handleSubmit(async (values) => {
              const cover = asFile(values.cover);
              let coverFileId: string | undefined;
              if (cover) {
                try {
                  setUploading(true);
                  coverFileId = (await uploadFile(cover, "community")).id;
                } catch (error) {
                  toast.error("Could not upload cover", {
                    description:
                      error instanceof Error
                        ? error.message
                        : "Try a JPEG, PNG, or WebP under 5MB.",
                  });
                  return;
                } finally {
                  setUploading(false);
                }
              }
              await createCommunity({
                name: values.name,
                description: values.description,
                isPrivate: values.isPrivate,
                coverFileId,
              });
              createForm.reset({
                name: "",
                description: "",
                isPrivate: false,
                cover: undefined,
              });
              setOpen(false);
            })}
            className="space-y-4"
          >
            <FormInput control={createForm.control} name="name" label="Name" />
            <FormTextarea
              control={createForm.control}
              name="description"
              label="Description"
            />
            <FormSwitch
              control={createForm.control}
              name="isPrivate"
              label="Private community"
              description="Members must request to join."
            />
            <FormFileInput
              control={createForm.control}
              name="cover"
              label="Cover image"
              accept="image/jpeg,image/png,image/webp"
              maxSizeBytes={5 * 1024 * 1024}
              description="Optional JPEG, PNG, or WebP up to 5MB."
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creating || uploading}>
                {uploading ? "Uploading…" : creating ? "Creating…" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
