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
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PALETTES = [
  "#3b82f6", // Blue
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#64748b", // Slate
];

export interface FormColorPickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  palette?: string[];
  containerClassName?: string;
}

export function FormColorPicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  palette = DEFAULT_PALETTES,
  containerClassName,
}: FormColorPickerProps<TFieldValues, TName>) {
  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => {
        const currentColor = field.value || palette[0];

        return (
          <FormItem className={containerClassName}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                {/* Palette Swatches */}
                <div className="flex flex-wrap gap-2 items-center">
                  {palette.map((color) => {
                    const isSelected = currentColor.toLowerCase() === color.toLowerCase();

                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        style={{ backgroundColor: color }}
                        className={cn(
                          "size-7 rounded-full transition-transform hover:scale-110 flex items-center justify-center shadow-2xs border border-white/20",
                          isSelected && "ring-2 ring-primary ring-offset-2 scale-110"
                        )}
                        tabIndex={0}
                        aria-label={`Select color ${color}`}
                      >
                        {isSelected && (
                          <Check className="size-3.5 text-white drop-shadow-xs" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="flex items-center gap-2 max-w-[200px]">
                  <input
                    type="color"
                    value={currentColor}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="size-8 rounded border border-input cursor-pointer bg-transparent p-0.5"
                  />
                  <Input
                    type="text"
                    value={currentColor}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="#3b82f6"
                    className="h-8 font-mono text-xs uppercase"
                    maxLength={7}
                  />
                </div>
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
