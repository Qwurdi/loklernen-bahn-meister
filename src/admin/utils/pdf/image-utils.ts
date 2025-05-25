
import { ImageDimensions, LoadedImage } from './types';
import { CONTENT_MARGINS } from './constants';

/**
 * Lädt ein Bild von einer URL und konvertiert es zu Base64 mit verbesserter Qualität
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
        
        // Improved image quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0);
        
        // Higher quality JPEG for better print results
        const base64Data = canvas.toDataURL('image/jpeg', 0.92);
        
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
 * Berechnet verfügbaren Platz für Bilder basierend auf Textinhalt (Frageseite)
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
      height: 32, // Etwas mehr Platz für bessere Bildqualität
      startY: CONTENT_MARGINS.y + 12
    };
  } else {
    // Ohne Text kann das Bild mehr Platz nutzen
    return {
      width: maxWidth,
      height: 55, // Größerer Bildbereich ohne Text
      startY: CONTENT_MARGINS.y + 12
    };
  }
}

/**
 * Berechnet verfügbaren Platz für Bilder auf der Antwortseite
 */
export function calculateAnswerImageSpace(): {
  width: number;
  height: number;
  maxHeight: number;
} {
  const maxWidth = CONTENT_MARGINS.width - 6; // Etwas weniger Breite für bessere Proportionen
  
  return {
    width: maxWidth,
    height: 25, // Kompakte Höhe für Antwortseite
    maxHeight: 25
  };
}
