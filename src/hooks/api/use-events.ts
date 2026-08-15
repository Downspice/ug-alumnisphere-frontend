"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { GET_EVENT, GET_EVENTS, GET_MY_EVENT_REGISTRATIONS } from "@/graphql/queries";
import {
  CANCEL_EVENT,
  CANCEL_EVENT_REGISTRATION,
  CREATE_EVENT,
  PUBLISH_EVENT,
  REGISTER_FOR_EVENT,
  UPDATE_EVENT,
} from "@/graphql/mutations";
import type { AlumniEvent, EventRegistration } from "@/lib/api/services/career.service";
import { toast } from "sonner";

const EVENT_QUERIES = [
  { query: GET_EVENTS },
  { query: GET_EVENTS, variables: { includeUnpublished: true } },
  { query: GET_MY_EVENT_REGISTRATIONS },
];

export function useEvents(filters: {
  search?: string;
  location?: string;
  includeUnpublished?: boolean;
}) {
  const { data, loading, error, refetch } = useQuery<{ events: AlumniEvent[] }>(
    GET_EVENTS,
    {
      variables: {
        search: filters.search || undefined,
        location: filters.location || undefined,
        includeUnpublished: filters.includeUnpublished || undefined,
      },
      errorPolicy: "all",
    }
  );
  return { events: data?.events ?? [], loading, error: error?.message ?? null, refetch };
}

export function useEvent(id?: string) {
  const { data, loading, error, refetch } = useQuery<{ event: AlumniEvent | null }>(
    GET_EVENT,
    {
      variables: { id },
      skip: !id,
      errorPolicy: "all",
    }
  );
  return { event: data?.event ?? null, loading, error: error?.message ?? null, refetch };
}

export function useMyEventRegistrations() {
  const { data, loading, error, refetch } = useQuery<{
    myEventRegistrations: EventRegistration[];
  }>(GET_MY_EVENT_REGISTRATIONS, { errorPolicy: "all" });
  return {
    registrations: data?.myEventRegistrations ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

export function useEventActions(eventId?: string) {
  const refetchQueries = [
    ...EVENT_QUERIES,
    ...(eventId ? [{ query: GET_EVENT, variables: { id: eventId } }] : []),
  ];
  const [create, createState] = useMutation(CREATE_EVENT, {
    refetchQueries: EVENT_QUERIES,
    onCompleted: () => toast.success("Event saved as draft"),
    onError: (err) => toast.error("Could not create event", { description: err.message }),
  });
  const [update, updateState] = useMutation(UPDATE_EVENT, {
    refetchQueries,
    onCompleted: () => toast.success("Event updated"),
    onError: (err) => toast.error("Could not update event", { description: err.message }),
  });
  const [publish, publishState] = useMutation(PUBLISH_EVENT, {
    refetchQueries,
    onCompleted: () => toast.success("Event published"),
    onError: (err) => toast.error("Could not publish", { description: err.message }),
  });
  const [cancel, cancelState] = useMutation(CANCEL_EVENT, {
    refetchQueries,
    onCompleted: () => toast.success("Event cancelled"),
    onError: (err) => toast.error("Could not cancel event", { description: err.message }),
  });
  const [register, registerState] = useMutation(REGISTER_FOR_EVENT, {
    refetchQueries,
    onCompleted: () => toast.success("You are registered"),
    onError: (err) => toast.error("Could not register", { description: err.message }),
  });
  const [leave, leaveState] = useMutation(CANCEL_EVENT_REGISTRATION, {
    refetchQueries,
    onCompleted: () => toast.success("Registration cancelled"),
    onError: (err) =>
      toast.error("Could not cancel registration", { description: err.message }),
  });

  return {
    createEvent: (input: Record<string, unknown>) => create({ variables: { input } }),
    updateEvent: (id: string, input: Record<string, unknown>) =>
      update({ variables: { id, input } }),
    publishEvent: (id: string) => publish({ variables: { id } }),
    cancelEvent: (id: string) => cancel({ variables: { id } }),
    registerForEvent: (id: string) => register({ variables: { eventId: id } }),
    cancelRegistration: (id: string) => leave({ variables: { eventId: id } }),
    creating: createState.loading,
    updating: updateState.loading,
    publishing: publishState.loading,
    cancelling: cancelState.loading,
    registering: registerState.loading,
    leaving: leaveState.loading,
  };
}
