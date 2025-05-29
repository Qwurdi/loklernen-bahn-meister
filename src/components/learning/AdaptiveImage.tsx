
import React from 'react';

interface AdaptiveImageProps {
  src: string;
  alt: string;
  maxHeight: number;
  miniatureThreshold: number;
  className?: string;
  showOnAnswerSide?: boolean;
}

export default function AdaptiveImage({
  src,
  alt,
  maxHeight,
  miniatureThreshold,
  className = '',
  showOnAnswerSide = false
}: AdaptiveImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      style={{ maxHeight: `${maxHeight}px` }}
    />
  );
}
