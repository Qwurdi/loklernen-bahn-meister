
import * as React from "react"
import { cn } from "@/lib/utils"

const Toolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex items-center gap-1 rounded-md bg-white p-1",
      className
    )}
    {...props}
    ref={ref}
  />
))
Toolbar.displayName = "Toolbar"

export { Toolbar }
