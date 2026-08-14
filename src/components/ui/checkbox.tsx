"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-[#e5e5e5]/20 bg-[#161616] transition-colors outline-none focus-visible:border-[#6b62f2] focus-visible:ring-1 focus-visible:ring-[#6b62f2]/40 disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-white data-checked:bg-white data-checked:text-[#161616]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3"
      >
        <CheckIcon strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
