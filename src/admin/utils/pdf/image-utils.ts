
import { ImageDimensions, LoadedImage } from './types';

/**
 * Professional image loading with enhanced quality for print
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
        
        // High resolution for print quality
        const scale = Math.min(2, Math.max(1, 1200 / Math.max(img.naturalWidth, img.naturalHeight)));
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        
        // Premium image quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        // High quality JPEG for print (95% quality)
        const base64Data = canvas.toDataURL('image/jpeg', 0.95);
        
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
 * Professional image dimension calculation with optimal fitting
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
  
  // Calculate optimal size maintaining aspect ratio
  let width = availableWidth;
  let height = width / aspectRatio;
  
  // If height exceeds available space, constrain by height
  if (height > availableHeight) {
    height = availableHeight;
    width = height * aspectRatio;
  }
  
  // Center the image in available space
  const x = startX + (availableWidth - width) / 2;
  const y = startY + (availableHeight - height) / 2;
  
  return { x, y, width, height };
}

/**
 * Professional placeholder for missing images
 */
export function drawImagePlaceholder(
  pdf: any,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Professional placeholder with subtle styling
  pdf.setDrawColor(200, 200, 200);
  pdf.setFillColor(248, 248, 248);
  pdf.setLineWidth(0.1);
  pdf.roundedRect(x, y, width, height, 2, 2, 'FD');
  
  // Subtle "Image not available" text
  pdf.setFontSize(6);
  pdf.setTextColor(160, 160, 160);
  pdf.setFont('helvetica', 'italic');
  const text = 'Bild nicht verfügbar';
  const textWidth = pdf.getTextWidth(text);
  pdf.text(text, x + (width - textWidth) / 2, y + height / 2 + 1);
}
