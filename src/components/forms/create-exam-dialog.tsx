"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateExam } from "@/hooks/api";
import { examSchema, ExamFormValues } from "@/lib/validations/exam";
import { Form } from "@/components/ui/form";
import { FormInput } from "./form-input";
import { FormTextarea } from "./form-textarea";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

interface CreateExamDialogProps {
  onSuccess?: () => void;
}

export function CreateExamDialog({ onSuccess }: CreateExamDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      durationMinutes: 60,
      totalMarks: 100,
      passingMarks: 40,
      isPublished: true,
    },
  });

  const { createExam, loading } = useCreateExam(() => {
    form.reset();
    setOpen(false);
    onSuccess?.();
  });

  const onSubmit = async (values: ExamFormValues) => {
    await createExam({
      ...values,
      questions: [
        {
          questionText: `Assessment Question for ${values.title}`,
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          correctOptionIndex: 0,
          points: 5,
        },
      ],
    });
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title={
        <span className="flex items-center gap-2 text-[#ededed]">
          <BookOpen className="size-4 text-white" />
          Create New Exam
        </span>
      }
      description="Type-safe form with Zod validation. Center modal on desktop, bottom drawer on mobile."
      trigger={
        <Button
          size="sm"
          className="rounded-full bg-white text-[#161616] hover:bg-white/90 font-medium text-xs px-4 py-1.5 shadow-xs"
        >
          <Plus className="size-3.5 mr-1" />
          New Exam
        </Button>
      }
    >
      <Form {...form}>
        <form
          id="create-exam-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 py-1"
        >
          <FormInput
            control={form.control}
            name="title"
            label="Exam Title"
            placeholder="e.g. Advanced TypeScript & Node.js"
            description="Minimum 3 characters"
          />

          <FormTextarea
            control={form.control}
            name="description"
            label="Description"
            placeholder="Provide context and prerequisites for this examination..."
            maxLength={300}
            showCount
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput
              control={form.control}
              name="durationMinutes"
              label="Duration (mins)"
              type="number"
            />
            <FormInput
              control={form.control}
              name="totalMarks"
              label="Total Marks"
              type="number"
            />
            <FormInput
              control={form.control}
              name="passingMarks"
              label="Pass Marks"
              type="number"
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-[#e5e5e5]/10">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-white text-[#161616] hover:bg-white/90 text-xs px-5 py-2 font-medium"
            >
              {loading ? "Creating..." : "Create Exam"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
