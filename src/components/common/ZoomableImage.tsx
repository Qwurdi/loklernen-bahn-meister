
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, X } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  containerClassName?: string;
}

export default function ZoomableImage({ 
  src, 
  alt, 
  containerClassName = ''
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const constraintsRef = useRef<HTMLDivElement>(null);
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  };
  
  const toggleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };
  
  const closeZoom = () => {
    setIsZoomed(false);
  };
  
  // Error placeholder
  if (isError) {
    return (
      <div className={`flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 ${containerClassName}`}>
        <p className="text-xs text-gray-500">Bild konnte nicht geladen werden</p>
      </div>
    );
  }
  
  // Standard view
  if (!isZoomed) {
    return (
      <div className={`relative ${containerClassName}`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="w-8 h-8 border-4 border-t-loklernen-ultramarine border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-auto rounded-lg ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <button 
          onClick={toggleZoom}
          className="absolute bottom-2 right-2 bg-gray-800/70 text-white p-1.5 rounded-full hover:bg-gray-900/70 transition-colors"
          aria-label="Bild vergrößern"
        >
          <ZoomIn size={16} />
        </button>
      </div>
    );
  }
  
  // Zoomed view with modal
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeZoom} ref={constraintsRef}>
      <motion.div 
        className="relative w-full h-full flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div 
          className="relative"
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
        >
          <img 
            src={src} 
            alt={alt} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
          <button 
            onClick={toggleZoom}
            className="absolute bottom-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Bild verkleinern"
          >
            <ZoomOut size={20} />
          </button>
          <button 
            onClick={closeZoom}
            className="absolute top-4 right-4 bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Schließen"
          >
            <X size={20} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
