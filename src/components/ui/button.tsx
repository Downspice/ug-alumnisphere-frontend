import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full text-xs font-medium whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default:
          "bg-white text-[#161616] hover:bg-[#ededed] shadow-xs active:scale-[0.98]",
        outline:
          "border border-[#e5e5e5]/15 bg-transparent text-[#ededed] hover:border-[#e5e5e5]/30 hover:bg-white/5 active:scale-[0.98]",
        secondary:
          "bg-[#161616] text-[#ededed] border border-[#e5e5e5]/12 hover:border-[#e5e5e5]/25 hover:bg-[#1f1f1f] active:scale-[0.98]",
        ghost: "text-[#c2c2c2] hover:text-[#ededed] hover:bg-white/5",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300",
        link: "text-white underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-8 gap-1.5 px-4 py-1.5",
        xs: "h-6 gap-1 px-2.5 text-[11px]",
        sm: "h-7 gap-1 px-3 text-xs",
        lg: "h-9 gap-2 px-5 text-sm",
        icon: "size-8 p-0 rounded-full",
        "icon-xs": "size-6 p-0 rounded-full",
        "icon-sm": "size-7 p-0 rounded-full",
        "icon-lg": "size-9 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
