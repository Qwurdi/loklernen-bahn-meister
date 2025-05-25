
import { jsPDF } from 'jspdf';
import { Question, RegulationCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { CONTENT_MARGINS } from './constants';
import { loadImageFromUrl, calculateImageDimensions, calculateAvailableImageSpace } from './image-utils';
import { LoadedImage } from './types';

export function drawLogo(pdf: jsPDF, side: 'front' | 'back') {
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(63, 0, 255); // LokLernen ultramarine
  
  const logoY = side === 'front' ? CONTENT_MARGINS.y + 3 : CONTENT_MARGINS.y + CONTENT_MARGINS.height - 8;
  
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
  
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  
  // Badge background
  const badgeColor = regulation === 'DS 301' ? [63, 0, 255] : [15, 82, 186];
  pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  
  const badgeX = CONTENT_MARGINS.x + CONTENT_MARGINS.width - 18;
  const badgeY = CONTENT_MARGINS.y + 2;
  pdf.roundedRect(badgeX, badgeY, 16, 6, 1, 1, 'F');
  
  // Badge text
  pdf.setTextColor(255, 255, 255);
  pdf.text(regulation, badgeX + 2, badgeY + 4);
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
    
    pdf.addImage(
      loadedImage.data,
      'JPEG',
      imageDimensions.x,
      imageDimensions.y,
      imageDimensions.width,
      imageDimensions.height
    );
    
    // Gib die Höhe zurück, die das Bild belegt hat (für Layout-Anpassungen)
    return imageDimensions.y + imageDimensions.height + 5; // +5mm Abstand
  } catch (error) {
    console.error('Error drawing image:', error);
    // Zeichne einen Platzhalter bei Bildfehlern
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(245, 245, 245);
    const imageSpace = calculateAvailableImageSpace(true);
    pdf.roundedRect(
      CONTENT_MARGINS.x + 2,
      imageSpace.startY,
      imageSpace.width,
      20,
      2, 2, 'FD'
    );
    
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Bild konnte nicht geladen werden', CONTENT_MARGINS.x + 4, imageSpace.startY + 12);
    
    return imageSpace.startY + 25; // Platzhalter-Höhe + Abstand
  }
}

export async function drawQuestionText(pdf: jsPDF, text: string, startY?: number) {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  const maxWidth = CONTENT_MARGINS.width - 4;
  const textStartY = startY || CONTENT_MARGINS.y + 15;
  
  // Split text into lines that fit
  const lines = pdf.splitTextToSize(text, maxWidth);
  
  // Draw text with proper line spacing
  pdf.text(lines, CONTENT_MARGINS.x + 2, textStartY);
}

export function drawSubcategory(pdf: jsPDF, subcategory: string) {
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  
  const categoryY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - 12;
  pdf.text(subcategory, CONTENT_MARGINS.x + 2, categoryY);
}

export function drawAnswers(pdf: jsPDF, question: Question) {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  let currentY = CONTENT_MARGINS.y + 10;
  const maxWidth = CONTENT_MARGINS.width - 4;
  
  if (question.question_type === 'open') {
    // For open questions, show all answers
    question.answers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth);
      
      if (index > 0) currentY += 3; // Space between answers
      pdf.text(lines, CONTENT_MARGINS.x + 2, currentY);
      currentY += lines.length * 3;
    });
  } else {
    // For multiple choice, show correct answers
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    correctAnswers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(`✓ ${answerText}`, maxWidth);
      
      if (index > 0) currentY += 3;
      pdf.text(lines, CONTENT_MARGINS.x + 2, currentY);
      currentY += lines.length * 3;
    });
  }
}

export function drawHint(pdf: jsPDF, hint: string) {
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(60, 130, 246); // Blue color for hints
  
  const maxWidth = CONTENT_MARGINS.width - 4;
  const hintY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - 20;
  
  const lines = pdf.splitTextToSize(`💡 ${hint}`, maxWidth);
  pdf.text(lines, CONTENT_MARGINS.x + 2, hintY);
}
