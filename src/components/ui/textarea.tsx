import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-[10px] border border-[#e5e5e5]/14 bg-[#161616] p-3 text-sm text-[#ededed] placeholder:text-[#686868] transition-colors outline-none focus-visible:border-[#6b62f2] focus-visible:ring-1 focus-visible:ring-[#6b62f2]/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
