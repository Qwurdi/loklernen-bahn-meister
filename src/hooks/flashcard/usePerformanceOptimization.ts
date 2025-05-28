
import { useEffect, useRef, useCallback } from 'react';
import { Question } from '@/types/questions';

interface UsePerformanceOptimizationProps {
  questions: Question[];
  currentIndex: number;
  preloadCount?: number;
}

export function usePerformanceOptimization({
  questions,
  currentIndex,
  preloadCount = 3
}: UsePerformanceOptimizationProps) {
  const preloadedImages = useRef<Set<string>>(new Set());
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Preload images for smooth transitions
  const preloadImages = useCallback(async (startIndex: number, count: number) => {
    const promises: Promise<void>[] = [];
    
    for (let i = 0; i < count; i++) {
      const index = startIndex + i;
      if (index >= questions.length) break;
      
      const question = questions[index];
      if (!question?.image_url || preloadedImages.current.has(question.image_url)) {
        continue;
      }

      const promise = new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          imageCache.current.set(question.image_url!, img);
          preloadedImages.current.add(question.image_url!);
          resolve();
        };
        img.onerror = () => resolve(); // Don't fail on image errors
        img.src = question.image_url!;
      });
      
      promises.push(promise);
    }

    await Promise.allSettled(promises);
  }, [questions]);

  // Preload images when current index changes
  useEffect(() => {
    preloadImages(currentIndex + 1, preloadCount);
  }, [currentIndex, preloadImages, preloadCount]);

  // Initial preload
  useEffect(() => {
    preloadImages(0, Math.min(preloadCount, questions.length));
  }, [questions, preloadImages, preloadCount]);

  // Cleanup unused images from cache
  const cleanupCache = useCallback(() => {
    const activeUrls = new Set(
      questions
        .slice(Math.max(0, currentIndex - 2), currentIndex + preloadCount + 2)
        .map(q => q.image_url)
        .filter(Boolean)
    );

    for (const [url] of imageCache.current) {
      if (!activeUrls.has(url)) {
        imageCache.current.delete(url);
        preloadedImages.current.delete(url);
      }
    }
  }, [questions, currentIndex, preloadCount]);

  // Cleanup cache periodically
  useEffect(() => {
    const interval = setInterval(cleanupCache, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [cleanupCache]);

  // Get preloaded image if available
  const getPreloadedImage = useCallback((url: string): HTMLImageElement | null => {
    return imageCache.current.get(url) || null;
  }, []);

  return {
    preloadImages,
    getPreloadedImage,
    isImagePreloaded: (url: string) => preloadedImages.current.has(url),
    cacheSize: imageCache.current.size
  };
}
