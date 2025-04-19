
import * as React from "react"
import { cn } from "@/lib/utils"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn(
        "flex w-full flex-col gap-4 p-4 border-t group-data-[collapsible=icon]:items-center",
        className
      )}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"
