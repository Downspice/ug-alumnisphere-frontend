import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-0.5 text-[11px] font-normal whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[#e5e5e5]/15 bg-white/10 text-[#ededed]",
        secondary: "border-[#e5e5e5]/12 bg-[#161616] text-[#c2c2c2]",
        outline: "border-[#e5e5e5]/15 bg-transparent text-[#ededed]",
        destructive: "border-red-500/20 bg-red-500/10 text-red-400",
        ghost: "border-transparent bg-transparent text-[#c2c2c2] hover:text-[#ededed]",
        link: "text-white underline-offset-4 hover:underline border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
