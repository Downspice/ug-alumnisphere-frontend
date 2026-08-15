"use client";

import * as React from "react";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useIsClient } from "@/hooks/use-is-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactElement;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  className,
  contentClassName,
}: ResponsiveModalProps) {
  const isDesktop = useIsDesktop();
  const mounted = useIsClient();

  // Avoid SSR hydration mismatch by rendering a stable structure initially
  if (!mounted) {
    if (!trigger) return null;
    return trigger;
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger render={trigger} />}
        <DialogContent
          className={cn(
            "sm:max-w-lg bg-[#161616] border border-[#e5e5e5]/14 rounded-[24px] p-6 shadow-2xl backdrop-blur-xl text-[#ededed]",
            className
          )}
        >
          {(title || description) && (
            <DialogHeader className="space-y-1">
              {title && (
                <DialogTitle className="text-lg font-medium text-[#ededed]">
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription className="text-xs text-[#c2c2c2]">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>
          )}
          <div className={cn("max-h-[75vh] overflow-y-auto pr-1 py-2", contentClassName)}>
            {children}
          </div>
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      {trigger && <DrawerTrigger render={trigger} />}
      <DrawerContent
        className={cn(
          "px-5 pb-6 max-h-[85vh] bg-[#161616] border-t border-[#e5e5e5]/14 rounded-t-[24px] text-[#ededed]",
          className
        )}
      >
        {(title || description) && (
          <DrawerHeader className="text-left px-0 pb-2 space-y-1">
            {title && (
              <DrawerTitle className="text-lg font-medium text-[#ededed]">
                {title}
              </DrawerTitle>
            )}
            {description && (
              <DrawerDescription className="text-xs text-[#c2c2c2]">
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className={cn("overflow-y-auto px-0 py-2", contentClassName)}>
          {children}
        </div>
        {footer && <DrawerFooter className="px-0 pt-3">{footer}</DrawerFooter>}
      </DrawerContent>
    </Drawer>
  );
}
