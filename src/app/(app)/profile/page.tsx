"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/components/providers/auth-provider";
import { useUpdateMyProfile } from "@/hooks/api/use-auth";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormTagsInput } from "@/components/forms/form-tags-input";
import { FormFileInput } from "@/components/forms/form-file-input";
import { FormSwitch } from "@/components/forms/form-switch";
import { asFile, authorizedFileUrl, uploadFile } from "@/lib/api/upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { profileSchema, type ProfileFormValues } from "@/lib/validations/auth";
import { VerificationPanel } from "@/components/domain/verification-panel";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refetchUser } = useAuth();
  const { updateProfile, loading: saving } = useUpdateMyProfile(() => {
    void refetchUser();
  });
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      headline: "",
      about: "",
      location: "",
      graduationYear: "",
      programme: "",
      department: "",
      faculty: "",
      industry: "",
      company: "",
      jobTitle: "",
      skills: [],
      openToWork: false,
      openToMentor: false,
      avatar: undefined,
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      name: user.name,
      headline: user.headline ?? "",
      about: user.about ?? "",
      location: user.location ?? "",
      graduationYear: user.graduationYear ? String(user.graduationYear) : "",
      programme: user.programme ?? "",
      department: user.department ?? "",
      faculty: user.faculty ?? "",
      industry: user.industry ?? "",
      company: user.company ?? "",
      jobTitle: user.jobTitle ?? "",
      skills: user.skills ?? [],
      openToWork: user.openToWork,
      openToMentor: user.openToMentor,
      avatar: undefined,
    });
  }, [form, user]);

  if (loading) {
    return <LoadingState variant="rows" count={4} message="Loading profile..." />;
  }

  if (!user) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="Your session is no longer valid."
        actionLabel="Sign in"
        onAction={() => router.push("/login")}
      />
    );
  }

  const onSubmit = async (values: ProfileFormValues) => {
    const avatar = asFile(values.avatar);
    let avatarFileId: string | undefined;
    if (avatar) {
      try {
        setUploading(true);
        avatarFileId = (await uploadFile(avatar, "avatar")).id;
      } catch (error) {
        toast.error("Could not upload photo", {
          description:
            error instanceof Error
              ? error.message
              : "Try a JPEG, PNG, or WebP under 2MB.",
        });
        return;
      } finally {
        setUploading(false);
      }
    }
    await updateProfile({
      name: values.name,
      headline: values.headline,
      about: values.about,
      location: values.location,
      graduationYear: values.graduationYear ? Number(values.graduationYear) : undefined,
      programme: values.programme,
      department: values.department,
      faculty: values.faculty,
      industry: values.industry,
      company: values.company,
      jobTitle: values.jobTitle,
      skills: values.skills,
      openToWork: values.openToWork,
      openToMentor: values.openToMentor,
      avatarFileId,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Professional profile</h1>
          <p className="text-sm text-[#c2c2c2] mt-1">
            This is the identity classmates, mentors, and administrators will see.
          </p>
        </div>
        <Badge variant="secondary" className="capitalize w-fit">
          {user.verificationStatus}
        </Badge>
      </div>

      <VerificationPanel />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="frosted-glass-card p-6 space-y-5"
        >
          <div className="flex items-center gap-4">
            {authorizedFileUrl(user.avatarUrl) ? (
              <img
                src={authorizedFileUrl(user.avatarUrl) ?? ""}
                alt=""
                className="size-16 rounded-full object-cover border border-[#e5e5e5]/12"
              />
            ) : (
              <div className="size-16 rounded-full bg-[#161616] border border-[#e5e5e5]/12" />
            )}
            <FormFileInput
              control={form.control}
              name="avatar"
              label="Profile photo"
              accept="image/jpeg,image/png,image/webp"
              maxSizeBytes={2 * 1024 * 1024}
              description="JPEG, PNG, or WebP up to 2MB."
              containerClassName="flex-1"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput control={form.control} name="name" label="Full name" />
            <FormInput
              control={form.control}
              name="headline"
              label="Professional headline"
              placeholder="Software Engineer · Class of 2018"
            />
            <FormInput control={form.control} name="location" label="Location" />
            <FormInput
              control={form.control}
              name="graduationYear"
              label="Graduation year"
              placeholder="2018"
            />
            <FormInput control={form.control} name="programme" label="Programme" />
            <FormInput control={form.control} name="department" label="Department" />
            <FormInput control={form.control} name="faculty" label="Faculty" />
            <FormInput control={form.control} name="industry" label="Industry" />
            <FormInput control={form.control} name="company" label="Company" />
            <FormInput control={form.control} name="jobTitle" label="Job title" />
          </div>
          <FormTextarea
            control={form.control}
            name="about"
            label="About"
            placeholder="A short professional summary"
          />
          <FormTagsInput
            control={form.control}
            name="skills"
            label="Skills"
            placeholder="Add a skill and press Enter"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSwitch
              control={form.control}
              name="openToWork"
              label="Open to work"
              description="Show recruiters and alumni that you are exploring roles."
            />
            <FormSwitch
              control={form.control}
              name="openToMentor"
              label="Open to mentor"
              description="Appear in mentor discovery for students and early-career alumni."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving || uploading}>
              {uploading ? "Uploading…" : saving ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
