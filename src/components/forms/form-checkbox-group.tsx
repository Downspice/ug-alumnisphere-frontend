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

export interface CheckboxOption {
  id: string;
  label: string;
  description?: string;
}

export interface FormCheckboxGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  options: CheckboxOption[];
  containerClassName?: string;
  gridCols?: 1 | 2 | 3;
}

export function FormCheckboxGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  containerClassName,
  gridCols = 1,
}: FormCheckboxGroupProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={() => (
        <FormItem className={containerClassName}>
          <div className="mb-2">
            {label && <FormLabel className="text-base">{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>

          <div
            className={cn(
              "gap-3",
              gridCols === 1 && "flex flex-col space-y-2",
              gridCols === 2 && "grid grid-cols-1 sm:grid-cols-2",
              gridCols === 3 && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {options.map((option) => (
              <FormField<TFieldValues, TName>
                key={option.id}
                control={control}
                name={name}
                render={({ field }) => {
                  const values: string[] = Array.isArray(field.value) ? field.value : [];
                  const isChecked = values.includes(option.id);

                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3.5 hover:bg-muted/30 transition-colors"
                    >
                      <FormControl>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...values, option.id])
                              : field.onChange(values.filter((v) => v !== option.id));
                          }}
                        />
                      </FormControl>
                      <div className="space-y-0.5 leading-none">
                        <FormLabel className="cursor-pointer text-sm font-medium">
                          {option.label}
                        </FormLabel>
                        {option.description && (
                          <p className="text-xs text-muted-foreground">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
