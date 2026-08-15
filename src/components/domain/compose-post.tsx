"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormInput } from "@/components/forms/form-input";
import { FormRadioGroup } from "@/components/forms/form-radio-group";
import { FormDatePicker } from "@/components/forms/form-date-picker";
import { FormFileInput } from "@/components/forms/form-file-input";
import { Button } from "@/components/ui/button";
import { usePostActions } from "@/hooks/api/use-posts";
import { asFile, uploadFile } from "@/lib/api/upload";
import { postSchema, type PostFormValues } from "@/lib/validations/social";

const DEFAULTS: PostFormValues = {
  type: "text",
  body: "",
  linkUrl: "",
  pollQuestion: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  pollClosesAt: "",
  image: undefined,
};

export function ComposePost({ communityId }: { communityId?: string }) {
  const { createPost, creating } = usePostActions(communityId);
  const [uploading, setUploading] = useState(false);
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: DEFAULTS,
  });
  const type = useWatch({ control: form.control, name: "type" });
  const busy = creating || uploading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const options = [values.option1, values.option2, values.option3, values.option4]
            .map((item) => item?.trim())
            .filter((item): item is string => Boolean(item));
          let imageFileId: string | undefined;
          const image = asFile(values.image);
          if (values.type === "image") {
            if (!image) return;
            try {
              setUploading(true);
              imageFileId = (await uploadFile(image, "post")).id;
            } catch (error) {
              toast.error("Could not upload image", {
                description: error instanceof Error ? error.message : "Try a smaller JPEG, PNG, WebP, or GIF.",
              });
              return;
            } finally {
              setUploading(false);
            }
          }
          await createPost({
            communityId,
            type: values.type,
            body: values.body?.trim(),
            linkUrl: values.linkUrl?.trim(),
            pollQuestion: values.pollQuestion?.trim(),
            pollOptions: values.type === "poll" ? options : undefined,
            pollClosesAt: values.pollClosesAt || undefined,
            imageFileId,
          });
          form.reset(DEFAULTS);
        })}
        className="frosted-glass-card p-5 space-y-4"
      >
        <FormRadioGroup
          control={form.control}
          name="type"
          label="Post type"
          variant="cards"
          gridCols={4}
          options={[
            { value: "text", label: "Text" },
            { value: "link", label: "Link" },
            { value: "poll", label: "Poll" },
            { value: "image", label: "Image" },
          ]}
        />
        <FormTextarea
          control={form.control}
          name="body"
          label={type === "poll" ? "Context (optional)" : "Write a post"}
          placeholder={
            communityId ? "Share something with this community" : "Share an update with alumni"
          }
        />
        {type === "image" && (
          <FormFileInput
            control={form.control}
            name="image"
            label="Image"
            accept="image/jpeg,image/png,image/webp,image/gif"
            maxSizeBytes={5 * 1024 * 1024}
            description="JPEG, PNG, WebP, or GIF up to 5MB."
          />
        )}
        {type === "link" && (
          <FormInput
            control={form.control}
            name="linkUrl"
            label="Link"
            placeholder="https://example.com"
          />
        )}
        {type === "poll" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="pollQuestion"
              label="Poll question"
              containerClassName="md:col-span-2"
            />
            <FormInput control={form.control} name="option1" label="Option 1" />
            <FormInput control={form.control} name="option2" label="Option 2" />
            <FormInput control={form.control} name="option3" label="Option 3 (optional)" />
            <FormInput control={form.control} name="option4" label="Option 4 (optional)" />
            <FormDatePicker
              control={form.control}
              name="pollClosesAt"
              label="Close date (optional)"
              minDate={new Date().toISOString().slice(0, 10)}
            />
          </div>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={busy}>
            {uploading ? "Uploading…" : creating ? "Publishing…" : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
