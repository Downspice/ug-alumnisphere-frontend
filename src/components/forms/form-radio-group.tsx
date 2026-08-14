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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  options: RadioOption[];
  containerClassName?: string;
  variant?: "list" | "cards";
  gridCols?: 1 | 2 | 3 | 4;
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  containerClassName,
  variant = "list",
  gridCols = 2,
}: FormRadioGroupProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={(val) => field.onChange(val)}
              className={cn(
                variant === "cards"
                  ? cn(
                      "grid gap-3",
                      gridCols === 1 && "grid-cols-1",
                      gridCols === 2 && "grid-cols-1 sm:grid-cols-2",
                      gridCols === 3 && "grid-cols-1 sm:grid-cols-3",
                      gridCols === 4 && "grid-cols-2 sm:grid-cols-4"
                    )
                  : "flex flex-col space-y-2"
              )}
            >
              {options.map((option) => {
                const isSelected = field.value === option.value;

                if (variant === "cards") {
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:bg-muted/40"
                      )}
                    >
                      <RadioGroupItem value={option.value} className="mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {option.icon && (
                            <span className="text-muted-foreground">{option.icon}</span>
                          )}
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                        {option.description && (
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                }

                return (
                  <FormItem
                    key={option.value}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={option.value} />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer text-sm">
                      {option.label}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
