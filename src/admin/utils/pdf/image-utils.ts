
import { ImageDimensions, LoadedImage } from './types';

/**
 * Enhanced professional image loading with higher quality for print
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
        
        // Higher resolution for premium print quality
        const scale = Math.min(3, Math.max(1.5, 1500 / Math.max(img.naturalWidth, img.naturalHeight)));
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        
        // Enhanced premium image quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        
        // Higher quality JPEG for print (98% quality)
        const base64Data = canvas.toDataURL('image/jpeg', 0.98);
        
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
 * Enhanced professional image dimension calculation with optimal fitting
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
  
  // Calculate optimal size maintaining aspect ratio with improved constraints
  let width = availableWidth - 2; // Reduced slightly for margins
  let height = width / aspectRatio;
  
  // If height exceeds available space, constrain by height
  if (height > availableHeight - 2) {
    height = availableHeight - 2;
    width = height * aspectRatio;
  }
  
  // Additional constraint to prevent very tall/thin images
  const minAspectRatio = 0.5;
  if (aspectRatio < minAspectRatio) {
    width = height * minAspectRatio;
  }
  
  // Additional constraint to prevent very wide/short images
  const maxAspectRatio = 2.5;
  if (aspectRatio > maxAspectRatio) {
    height = width / maxAspectRatio;
  }
  
  // Center the image in available space with proper margins
  const x = startX + (availableWidth - width) / 2;
  const y = startY + (availableHeight - height) / 2;
  
  return { x, y, width, height };
}

/**
 * Enhanced professional placeholder for missing images
 */
export function drawImagePlaceholder(
  pdf: any,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Enhanced placeholder with subtle styling
  pdf.setDrawColor(190, 190, 190);
  pdf.setFillColor(246, 246, 246);
  pdf.setLineWidth(0.2);
  pdf.roundedRect(x, y, width, height, 3, 3, 'FD');
  
  // Diagonal lines for visual interest
  pdf.setDrawColor(210, 210, 210);
  pdf.setLineWidth(0.1);
  pdf.line(x, y, x + width, y + height);
  pdf.line(x + width, y, x, y + height);
  
  // Enhanced "Image not available" text
  pdf.setFontSize(7); // Increased from 6
  pdf.setTextColor(140, 140, 140); // Darker for better visibility
  pdf.setFont('helvetica', 'italic');
  const text = 'Bild nicht verfügbar';
  const textWidth = pdf.getTextWidth(text);
  pdf.text(text, x + (width - textWidth) / 2, y + height / 2 + 1);
}
