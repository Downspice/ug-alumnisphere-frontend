"use client";

import React from "react";
import { LottiePlayer } from "./lottie-player";
import { Button } from "./button";
import { AlertTriangle, RotateCw } from "lucide-react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Standard Error State component with animated indicator, error details, and retry CTA.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try Again",
  className = "",
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={`frosted-glass-card ${
        compact ? "p-6" : "p-10 sm:p-12"
      } text-center flex flex-col items-center justify-center space-y-4 border border-rose-500/20 bg-rose-500/[0.02] ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <LottiePlayer preset="error" size={compact ? 80 : 110} />
        <div className="absolute p-2 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-xs">
          <AlertTriangle className="size-4" />
        </div>
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h4 className="text-base font-medium text-rose-300 tracking-tight">{title}</h4>
        <p className="text-xs text-[#c2c2c2] leading-relaxed font-mono bg-black/30 p-2.5 rounded-lg border border-[#e5e5e5]/8 text-left break-all">
          {message}
        </p>
      </div>

      {onRetry && (
        <div className="pt-2">
          <Button
            type="button"
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="rounded-full px-5 text-xs font-medium border-[#e5e5e5]/20 hover:border-[#e5e5e5]/40 text-[#ededed] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="size-3" />
            <span>{retryLabel}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
