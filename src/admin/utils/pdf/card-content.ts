
import { jsPDF } from 'jspdf';
import { Question, RegulationCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { CONTENT_MARGINS } from './constants';
import { loadImageFromUrl, calculateImageDimensions, calculateAvailableImageSpace } from './image-utils';
import { LoadedImage } from './types';

export function drawLogo(pdf: jsPDF, side: 'front' | 'back') {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  
  const logoY = side === 'front' ? CONTENT_MARGINS.y + 2 : CONTENT_MARGINS.y + CONTENT_MARGINS.height - 6;
  
  // "Lok" in black, "Lernen" in ultramarine
  pdf.setTextColor(0, 0, 0);
  pdf.text('Lok', CONTENT_MARGINS.x + 2, logoY);
  
  pdf.setTextColor(63, 0, 255);
  const lokWidth = pdf.getTextWidth('Lok');
  pdf.text('Lernen', CONTENT_MARGINS.x + 2 + lokWidth, logoY);
}

export function drawRegulationBadge(pdf: jsPDF, regulation?: RegulationCategory) {
  if (!regulation || regulation === 'both') {
    regulation = 'DS 301'; // Default for display
  }
  
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  
  // Badge background with improved colors
  const badgeColor = regulation === 'DS 301' ? [63, 0, 255] : [15, 82, 186];
  pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  
  const badgeX = CONTENT_MARGINS.x + CONTENT_MARGINS.width - 20;
  const badgeY = CONTENT_MARGINS.y + 1;
  pdf.roundedRect(badgeX, badgeY, 18, 7, 2, 2, 'F');
  
  // Badge text - centered
  pdf.setTextColor(255, 255, 255);
  const textWidth = pdf.getTextWidth(regulation);
  pdf.text(regulation, badgeX + (18 - textWidth) / 2, badgeY + 5);
}

export async function drawQuestionImage(pdf: jsPDF, imageUrl: string): Promise<number> {
  try {
    const loadedImage = await loadImageFromUrl(imageUrl);
    const imageSpace = calculateAvailableImageSpace(true);
    
    const imageDimensions = calculateImageDimensions(
      loadedImage.originalWidth,
      loadedImage.originalHeight,
      imageSpace.width,
      imageSpace.height,
      CONTENT_MARGINS.x + 2,
      imageSpace.startY
    );
    
    // Add subtle border around image
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(
      imageDimensions.x - 1,
      imageDimensions.y - 1,
      imageDimensions.width + 2,
      imageDimensions.height + 2,
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
    
    return imageDimensions.y + imageDimensions.height + 4;
  } catch (error) {
    console.error('Error drawing image:', error);
    // Improved placeholder with better styling
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(248, 248, 248);
    const imageSpace = calculateAvailableImageSpace(true);
    pdf.roundedRect(
      CONTENT_MARGINS.x + 2,
      imageSpace.startY,
      imageSpace.width,
      18,
      3, 3, 'FD'
    );
    
    pdf.setFontSize(7);
    pdf.setTextColor(160, 160, 160);
    pdf.text('Bild nicht verfügbar', CONTENT_MARGINS.x + 4, imageSpace.startY + 10);
    
    return imageSpace.startY + 22;
  }
}

export async function drawAnswerImage(pdf: jsPDF, imageUrl: string, startY: number): Promise<number> {
  try {
    const loadedImage = await loadImageFromUrl(imageUrl);
    
    // Smaller image for answer side
    const maxWidth = CONTENT_MARGINS.width - 6;
    const maxHeight = 25; // Smaller than question side
    
    const imageDimensions = calculateImageDimensions(
      loadedImage.originalWidth,
      loadedImage.originalHeight,
      maxWidth,
      maxHeight,
      CONTENT_MARGINS.x + 3,
      startY + 2
    );
    
    // Subtle border
    pdf.setDrawColor(210, 210, 210);
    pdf.setLineWidth(0.1);
    pdf.roundedRect(
      imageDimensions.x - 0.5,
      imageDimensions.y - 0.5,
      imageDimensions.width + 1,
      imageDimensions.height + 1,
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
    
    return imageDimensions.y + imageDimensions.height + 3;
  } catch (error) {
    console.error('Error drawing answer image:', error);
    return startY;
  }
}

export async function drawQuestionText(pdf: jsPDF, text: string, startY?: number) {
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(40, 40, 40); // Softer black for better readability
  
  const maxWidth = CONTENT_MARGINS.width - 4;
  const textStartY = startY || CONTENT_MARGINS.y + 12;
  
  // Split text into lines that fit
  const lines = pdf.splitTextToSize(text, maxWidth);
  
  // Draw text with improved line spacing
  pdf.text(lines, CONTENT_MARGINS.x + 2, textStartY, { lineHeightFactor: 1.3 });
}

export function drawSubcategory(pdf: jsPDF, subcategory: string) {
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(120, 120, 120);
  
  const categoryY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - 10;
  pdf.text(subcategory, CONTENT_MARGINS.x + 2, categoryY);
}

export async function drawAnswers(pdf: jsPDF, question: Question): Promise<number> {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  
  let currentY = CONTENT_MARGINS.y + 8;
  const maxWidth = CONTENT_MARGINS.width - 4;
  
  // Add "Antwort" header with improved styling
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(63, 0, 255);
  pdf.text('ANTWORT', CONTENT_MARGINS.x + 2, currentY);
  currentY += 6;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(40, 40, 40);
  
  if (question.question_type === 'open') {
    // For open questions, show all correct answers
    question.answers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth);
      
      if (index > 0) currentY += 2;
      pdf.text(lines, CONTENT_MARGINS.x + 2, currentY, { lineHeightFactor: 1.2 });
      currentY += lines.length * 3.5;
    });
  } else {
    // For multiple choice, show correct answers with checkmark
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    correctAnswers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      
      // Draw checkmark
      pdf.setFontSize(9);
      pdf.setTextColor(34, 197, 94); // Green color
      pdf.text('✓', CONTENT_MARGINS.x + 2, currentY);
      
      // Draw answer text
      pdf.setFontSize(10);
      pdf.setTextColor(40, 40, 40);
      const lines = pdf.splitTextToSize(answerText, maxWidth - 4);
      pdf.text(lines, CONTENT_MARGINS.x + 6, currentY, { lineHeightFactor: 1.2 });
      
      currentY += lines.length * 3.5;
      if (index < correctAnswers.length - 1) currentY += 2;
    });
  }
  
  return currentY + 3;
}

export function drawHint(pdf: jsPDF, hint: string, startY: number) {
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(99, 102, 241); // Indigo color for hints
  
  const maxWidth = CONTENT_MARGINS.width - 4;
  
  // Add hint icon and text
  pdf.text('💡', CONTENT_MARGINS.x + 2, startY);
  const lines = pdf.splitTextToSize(hint, maxWidth - 4);
  pdf.text(lines, CONTENT_MARGINS.x + 6, startY, { lineHeightFactor: 1.1 });
}
