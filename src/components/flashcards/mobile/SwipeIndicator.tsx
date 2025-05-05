
import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SwipeIndicatorProps {
  dragDelta: number;
  swipeThreshold: number;
}

export default function SwipeIndicator({ dragDelta, swipeThreshold }: SwipeIndicatorProps) {
  // Show the indicator as soon as there is any drag
  const opacity = Math.min(Math.abs(dragDelta) / swipeThreshold, 1);
  const showIndicator = dragDelta !== 0; // Show with any movement
  
  if (!showIndicator) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div 
        className={`text-sm font-medium flex items-center gap-1 ${
          opacity < 0.3 ? 'opacity-30' : 'opacity-80'
        } ${
          dragDelta > 0 ? 'text-green-600' : 'text-red-500'
        } bg-white/90 px-4 py-1.5 rounded-full shadow-sm`}
        style={{ 
          transform: `scale(${0.8 + (opacity * 0.2)})`,
          transition: 'transform 0.2s, opacity 0.2s'
        }}
      >
        {dragDelta > 0 ? (
          <>
            <span className="text-xs">Gewusst</span>
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          <>
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs">Nicht gewusst</span>
          </>
        )}
      </div>
    </div>
  );
}
