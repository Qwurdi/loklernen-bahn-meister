
import React from 'react';
import { Check, X } from 'lucide-react';

interface MobileActionButtonsProps {
  onKnown: () => void;
  onNotKnown: () => void;
}

export default function MobileActionButtons({ onKnown, onNotKnown }: MobileActionButtonsProps) {
  return (
    <div className="flex justify-center items-center gap-8 py-2">
      <button 
        onClick={onNotKnown} 
        className="w-14 h-14 rounded-full bg-white border-2 border-red-200 shadow-md flex items-center justify-center"
        aria-label="Nicht gewusst"
      >
        <X className="h-6 w-6 text-red-500" />
      </button>
      
      <button 
        onClick={onKnown} 
        className="w-14 h-14 rounded-full bg-white border-2 border-green-200 shadow-md flex items-center justify-center"
        aria-label="Gewusst"
      >
        <Check className="h-6 w-6 text-green-500" />
      </button>
    </div>
  );
}
