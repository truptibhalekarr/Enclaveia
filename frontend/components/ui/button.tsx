import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(122,23,57,0.36)] active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-wine-500 text-white shadow-line hover:bg-wine-600",
        secondary: "border border-wine-500/20 bg-blush-50 text-wine-700 hover:bg-blush-100",
        ghost: "text-wine-700 hover:bg-wine-500/10",
        outline: "border border-wine-500/25 bg-transparent text-wine-700 hover:bg-blush-50"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 px-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
