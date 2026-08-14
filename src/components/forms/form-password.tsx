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
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormPasswordProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, "name" | "defaultValue" | "type"> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  containerClassName?: string;
  showLockIcon?: boolean;
}

export function FormPassword<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = "••••••••",
  className,
  containerClassName,
  showLockIcon = true,
  ...props
}: FormPasswordProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative flex items-center w-full">
              {showLockIcon && (
                <div className="absolute left-3 text-muted-foreground pointer-events-none flex items-center justify-center">
                  <Lock className="size-4" />
                </div>
              )}
              <Input
                {...props}
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className={cn(showLockIcon && "pl-9", "pr-10", className)}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
