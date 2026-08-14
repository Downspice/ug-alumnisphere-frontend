"use client";

import React from "react";
import { LottiePlayer, BUILTIN_ANIMATIONS } from "./lottie-player";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionElement?: React.ReactNode;
  icon?: LucideIcon;
  presetAnimation?: keyof typeof BUILTIN_ANIMATIONS;
  animationData?: object;
  animationSize?: number;
  className?: string;
  compact?: boolean;
}

/**
 * Standard Empty State component featuring dynamic Lottie vector animations,
 * supportive contextual messaging underneath, and action CTA.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionElement,
  icon: Icon,
  presetAnimation = "empty",
  animationData,
  animationSize = 130,
  className = "",
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={`frosted-glass-card ${
        compact ? "p-6" : "p-10 sm:p-12"
      } text-center flex flex-col items-center justify-center space-y-4 border border-[#e5e5e5]/12 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <LottiePlayer
          preset={presetAnimation}
          animationData={animationData}
          size={compact ? 90 : animationSize}
        />
        {Icon && (
          <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-[#161616] border border-[#e5e5e5]/20 text-[#c2c2c2] shadow-xs">
            <Icon className="size-3.5" />
          </div>
        )}
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h4 className="text-base font-medium text-[#ededed] tracking-tight">{title}</h4>
        <p className="text-xs text-[#c2c2c2] leading-relaxed">{description}</p>
      </div>

      {(actionElement || (actionLabel && onAction)) && (
        <div className="pt-2">
          {actionElement ? (
            actionElement
          ) : (
            <Button
              type="button"
              onClick={onAction}
              variant="default"
              size="sm"
              className="rounded-full px-5 text-xs font-medium bg-white text-[#161616] hover:bg-[#ededed] shadow-xs cursor-pointer"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
