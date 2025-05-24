
import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  className?: string;
  maxHeight?: number;
  miniatureThreshold?: number;
}

export default function AdaptiveImage({ 
  src, 
  alt, 
  className = '',
  maxHeight = 300,
  miniatureThreshold = 150
}: AdaptiveImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
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
    e.stopPropagation(); // Prevent card flip
    setIsExpanded(!isExpanded);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
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
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ height: maxHeight / 2 }}>
        <div className="animate-pulse w-16 h-16 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative overflow-hidden rounded-lg transition-all duration-300`}
        style={{ 
          maxHeight: displayMode === 'miniature' ? miniatureThreshold : maxHeight 
        }}
        onDoubleClick={handleDoubleClick}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-contain transition-all duration-300"
        />
        
        {/* Corner expand button - only show in miniature mode */}
        {shouldShowMiniature && displayMode === 'miniature' && (
          <button
            onClick={handleToggleSize}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          >
            <ZoomIn className="h-4 w-4 text-gray-700" />
          </button>
        )}
      </div>

      {/* Collapse button for expanded mode */}
      {shouldShowMiniature && isExpanded && (
        <button
          onClick={handleToggleSize}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
        >
          <ZoomOut className="h-4 w-4 text-gray-700" />
        </button>
      )}

      {/* Subtle hint for miniature */}
      {shouldShowMiniature && displayMode === 'miniature' && (
        <div className="text-center mt-1">
          <span className="text-xs text-gray-400">Doppeltipp oder • zum Vergrößern</span>
        </div>
      )}
    </div>
  );
}
