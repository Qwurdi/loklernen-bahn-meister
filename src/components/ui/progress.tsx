
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { 
    indicatorClassName?: string;
    showValue?: boolean;
    valueFormat?: (value: number) => string;
  }
>(({ className, value, indicatorClassName, showValue, valueFormat, ...props }, ref) => {
  const displayValue = value || 0;
  const formattedValue = valueFormat ? valueFormat(displayValue) : `${displayValue}%`;
  
  return (
    <div className="relative w-full">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full w-full flex-1 bg-primary transition-all", indicatorClassName)}
          style={{ transform: `translateX(-${100 - displayValue}%)` }}
        />
      </ProgressPrimitive.Root>
      
      {showValue && (
        <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-medium text-white">
          {formattedValue}
        </span>
      )}
    </div>
  );
})

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
