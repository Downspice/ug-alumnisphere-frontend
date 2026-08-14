"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/hooks/api";
import { userSchema, UserFormValues } from "@/lib/validations/user";
import { Form } from "@/components/ui/form";
import { FormInput } from "./form-input";
import { FormSelect } from "./form-select";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus } from "lucide-react";

interface CreateUserDialogProps {
  onSuccess?: () => void;
}

const roleOptions = [
  { label: "Student", value: "student" },
  { label: "Instructor", value: "instructor" },
  { label: "Admin", value: "admin" },
];

export function CreateUserDialog({ onSuccess }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "student",
    },
  });

  const { createUser, loading } = useCreateUser(() => {
    form.reset();
    setOpen(false);
    onSuccess?.();
  });

  const onSubmit = async (values: UserFormValues) => {
    await createUser(values);
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={setOpen}
      title={
        <span className="flex items-center gap-2 text-[#ededed]">
          <UserPlus className="size-4 text-white" />
          Create New User
        </span>
      }
      description="Validates user details and roles. Transforms to bottom drawer on mobile viewports."
      trigger={
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs text-[#ededed] hover:text-white px-4 py-2 rounded-full border border-[#e5e5e5]/15 hover:border-[#e5e5e5]/30 bg-white/5 transition-colors"
        >
          <Plus className="size-3.5" />
          New User
        </button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-1">
          <FormInput
            control={form.control}
            name="name"
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            description="Minimum 2 characters"
          />

          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="alex.morgan@example.com"
          />

          <FormSelect
            control={form.control}
            name="role"
            label="System Role"
            placeholder="Select user role"
            options={roleOptions}
          />

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t border-[#e5e5e5]/10">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center text-xs text-[#c2c2c2] hover:text-white px-4 py-2 rounded-full border border-[#e5e5e5]/15 hover:border-[#e5e5e5]/30 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-full bg-white text-[#161616] hover:bg-white/90 text-xs px-5 py-2 font-medium"
            >
              {loading ? "Creating..." : "Save User"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
}
