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
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export interface FormSliderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  showValueBadge?: boolean;
  containerClassName?: string;
}

export function FormSlider<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  showValueBadge = true,
  containerClassName,
}: FormSliderProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => {
        const val = typeof field.value === "number" ? field.value : min;

        return (
          <FormItem className={containerClassName}>
            <div className="flex items-center justify-between mb-1">
              {label && <FormLabel>{label}</FormLabel>}
              {showValueBadge && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {val}
                  {unit ? ` ${unit}` : ""}
                </Badge>
              )}
            </div>
            <FormControl>
              <Slider
                min={min}
                max={max}
                step={step}
                value={[val]}
                onValueChange={(values) => {
                  if (Array.isArray(values) && values.length > 0) {
                    field.onChange(values[0]);
                  }
                }}
              />
            </FormControl>
            <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
              <span>
                {min}
                {unit}
              </span>
              <span>
                {max}
                {unit}
              </span>
            </div>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
