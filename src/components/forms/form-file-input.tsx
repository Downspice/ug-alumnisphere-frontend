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
import { Button } from "@/components/ui/button";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormFileInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control?: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  accept?: string;
  maxSizeBytes?: number;
  containerClassName?: string;
}

export function FormFileInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  accept,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  containerClassName,
}: FormFileInputProps<TFieldValues, TName>) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <FormField<TFieldValues, TName>
      control={control}
      name={name}
      render={({ field }) => {
        const val = field.value as unknown;
        const file =
          val && typeof val === "object" && "name" in val && "size" in val
            ? (val as { name: string; size: number })
            : null;

        const handleFileChange = (newFile: File | null) => {
          if (newFile && newFile.size <= maxSizeBytes) {
            field.onChange(newFile);
          } else if (newFile && newFile.size > maxSizeBytes) {
            alert(`File size exceeds limit (${formatFileSize(maxSizeBytes)})`);
          } else {
            field.onChange(null);
          }
        };

        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
          }
        };

        return (
          <FormItem className={containerClassName}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="w-full">
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {file ? (
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                        <FileIcon className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{file.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleFileChange(null)}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center",
                      dragActive
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30"
                    )}
                  >
                    <UploadCloud className="size-8 text-muted-foreground mb-2" />
                    <p className="text-xs font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {accept ? `Accepted formats: ${accept}` : "All common file formats"}{" "}
                      (Max {formatFileSize(maxSizeBytes)})
                    </p>
                  </div>
                )}
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
