"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { GET_EXAMS, GET_EXAM } from "@/graphql/queries";
import { CREATE_EXAM, DELETE_EXAM } from "@/graphql/mutations";
import { Exam, CreateExamInput } from "@/lib/api/services/exams.service";
import { toast } from "sonner";

export interface UseExamsOptions {
  isPublished?: boolean;
  pollInterval?: number;
}

/**
 * Hook to fetch all exams with automatic loading, error, and refetch handling
 */
export function useExams(options: UseExamsOptions = {}) {
  const { data, loading, error, refetch } = useQuery<{ exams: Exam[] }>(
    GET_EXAMS,
    {
      variables: { isPublished: options.isPublished },
      pollInterval: options.pollInterval,
      errorPolicy: "all",
    }
  );

  return {
    exams: data?.exams ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
    count: data?.exams?.length ?? 0,
  };
}

/**
 * Hook to fetch a single exam by ID
 */
export function useExam(id: string) {
  const { data, loading, error, refetch } = useQuery<{ exam: Exam | null }>(
    GET_EXAM,
    {
      variables: { id },
      skip: !id,
      errorPolicy: "all",
    }
  );

  return {
    exam: data?.exam ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

/**
 * Hook to create a new exam with automatic toast feedback and cache update
 */
export function useCreateExam(onSuccess?: (exam: Exam) => void) {
  const [createExamMutation, { loading, error }] = useMutation<
    { createExam: Exam },
    { input: CreateExamInput }
  >(CREATE_EXAM, {
    refetchQueries: [{ query: GET_EXAMS }],
    onCompleted: (data) => {
      if (data?.createExam) {
        toast.success("Exam Created", {
          description: `"${data.createExam.title}" has been saved to MongoDB.`,
        });
        onSuccess?.(data.createExam);
      }
    },
    onError: (err) => {
      toast.error("Failed to create exam", {
        description: err.message,
      });
    },
  });

  const createExam = async (input: CreateExamInput) => {
    return createExamMutation({
      variables: { input },
    });
  };

  return {
    createExam,
    loading,
    error: error?.message ?? null,
  };
}

/**
 * Hook to delete an exam with automatic toast feedback and cache update
 */
export function useDeleteExam(onSuccess?: () => void) {
  const [deleteExamMutation, { loading, error }] = useMutation<
    { deleteExam: boolean },
    { id: string }
  >(DELETE_EXAM, {
    refetchQueries: [{ query: GET_EXAMS }],
    onCompleted: (data) => {
      if (data?.deleteExam) {
        toast.success("Exam Deleted", {
          description: "The exam was removed from the database.",
        });
        onSuccess?.();
      }
    },
    onError: (err) => {
      toast.error("Failed to delete exam", {
        description: err.message,
      });
    },
  });

  const deleteExam = async (id: string) => {
    return deleteExamMutation({
      variables: { id },
    });
  };

  return {
    deleteExam,
    loading,
    error: error?.message ?? null,
  };
}
