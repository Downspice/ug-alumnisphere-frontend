import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-[10px] border border-[#e5e5e5]/14 bg-[#161616] px-3 py-1.5 text-sm text-[#ededed] placeholder:text-[#686868] transition-colors outline-none focus-visible:border-[#6b62f2] focus-visible:ring-1 focus-visible:ring-[#6b62f2]/40 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
