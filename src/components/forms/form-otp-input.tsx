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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export interface FormOtpInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  maxLength?: number;
  containerClassName?: string;
}

export function FormOtpInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  maxLength = 6,
  containerClassName,
}: FormOtpInputProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputOTP
              maxLength={maxLength}
              value={field.value ?? ""}
              onChange={(value) => field.onChange(value)}
            >
              <InputOTPGroup>
                {Array.from({ length: maxLength }, (_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
