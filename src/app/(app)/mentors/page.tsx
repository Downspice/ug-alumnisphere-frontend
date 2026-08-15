"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { AlumniCard } from "@/components/domain/alumni-card";
import { MentorRequestButton } from "@/components/domain/mentor-request-button";
import { useMentors } from "@/hooks/api/use-mentorship";
import { mentorFilterSchema, type MentorFilterValues } from "@/lib/validations/career";
import { cn } from "@/lib/utils";

export default function MentorsPage() {
  const [applied, setApplied] = useState<MentorFilterValues>({
    search: "",
    industry: "",
    location: "",
  });
  const { mentors, loading, error, refetch } = useMentors(applied);
  const form = useForm<MentorFilterValues>({
    resolver: zodResolver(mentorFilterSchema),
    defaultValues: applied,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Mentors</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            Alumni who marked themselves open to mentor. Requests are reviewed by the mentor.
          </p>
        </div>
        <Link href="/mentorship" className={cn(buttonVariants({ variant: "outline" }))}>
          My mentorships
        </Link>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => setApplied(values))}
          className="frosted-glass-card p-5 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <FormInput control={form.control} name="search" label="Search" placeholder="Name or programme" />
          <FormInput control={form.control} name="industry" label="Industry" />
          <FormInput control={form.control} name="location" label="Location" />
          <Button type="submit" variant="outline" className="md:self-end">
            Search
          </Button>
        </form>
      </Form>

      {loading ? (
        <LoadingState variant="cards" count={3} message="Loading mentors..." />
      ) : error ? (
        <ErrorState title="Could not load mentors" message={error} onRetry={() => refetch()} />
      ) : mentors.length === 0 ? (
        <EmptyState
          title="No mentors match"
          description="Try another search, or mark yourself open to mentor on your profile."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mentors.map((person) => (
            <AlumniCard
              key={person.id}
              person={person}
              footer={<MentorRequestButton mentorId={person.id} openToMentor={person.openToMentor} compact />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
