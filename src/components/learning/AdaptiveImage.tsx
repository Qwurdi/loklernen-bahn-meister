
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
  miniatureThreshold = 200
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

  const handleToggleSize = () => {
    setIsExpanded(!isExpanded);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
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
        className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
          displayMode === 'miniature' ? 'cursor-pointer' : ''
        }`}
        style={{ 
          maxHeight: displayMode === 'miniature' ? miniatureThreshold : maxHeight 
        }}
        onClick={displayMode === 'miniature' ? handleToggleSize : undefined}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-full object-contain transition-all duration-300 ${
            displayMode === 'miniature' ? 'object-cover' : 'object-contain'
          }`}
        />
        
        {/* Miniature overlay */}
        {displayMode === 'miniature' && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-2">
              <ZoomIn className="h-6 w-6 text-gray-700" />
            </div>
          </div>
        )}
      </div>

      {/* Expand/collapse button for full mode */}
      {shouldShowMiniature && isExpanded && (
        <button
          onClick={handleToggleSize}
          className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-2 shadow-md transition-opacity"
        >
          <ZoomOut className="h-5 w-5 text-gray-700" />
        </button>
      )}

      {/* Tap hint for miniature */}
      {displayMode === 'miniature' && (
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">Tippe zum Vergrößern</span>
        </div>
      )}
    </div>
  );
}
