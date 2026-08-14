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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface FormSwitchProps<
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

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  containerClassName,
  variant = "card",
  disabled,
}: FormSwitchProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            variant === "card"
              ? "flex flex-row items-center justify-between rounded-lg border p-4 shadow-2xs"
              : "flex flex-row items-center justify-between",
            containerClassName
          )}
        >
          <div className="space-y-0.5">
            <FormLabel className="text-sm font-medium">{label}</FormLabel>
            {description && (
              <FormDescription className="text-xs text-muted-foreground">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </div>
          <FormControl>
            <Switch
              checked={!!field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
