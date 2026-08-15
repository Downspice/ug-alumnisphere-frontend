"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ComposePost } from "@/components/domain/compose-post";
import { PostCard } from "@/components/domain/post-card";
import { useFeed, useSavedPosts } from "@/hooks/api/use-posts";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { Button } from "@/components/ui/button";
import { searchSchema, type SearchFormValues } from "@/lib/validations/social";
import { useMemo, useState } from "react";

export default function FeedPage() {
  const feed = useFeed();
  const saved = useSavedPosts();
  const [query, setQuery] = useState("");
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return feed.posts;
    return feed.posts.filter((post) =>
      [post.body, post.pollQuestion, post.author?.name, post.community?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [feed.posts, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Feed</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Chronological updates from the main alumni feed. Community posts live inside
          each community.
        </p>
      </div>

      <ComposePost />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => setQuery(values.query ?? ""))}
          className="flex flex-col sm:flex-row gap-3"
        >
          <FormInput
            control={form.control}
            name="query"
            placeholder="Search posts on this page"
            containerClassName="flex-1"
          />
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>
      </Form>

      <Tabs defaultValue="latest" className="space-y-5">
        <TabsList className="bg-[#161616] p-1 rounded-full border border-[#e5e5e5]/12">
          <TabsTrigger value="latest" className="rounded-full text-xs">
            Latest
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-full text-xs">
            Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          {feed.loading ? (
            <LoadingState variant="cards" count={3} message="Loading the feed..." />
          ) : feed.error ? (
            <ErrorState
              title="Could not load the feed"
              message={feed.error}
              onRetry={() => feed.refetch()}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={query ? "No matching posts" : "The feed is quiet"}
              description="Publish a text, image, link, or poll to get the conversation started."
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved">
          {saved.loading ? (
            <LoadingState variant="cards" count={2} message="Loading saved posts..." />
          ) : saved.error ? (
            <ErrorState
              title="Could not load saved posts"
              message={saved.error}
              onRetry={() => saved.refetch()}
            />
          ) : saved.posts.length === 0 ? (
            <EmptyState
              title="Nothing saved"
              description="Save a post from the feed to find it later."
            />
          ) : (
            <div className="space-y-4">
              {saved.posts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
