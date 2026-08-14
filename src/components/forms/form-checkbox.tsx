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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  containerClassName?: string;
  variant?: "default" | "card";
  disabled?: boolean;
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  containerClassName,
  variant = "default",
  disabled,
}: FormCheckboxProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            variant === "card"
              ? "flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 shadow-2xs hover:bg-muted/40 transition-colors"
              : "flex flex-row items-start space-x-3 space-y-0",
            containerClassName
          )}
        >
          <FormControl>
            <Checkbox
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer font-medium text-sm">{label}</FormLabel>
            {description && (
              <FormDescription className="text-xs text-muted-foreground">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
