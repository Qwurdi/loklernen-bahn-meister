
import { useState, useEffect, useRef } from 'react';
import { Question } from '@/types/questions';

/**
 * Custom hook for efficiently preloading images for flashcards
 */
export function useImagePreloader(
  questions: Question[],
  currentIndex: number
) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const animationTimeoutRef = useRef<number | null>(null);
  
  // Preload the next few images
  useEffect(() => {
    // New queue system to load images sequentially
    const imageQueue: string[] = [];
    
    // Track which images have already been loaded
    const loadImage = (url: string) => {
      // Skip if already loaded or no URL
      if (!url || loadedImages.has(url)) return;
      
      // Add to queue
      imageQueue.push(url);
    };
    
    // Process queue one by one to avoid overwhelming the browser
    const processQueue = () => {
      if (imageQueue.length === 0) return;
      
      const url = imageQueue.shift()!;
      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(url));
        // Process next image after a small delay
        setTimeout(processQueue, 100);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        // Continue with next image even if this one failed
        setTimeout(processQueue, 100);
      };
      
      img.src = url;
    };
    
    // Queue current and next 3 cards' images (if they exist)
    for (let i = 0; i < 4; i++) {
      const preloadIndex = currentIndex + i;
      if (preloadIndex < questions.length) {
        const question = questions[preloadIndex];
        if (question.image_url) {
          loadImage(question.image_url);
        }
      }
    }
    
    // Start processing the queue
    if (imageQueue.length > 0) {
      processQueue();
    }
    
    // Cleanup any pending operations
    return () => {
      // Clear any timeouts if component unmounts
      if (animationTimeoutRef.current !== null) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [currentIndex, questions, loadedImages]);

  return {
    loadedImages,
    animationTimeoutRef
  };
}
