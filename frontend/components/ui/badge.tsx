import * as React from "react";
import { cn } from "@/lib/cn";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-wine-500 px-3 py-1 text-xs font-semibold text-white",
        className
      )}
      {...props}
    />
  );
}
