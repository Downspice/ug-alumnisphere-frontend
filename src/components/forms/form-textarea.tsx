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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Textarea>, "name" | "defaultValue"> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  containerClassName?: string;
  showCount?: boolean;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder,
  className,
  containerClassName,
  maxLength,
  showCount = false,
  ...props
}: FormTextareaProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => {
        const currentLength = (field.value || "").length;

        return (
          <FormItem className={containerClassName}>
            <div className="flex items-center justify-between">
              {label && <FormLabel>{label}</FormLabel>}
              {showCount && maxLength && (
                <span className="text-[11px] text-muted-foreground">
                  {currentLength} / {maxLength}
                </span>
              )}
            </div>
            <FormControl>
              <Textarea
                {...props}
                {...field}
                maxLength={maxLength}
                placeholder={placeholder}
                className={cn("min-h-[80px]", className)}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
