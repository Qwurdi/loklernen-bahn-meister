
import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  className?: string;
  maxHeight?: number;
  miniatureThreshold?: number;
  showOnAnswerSide?: boolean;
}

export default function AdaptiveImage({ 
  src, 
  alt, 
  className = '',
  maxHeight = 300,
  miniatureThreshold = 150,
  showOnAnswerSide = false
}: AdaptiveImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
    };
    img.src = src;
  }, [src]);

  const shouldShowMiniature = imageDimensions && imageDimensions.height > miniatureThreshold;
  const displayMode = shouldShowMiniature && !isExpanded ? 'miniature' : 'full';

  const handleToggleSize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card flip
    setIsExpanded(!isExpanded);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleZoom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card flip
    setIsZoomed(true);
    
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent card flip
    if (shouldShowMiniature) {
      setIsExpanded(!isExpanded);
      
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height: 100 }}>
        <div className="animate-pulse w-16 h-16 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <div 
          className="relative overflow-hidden rounded-lg transition-all duration-300 group"
          onDoubleClick={handleDoubleClick}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`w-full object-contain transition-all duration-300 ${
              displayMode === 'miniature' 
                ? `max-h-[${miniatureThreshold}px]` 
                : `max-h-[${isExpanded ? 'calc(100vh - 200px)' : maxHeight + 'px'}]`
            }`}
            style={{
              maxHeight: displayMode === 'miniature' 
                ? miniatureThreshold 
                : isExpanded 
                  ? 'calc(100vh - 200px)' 
                  : maxHeight
            }}
          />
          
          {/* Control buttons overlay */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Zoom button */}
            <button
              onClick={handleZoom}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
            >
              <Maximize2 className="h-4 w-4 text-gray-700" />
            </button>
            
            {/* Expand/collapse button - only in miniature mode */}
            {shouldShowMiniature && (
              <button
                onClick={handleToggleSize}
                className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
              >
                {displayMode === 'miniature' ? (
                  <ZoomIn className="h-4 w-4 text-gray-700" />
                ) : (
                  <ZoomOut className="h-4 w-4 text-gray-700" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Subtle hint for interaction */}
        {shouldShowMiniature && displayMode === 'miniature' && (
          <div className="text-center mt-1">
            <span className="text-xs text-gray-400">Doppeltipp oder • zum Vergrößern</span>
          </div>
        )}
      </div>

      {/* Full-screen zoom dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogPortal>
          <DialogOverlay className="backdrop-blur-sm bg-black/80" />
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 flex items-center justify-center bg-transparent border-none shadow-none">
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
    </>
  );
}
