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
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormRatingProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  maxStars?: number;
  containerClassName?: string;
}

export function FormRating<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  maxStars = 5,
  containerClassName,
}: FormRatingProps<TFieldValues, TName>) {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => {
        const currentRating = typeof field.value === "number" ? field.value : 0;
        const displayRating = hoverRating !== null ? hoverRating : currentRating;

        return (
          <FormItem className={containerClassName}>
            <div className="flex items-center justify-between">
              {label && <FormLabel>{label}</FormLabel>}
              {currentRating > 0 && (
                <span className="text-xs font-semibold text-amber-500">
                  {currentRating} of {maxStars} stars
                </span>
              )}
            </div>
            <FormControl>
              <div
                className="flex items-center gap-1 py-1"
                onMouseLeave={() => setHoverRating(null)}
              >
                {Array.from({ length: maxStars }, (_, i) => {
                  const starValue = i + 1;
                  const isFilled = starValue <= displayRating;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => field.onChange(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      className="p-1 rounded-md transition-transform hover:scale-110 focus:outline-hidden focus:ring-1 focus:ring-ring"
                      tabIndex={0}
                      aria-label={`Rate ${starValue} of ${maxStars}`}
                    >
                      <Star
                        className={cn(
                          "size-6 transition-colors",
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
