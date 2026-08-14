"use client";

import React, { useState, KeyboardEvent } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface FormTagsInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
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
  placeholder = "Add a tag and press Enter...",
  maxTags = 10,
  containerClassName,
}: FormTagsInputProps<TFieldValues, TName>) {
  const [inputValue, setInputValue] = useState("");

  return (
    <FormField
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
          field.onChange(tags.filter((tag) => tag !== tagToRemove));
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
              <span className="text-[11px] text-[#686868]">
                {tags.length} / {maxTags} tags
              </span>
            </div>
            <FormControl>
              <div className="min-h-[42px] w-full rounded-[10px] border border-[#e5e5e5]/14 bg-[#161616] p-1.5 focus-within:border-[#6b62f2] focus-within:ring-1 focus-within:ring-[#6b62f2]/40 flex flex-wrap gap-1.5 items-center">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pr-1 text-xs py-0.5"
                  >
                    <span>{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeTag(tag)}
                      className="size-4 p-0 hover:bg-white/20"
                      tabIndex={-1}
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="size-2.5" />
                    </Button>
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
                      className="w-full bg-transparent text-sm text-[#ededed] outline-none px-1 placeholder:text-[#686868]"
                    />
                    {inputValue && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={addTag}
                        className="text-white hover:text-white/80 p-0 size-5 shrink-0"
                      >
                        <Plus className="size-3.5" />
                      </Button>
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
