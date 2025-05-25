
import { jsPDF } from 'jspdf';
import { Question, RegulationCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { CONTENT_MARGINS, TYPOGRAPHY, COLORS } from './constants';
import { loadImageFromUrl, calculateImageDimensions, drawImagePlaceholder } from './image-utils';

// ===== BRANDING FUNCTIONS =====

export function drawLogo(pdf: jsPDF, side: 'front' | 'back') {
  pdf.setFontSize(TYPOGRAPHY.logo.size);
  pdf.setFont('helvetica', TYPOGRAPHY.logo.weight);
  
  const logoY = side === 'front' 
    ? CONTENT_MARGINS.y + 3 
    : CONTENT_MARGINS.y + CONTENT_MARGINS.height - 4;
  
  // Professional logo placement
  pdf.setTextColor(COLORS.primary.black[0], COLORS.primary.black[1], COLORS.primary.black[2]);
  pdf.text('Lok', CONTENT_MARGINS.x + 2, logoY);
  
  pdf.setTextColor(COLORS.primary.ultramarine[0], COLORS.primary.ultramarine[1], COLORS.primary.ultramarine[2]);
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
  
  // Professional badge design with proper color typing
  const badgeColor = regulation === 'DS 301' 
    ? COLORS.primary.ultramarine 
    : COLORS.primary.sapphire;
  
  pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  
  const badgeText = regulation;
  const textWidth = pdf.getTextWidth(badgeText);
  const badgeWidth = textWidth + 4;
  const badgeHeight = 6;
  const badgeX = CONTENT_MARGINS.x + CONTENT_MARGINS.width - badgeWidth - 1;
  const badgeY = CONTENT_MARGINS.y + 2;
  
  // Draw professional badge with rounded corners
  pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, 'F');
  
  // Badge text - perfectly centered
  pdf.setTextColor(COLORS.backgrounds.white[0], COLORS.backgrounds.white[1], COLORS.backgrounds.white[2]);
  pdf.text(badgeText, badgeX + 2, badgeY + 4.2);
}

// ===== TEXT FUNCTIONS =====

export function drawQuestionText(pdf: jsPDF, text: string, textArea: any, fontSize: number) {
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', TYPOGRAPHY.question.weight);
  pdf.setTextColor(COLORS.semantic.text.primary[0], COLORS.semantic.text.primary[1], COLORS.semantic.text.primary[2]);
  
  // Professional text rendering with optimal line spacing
  const lines = pdf.splitTextToSize(text, textArea.width);
  pdf.text(lines, textArea.x, textArea.y, { 
    lineHeightFactor: TYPOGRAPHY.question.lineHeight 
  });
}

export function drawSubcategory(pdf: jsPDF, subcategory: string, y: number) {
  pdf.setFontSize(TYPOGRAPHY.subcategory.size);
  pdf.setFont('helvetica', TYPOGRAPHY.subcategory.weight);
  pdf.setTextColor(COLORS.semantic.text.light[0], COLORS.semantic.text.light[1], COLORS.semantic.text.light[2]);
  
  pdf.text(subcategory, CONTENT_MARGINS.x + 2, y);
}

export function drawHint(pdf: jsPDF, hint: string, y: number) {
  pdf.setFontSize(TYPOGRAPHY.hint.size);
  pdf.setFont('helvetica', TYPOGRAPHY.hint.weight);
  pdf.setTextColor(COLORS.semantic.info[0], COLORS.semantic.info[1], COLORS.semantic.info[2]);
  
  const maxWidth = CONTENT_MARGINS.width - 6;
  
  // Professional hint with icon
  pdf.text('💡', CONTENT_MARGINS.x + 2, y);
  const lines = pdf.splitTextToSize(hint, maxWidth - 4);
  pdf.text(lines, CONTENT_MARGINS.x + 6, y, { 
    lineHeightFactor: 1.2 
  });
}

// ===== IMAGE FUNCTIONS =====

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

// ===== ANSWER FUNCTIONS =====

export async function drawAnswers(pdf: jsPDF, question: Question, startY: number): Promise<number> {
  // Professional answer header
  pdf.setFontSize(TYPOGRAPHY.answer.header);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(COLORS.primary.ultramarine[0], COLORS.primary.ultramarine[1], COLORS.primary.ultramarine[2]);
  pdf.text('ANTWORT', CONTENT_MARGINS.x + 2, startY);
  
  let currentY = startY + 6;
  const maxWidth = CONTENT_MARGINS.width - 6;
  
  pdf.setFontSize(TYPOGRAPHY.answer.text);
  pdf.setFont('helvetica', TYPOGRAPHY.answer.weight);
  pdf.setTextColor(COLORS.semantic.text.primary[0], COLORS.semantic.text.primary[1], COLORS.semantic.text.primary[2]);
  
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
      pdf.setTextColor(COLORS.semantic.success[0], COLORS.semantic.success[1], COLORS.semantic.success[2]);
      pdf.text('✓', CONTENT_MARGINS.x + 2, currentY);
      
      // Answer text
      pdf.setFontSize(TYPOGRAPHY.answer.text);
      pdf.setTextColor(COLORS.semantic.text.primary[0], COLORS.semantic.text.primary[1], COLORS.semantic.text.primary[2]);
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
