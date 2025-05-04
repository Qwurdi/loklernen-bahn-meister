
import React, { useState } from 'react';
import { Maximize } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ZoomableImageProps {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
  aspectRatio?: number;
}

export default function ZoomableImage({
  src,
  alt,
  containerClassName = 'w-full max-w-[200px] mx-auto',
  imageClassName = 'w-full h-full object-contain p-2',
  aspectRatio = 1
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className={`relative group ${containerClassName}`}>
      <AspectRatio ratio={aspectRatio} className="bg-gray-50 rounded-lg overflow-hidden">
        <img src={src} alt={alt} className={imageClassName} />
        
        <Button 
          size="icon" 
          variant="outline"
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 border-gray-300 shadow-sm"
          onClick={() => setIsZoomed(true)}
        >
          <Maximize className="h-4 w-4 text-gray-700" />
          <span className="sr-only">Vergrößern</span>
        </Button>
      </AspectRatio>

      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogPortal>
          <DialogOverlay className="backdrop-blur-sm" />
          <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 flex items-center justify-center bg-black/90 border-none">
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                src={src} 
                alt={alt} 
                className="max-w-full max-h-full object-contain" 
                onClick={() => setIsZoomed(false)}
              />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
