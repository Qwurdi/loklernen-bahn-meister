
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useImagePaste = (handlePastedImage?: (file: File) => void) => {
  // Handle paste events for the entire component
  useEffect(() => {
    if (!handlePastedImage) return;
    
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              e.preventDefault();
              handlePastedImage(file);
              toast.success("Bild aus der Zwischenablage eingefügt");
              return;
            }
          }
        }
      }
    };
    
    // Add the event listener to the document
    document.addEventListener('paste', handlePaste);
    
    // Clean up
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePastedImage]);
};
