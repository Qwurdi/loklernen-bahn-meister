
import { jsPDF } from 'jspdf';
import { COLORS } from './constants';
import { loadImageFromUrl, calculateImageDimensions, drawImagePlaceholder } from './image-utils';

export async function drawQuestionImage(pdf: jsPDF, imageUrl: string, imageArea: any): Promise<void> {
  try {
    const loadedImage = await loadImageFromUrl(imageUrl);
    
    const imageDimensions = calculateImageDimensions(
      loadedImage.originalWidth,
      loadedImage.originalHeight,
      imageArea.width,
      imageArea.height,
      imageArea.x,
      imageArea.y
    );
    
    // Professional image border with proper color typing
    pdf.setDrawColor(COLORS.borders.light[0], COLORS.borders.light[1], COLORS.borders.light[2]);
    pdf.setLineWidth(0.15);
    pdf.roundedRect(
      imageDimensions.x - 0.5,
      imageDimensions.y - 0.5,
      imageDimensions.width + 1,
      imageDimensions.height + 1,
      1.5, 1.5, 'S'
    );
    
    pdf.addImage(
      loadedImage.data,
      'JPEG',
      imageDimensions.x,
      imageDimensions.y,
      imageDimensions.width,
      imageDimensions.height
    );
  } catch (error) {
    console.error('Error drawing question image:', error);
    drawImagePlaceholder(pdf, imageArea.x, imageArea.y, imageArea.width, imageArea.height);
  }
}

export async function drawAnswerImage(pdf: jsPDF, imageUrl: string, x: number, y: number, width: number, height: number): Promise<void> {
  try {
    const loadedImage = await loadImageFromUrl(imageUrl);
    
    const imageDimensions = calculateImageDimensions(
      loadedImage.originalWidth,
      loadedImage.originalHeight,
      width,
      height,
      x,
      y
    );
    
    // Subtle border for answer images with proper color typing
    pdf.setDrawColor(COLORS.borders.medium[0], COLORS.borders.medium[1], COLORS.borders.medium[2]);
    pdf.setLineWidth(0.1);
    pdf.roundedRect(
      imageDimensions.x - 0.3,
      imageDimensions.y - 0.3,
      imageDimensions.width + 0.6,
      imageDimensions.height + 0.6,
      1, 1, 'S'
    );
    
    pdf.addImage(
      loadedImage.data,
      'JPEG',
      imageDimensions.x,
      imageDimensions.y,
      imageDimensions.width,
      imageDimensions.height
    );
  } catch (error) {
    console.error('Error drawing answer image:', error);
    drawImagePlaceholder(pdf, x, y, width, height);
  }
}
