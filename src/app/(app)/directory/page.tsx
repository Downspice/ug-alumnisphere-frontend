"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { FormSwitch } from "@/components/forms/form-switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { AlumniCard } from "@/components/domain/alumni-card";
import { ConnectionActions } from "@/components/domain/connection-actions";
import { useAlumniDirectory } from "@/hooks/api/use-directory";
import {
  directoryFilterSchema,
  type DirectoryFilterValues,
} from "@/lib/validations/network";
import type { DirectoryFilter } from "@/lib/api/services/network.service";

const EMPTY_FILTERS: DirectoryFilterValues = {
  query: "",
  programme: "",
  department: "",
  industry: "",
  location: "",
  skill: "",
  graduationYear: "",
  verificationStatus: "any",
  openToMentor: false,
  openToWork: false,
  sort: "RECENT",
};

export default function DirectoryPage() {
  const [page, setPage] = useState(1);
  const [applied, setApplied] = useState<DirectoryFilterValues>(EMPTY_FILTERS);
  const form = useForm<DirectoryFilterValues>({
    resolver: zodResolver(directoryFilterSchema),
    defaultValues: EMPTY_FILTERS,
  });

  const filter = useMemo<DirectoryFilter>(() => {
    const next: DirectoryFilter = {};
    if (applied.query) next.query = applied.query;
    if (applied.programme) next.programme = applied.programme;
    if (applied.department) next.department = applied.department;
    if (applied.industry) next.industry = applied.industry;
    if (applied.location) next.location = applied.location;
    if (applied.skill) next.skill = applied.skill;
    if (applied.graduationYear) next.graduationYear = Number(applied.graduationYear);
    if (applied.verificationStatus && applied.verificationStatus !== "any") {
      next.verificationStatus = applied.verificationStatus;
    }
    if (applied.openToMentor) next.openToMentor = true;
    if (applied.openToWork) next.openToWork = true;
    return next;
  }, [applied]);

  const {
    items,
    page: result,
    loading,
    error,
    refetch,
  } = useAlumniDirectory({
    filter,
    sort: applied.sort,
    page,
  });

  const chips = Object.entries(applied).filter(([key, value]) => {
    if (key === "sort" || value === "any") return false;
    return typeof value === "boolean" ? value : Boolean(value);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Alumni directory</h1>
        <p className="text-sm text-[#c2c2c2] mt-1">
          Search classmates by programme, year, industry, skills, and availability.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            setPage(1);
            setApplied(values);
          })}
          className="frosted-glass-card p-5 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormInput
              control={form.control}
              name="query"
              label="Search"
              placeholder="Name, headline, company"
            />
            <FormInput control={form.control} name="programme" label="Programme" />
            <FormInput control={form.control} name="department" label="Department" />
            <FormInput control={form.control} name="industry" label="Industry" />
            <FormInput control={form.control} name="location" label="Location" />
            <FormInput control={form.control} name="skill" label="Skill" />
            <FormInput
              control={form.control}
              name="graduationYear"
              label="Graduation year"
              placeholder="2018"
            />
            <FormSelect
              control={form.control}
              name="verificationStatus"
              label="Verification"
              options={[
                { label: "Any status", value: "any" },
                { label: "Verified", value: "verified" },
                { label: "Pending", value: "pending" },
                { label: "Unverified", value: "unverified" },
                { label: "Rejected", value: "rejected" },
              ]}
            />
            <FormSelect
              control={form.control}
              name="sort"
              label="Sort"
              options={[
                { label: "Recently joined", value: "RECENT" },
                { label: "Name A–Z", value: "NAME_ASC" },
                { label: "Graduation year", value: "YEAR_DESC" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSwitch
              control={form.control}
              name="openToMentor"
              label="Open to mentor"
            />
            <FormSwitch control={form.control} name="openToWork" label="Open to work" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit">Apply filters</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset(EMPTY_FILTERS);
                setApplied(EMPTY_FILTERS);
                setPage(1);
              }}
            >
              Clear filters
            </Button>
          </div>
        </form>
      </Form>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="capitalize">
              {key}: {String(value)}
            </Badge>
          ))}
        </div>
      )}

      {loading ? (
        <LoadingState variant="cards" count={6} message="Searching the directory..." />
      ) : error ? (
        <ErrorState
          title="Directory unavailable"
          message={error}
          onRetry={() => refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          title="No alumni match those filters"
          description="Clear a filter or broaden the search. New members appear here after they register."
          actionLabel="Clear filters"
          onAction={() => {
            form.reset(EMPTY_FILTERS);
            setApplied(EMPTY_FILTERS);
          }}
        />
      ) : (
        <>
          <p className="text-xs text-[#686868]">{result?.total} people</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((person) => (
              <AlumniCard
                key={person.id}
                person={person}
                footer={<ConnectionActions userId={person.id} compact />}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <span className="text-xs text-[#686868]">Page {page}</span>
            <Button
              type="button"
              variant="outline"
              disabled={!result?.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
