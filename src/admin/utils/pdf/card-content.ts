
import { jsPDF } from 'jspdf';
import { Question, RegulationCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { CONTENT_MARGINS, TYPOGRAPHY, COLORS, LAYOUT_ZONES } from './constants';
import { loadImageFromUrl, calculateImageDimensions, drawImagePlaceholder } from './image-utils';
import { calculateQuestionLayout, calculateAnswerLayout } from './layout-engine';

export function drawLogo(pdf: jsPDF, side: 'front' | 'back') {
  pdf.setFontSize(TYPOGRAPHY.logo.size);
  pdf.setFont('helvetica', TYPOGRAPHY.logo.weight);
  
  const logoY = side === 'front' 
    ? CONTENT_MARGINS.y + 3 
    : CONTENT_MARGINS.y + CONTENT_MARGINS.height - 4;
  
  // Professional logo placement
  const [blackR, blackG, blackB] = COLORS.primary.black;
  pdf.setTextColor(blackR, blackG, blackB);
  pdf.text('Lok', CONTENT_MARGINS.x + 2, logoY);
  
  const [ultramarineR, ultramarineG, ultramarineB] = COLORS.primary.ultramarine;
  pdf.setTextColor(ultramarineR, ultramarineG, ultramarineB);
  const lokWidth = pdf.getTextWidth('Lok');
  pdf.text('Lernen', CONTENT_MARGINS.x + 2 + lokWidth, logoY);
}

export function drawRegulationBadge(pdf: jsPDF, regulation?: RegulationCategory) {
  // Only draw badge for specific regulations, not for "both"
  if (!regulation || regulation === 'both') {
    return; // No badge for "both" regulation cards
  }
  
  pdf.setFontSize(TYPOGRAPHY.badge.size);
  pdf.setFont('helvetica', TYPOGRAPHY.badge.weight);
  
  // Professional badge design
  const badgeColor = regulation === 'DS 301' 
    ? COLORS.primary.ultramarine 
    : COLORS.primary.sapphire;
  
  const [badgeR, badgeG, badgeB] = badgeColor;
  pdf.setFillColor(badgeR, badgeG, badgeB);
  
  const badgeText = regulation;
  const textWidth = pdf.getTextWidth(badgeText);
  const badgeWidth = textWidth + 4;
  const badgeHeight = 6;
  const badgeX = CONTENT_MARGINS.x + CONTENT_MARGINS.width - badgeWidth - 1;
  const badgeY = CONTENT_MARGINS.y + 2;
  
  // Draw professional badge with rounded corners
  pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, 'F');
  
  // Badge text - perfectly centered
  const [whiteR, whiteG, whiteB] = COLORS.backgrounds.white;
  pdf.setTextColor(whiteR, whiteG, whiteB);
  pdf.text(badgeText, badgeX + 2, badgeY + 4.2);
}

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
    
    // Professional image border
    const [lightR, lightG, lightB] = COLORS.borders.light;
    pdf.setDrawColor(lightR, lightG, lightB);
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
    
    // Subtle border for answer images
    const [mediumR, mediumG, mediumB] = COLORS.borders.medium;
    pdf.setDrawColor(mediumR, mediumG, mediumB);
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

export function drawQuestionText(pdf: jsPDF, text: string, textArea: any, fontSize: number) {
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', TYPOGRAPHY.question.weight);
  const [primaryR, primaryG, primaryB] = COLORS.semantic.text.primary;
  pdf.setTextColor(primaryR, primaryG, primaryB);
  
  // Professional text rendering with optimal line spacing
  const lines = pdf.splitTextToSize(text, textArea.width);
  pdf.text(lines, textArea.x, textArea.y, { 
    lineHeightFactor: TYPOGRAPHY.question.lineHeight 
  });
}

export function drawSubcategory(pdf: jsPDF, subcategory: string, y: number) {
  pdf.setFontSize(TYPOGRAPHY.subcategory.size);
  pdf.setFont('helvetica', TYPOGRAPHY.subcategory.weight);
  const [lightR, lightG, lightB] = COLORS.semantic.text.light;
  pdf.setTextColor(lightR, lightG, lightB);
  
  pdf.text(subcategory, CONTENT_MARGINS.x + 2, y);
}

export async function drawAnswers(pdf: jsPDF, question: Question, startY: number): Promise<number> {
  // Professional answer header
  pdf.setFontSize(TYPOGRAPHY.answer.header);
  pdf.setFont('helvetica', 'bold');
  const [ultramarineR, ultramarineG, ultramarineB] = COLORS.primary.ultramarine;
  pdf.setTextColor(ultramarineR, ultramarineG, ultramarineB);
  pdf.text('ANTWORT', CONTENT_MARGINS.x + 2, startY);
  
  let currentY = startY + 6;
  const maxWidth = CONTENT_MARGINS.width - 6;
  
  pdf.setFontSize(TYPOGRAPHY.answer.text);
  pdf.setFont('helvetica', TYPOGRAPHY.answer.weight);
  const [primaryR, primaryG, primaryB] = COLORS.semantic.text.primary;
  pdf.setTextColor(primaryR, primaryG, primaryB);
  
  if (question.question_type === 'open') {
    // Open questions - show all correct answers
    question.answers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth);
      
      if (index > 0) currentY += 2;
      pdf.text(lines, CONTENT_MARGINS.x + 2, currentY, { 
        lineHeightFactor: TYPOGRAPHY.answer.lineHeight 
      });
      currentY += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35;
    });
  } else {
    // Multiple choice - show correct answers with professional checkmarks
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    correctAnswers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      
      // Professional checkmark
      pdf.setFontSize(8);
      const [successR, successG, successB] = COLORS.semantic.success;
      pdf.setTextColor(successR, successG, successB);
      pdf.text('✓', CONTENT_MARGINS.x + 2, currentY);
      
      // Answer text
      pdf.setFontSize(TYPOGRAPHY.answer.text);
      pdf.setTextColor(primaryR, primaryG, primaryB);
      const lines = pdf.splitTextToSize(answerText, maxWidth - 4);
      pdf.text(lines, CONTENT_MARGINS.x + 6, currentY, { 
        lineHeightFactor: TYPOGRAPHY.answer.lineHeight 
      });
      
      currentY += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35;
      if (index < correctAnswers.length - 1) currentY += 2;
    });
  }
  
  return currentY + 3;
}

export function drawHint(pdf: jsPDF, hint: string, y: number) {
  pdf.setFontSize(TYPOGRAPHY.hint.size);
  pdf.setFont('helvetica', TYPOGRAPHY.hint.weight);
  const [infoR, infoG, infoB] = COLORS.semantic.info;
  pdf.setTextColor(infoR, infoG, infoB);
  
  const maxWidth = CONTENT_MARGINS.width - 6;
  
  // Professional hint with icon
  pdf.text('💡', CONTENT_MARGINS.x + 2, y);
  const lines = pdf.splitTextToSize(hint, maxWidth - 4);
  pdf.text(lines, CONTENT_MARGINS.x + 6, y, { 
    lineHeightFactor: 1.2 
  });
}
