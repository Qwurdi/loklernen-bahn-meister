
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
        className={`text-2xl font-bold flex items-center gap-2 ${
          opacity < 0.3 ? 'opacity-30' : 'opacity-90'
        } ${
          dragDelta > 0 ? 'text-green-600' : 'text-red-500'
        } bg-white/90 px-6 py-3 rounded-full shadow-md`}
        style={{ 
          transform: `scale(${0.8 + (opacity * 0.2)})`,
          transition: 'transform 0.2s, opacity 0.2s'
        }}
      >
        {dragDelta > 0 ? (
          <>
            <span>Gewusst</span>
            <ArrowRight className="h-5 w-5" />
          </>
        ) : (
          <>
            <ArrowLeft className="h-5 w-5" />
            <span>Nicht gewusst</span>
          </>
        )}
      </div>
    </div>
  );
}
