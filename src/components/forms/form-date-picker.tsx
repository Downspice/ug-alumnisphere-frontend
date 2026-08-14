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
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  containerClassName?: string;
  className?: string;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "Select date",
  minDate,
  maxDate,
  containerClassName,
  className,
}: FormDatePickerProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center justify-center">
                <Calendar className="size-4" />
              </div>
              <Input
                type="date"
                min={minDate}
                max={maxDate}
                placeholder={placeholder}
                className={cn("pl-9", className)}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
