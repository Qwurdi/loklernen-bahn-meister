
import { ImageDimensions, LoadedImage } from './types';
import { CONTENT_MARGINS } from './constants';

/**
 * Lädt ein Bild von einer URL und konvertiert es zu Base64
 */
export async function loadImageFromUrl(url: string): Promise<LoadedImage> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        const base64Data = canvas.toDataURL('image/jpeg', 0.8);
        
        resolve({
          data: base64Data,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight
        });
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(blob);
    });
  } catch (error) {
    console.error('Error loading image:', error);
    throw error;
  }
}

/**
 * Berechnet optimale Bildabmessungen für die Karte
 */
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  availableWidth: number,
  availableHeight: number,
  startX: number,
  startY: number
): ImageDimensions {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = availableWidth;
  let height = width / aspectRatio;
  
  // Wenn das Bild zu hoch wird, limitiere die Höhe
  if (height > availableHeight) {
    height = availableHeight;
    width = height * aspectRatio;
  }
  
  // Zentriere das Bild horizontal
  const x = startX + (availableWidth - width) / 2;
  const y = startY;
  
  return { x, y, width, height };
}

/**
 * Berechnet verfügbaren Platz für Bilder basierend auf Textinhalt
 */
export function calculateAvailableImageSpace(hasText: boolean): {
  width: number;
  height: number;
  startY: number;
} {
  const maxWidth = CONTENT_MARGINS.width - 4;
  
  if (hasText) {
    // Wenn Text vorhanden ist, reserviere Platz dafür
    return {
      width: maxWidth,
      height: 30, // 30mm für Bild, Rest für Text
      startY: CONTENT_MARGINS.y + 15
    };
  } else {
    // Ohne Text kann das Bild mehr Platz nutzen
    return {
      width: maxWidth,
      height: 50, // 50mm für Bild
      startY: CONTENT_MARGINS.y + 15
    };
  }
}
