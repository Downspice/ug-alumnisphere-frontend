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
import { cn } from "@/lib/utils";

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, "name" | "defaultValue"> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefixText?: string;
  suffixText?: string;
}

export function FormInput<
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
  type = "text",
  leftIcon,
  rightIcon,
  prefixText,
  suffixText,
  ...props
}: FormInputProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative flex items-center w-full">
              {leftIcon && (
                <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center justify-center [&_svg]:size-4">
                  {leftIcon}
                </div>
              )}
              {prefixText && (
                <span className="inline-flex items-center px-3 text-xs bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground h-9">
                  {prefixText}
                </span>
              )}
              <Input
                {...props}
                {...field}
                type={type}
                placeholder={placeholder}
                className={cn(
                  leftIcon && "pl-9",
                  rightIcon && "pr-9",
                  prefixText && "rounded-l-none",
                  suffixText && "rounded-r-none",
                  className
                )}
                value={field.value ?? ""}
                onChange={(e) => {
                  if (type === "number") {
                    const val = e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(val);
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
              />
              {suffixText && (
                <span className="inline-flex items-center px-3 text-xs bg-muted border border-l-0 border-input rounded-r-md text-muted-foreground h-9">
                  {suffixText}
                </span>
              )}
              {rightIcon && (
                <div className="absolute right-3 text-muted-foreground pointer-events-none flex items-center justify-center [&_svg]:size-4">
                  {rightIcon}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
