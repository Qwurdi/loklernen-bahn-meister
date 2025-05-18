
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function MobileLoadingState() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-loklernen-ultramarine mx-auto" />
        <p className="text-white mt-4">Karteikarten werden geladen...</p>
      </div>
    </div>
  );
}
