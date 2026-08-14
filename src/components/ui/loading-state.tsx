"use client";

import React from "react";

export interface LoadingStateProps {
  message?: string;
  count?: number;
  variant?: "cards" | "rows" | "spinner";
  className?: string;
}

/**
 * Standard Loading State skeleton components with pulse shimmer effects.
 */
export function LoadingState({
  message = "Loading...",
  count = 3,
  variant = "cards",
  className = "",
}: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div
        className={`frosted-glass-card p-12 text-center flex flex-col items-center justify-center space-y-3 ${className}`}
      >
        <div className="size-8 rounded-full border-2 border-[#e5e5e5]/15 border-t-[#6b62f2] animate-spin" />
        <p className="text-xs text-[#c2c2c2] animate-pulse">{message}</p>
      </div>
    );
  }

  if (variant === "rows") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="frosted-glass-card p-4 flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2 flex-1 mr-4">
              <div className="h-4 bg-[#e5e5e5]/10 rounded-md w-1/3" />
              <div className="h-3 bg-[#e5e5e5]/5 rounded-md w-2/3" />
            </div>
            <div className="h-8 w-20 bg-[#e5e5e5]/10 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // "cards" skeleton grid default
  return (
    <div className="space-y-4">
      {message && (
        <div className="text-xs text-[#686868] flex items-center gap-2">
          <div className="size-2 rounded-full bg-[#6b62f2] animate-ping" />
          <span>{message}</span>
        </div>
      )}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="frosted-glass-card p-6 flex flex-col justify-between space-y-4 animate-pulse border border-[#e5e5e5]/8"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 bg-[#e5e5e5]/10 rounded-full w-8" />
                <div className="h-4 bg-[#e5e5e5]/10 rounded-full w-16" />
              </div>
              <div className="h-5 bg-[#e5e5e5]/15 rounded-md w-3/4" />
              <div className="space-y-1.5 pt-1">
                <div className="h-3 bg-[#e5e5e5]/8 rounded-md w-full" />
                <div className="h-3 bg-[#e5e5e5]/8 rounded-md w-5/6" />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#e5e5e5]/8">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-10 bg-[#e5e5e5]/8 rounded-lg" />
                <div className="h-10 bg-[#e5e5e5]/8 rounded-lg" />
                <div className="h-10 bg-[#e5e5e5]/8 rounded-lg" />
              </div>
              <div className="flex justify-between items-center pt-1">
                <div className="h-3 bg-[#e5e5e5]/8 rounded-md w-16" />
                <div className="h-6 w-6 bg-[#e5e5e5]/8 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
