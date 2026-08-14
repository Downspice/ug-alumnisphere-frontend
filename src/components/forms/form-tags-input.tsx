"use client";

import * as React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormTagsInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  maxTags?: number;
  containerClassName?: string;
}

export function FormTagsInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Type tag & press Enter...",
  maxTags = 10,
  containerClassName,
}: FormTagsInputProps<TFieldValues, TName>) {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => {
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        const addTag = () => {
          const trimmed = inputValue.trim();
          if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
            field.onChange([...tags, trimmed]);
            setInputValue("");
          }
        };

        const removeTag = (tagToRemove: string) => {
          field.onChange(tags.filter((t) => t !== tagToRemove));
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
          } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
          }
        };

        return (
          <FormItem className={containerClassName}>
            <div className="flex items-center justify-between">
              {label && <FormLabel>{label}</FormLabel>}
              <span className="text-[11px] text-muted-foreground">
                {tags.length} / {maxTags} tags
              </span>
            </div>
            <FormControl>
              <div className="min-h-[42px] w-full rounded-md border border-input bg-background p-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 flex flex-wrap gap-1.5 items-center">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs py-0.5"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                      tabIndex={-1}
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}

                {tags.length < maxTags && (
                  <div className="flex items-center flex-1 min-w-[120px]">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={addTag}
                      placeholder={tags.length === 0 ? placeholder : "Add more..."}
                      className="w-full bg-transparent text-sm outline-none px-1 placeholder:text-muted-foreground"
                    />
                    {inputValue && (
                      <button
                        type="button"
                        onClick={addTag}
                        className="text-primary hover:text-primary/80 text-xs flex items-center shrink-0 pr-1"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
