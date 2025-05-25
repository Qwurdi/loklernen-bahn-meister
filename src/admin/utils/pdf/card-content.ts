
import { jsPDF } from 'jspdf';
import { Question, RegulationCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { CONTENT_MARGINS, TYPOGRAPHY, COLORS } from './constants';
import { loadImageFromUrl, calculateImageDimensions, drawImagePlaceholder } from './image-utils';

// ===== ENHANCED BRANDING FUNCTIONS =====

export function drawLogo(pdf: jsPDF, side: 'front' | 'back') {
  pdf.setFontSize(TYPOGRAPHY.logo.size);
  pdf.setFont('helvetica', TYPOGRAPHY.logo.weight);
  
  const logoY = side === 'front' 
    ? CONTENT_MARGINS.y + 3 
    : CONTENT_MARGINS.y + CONTENT_MARGINS.height - 4;
  
  // Enhanced logo placement with subtle background
  if (side === 'front') {
    // Subtle background for logo area
    pdf.setFillColor(COLORS.backgrounds.subtle[0], COLORS.backgrounds.subtle[1], COLORS.backgrounds.subtle[2]);
    pdf.roundedRect(
      CONTENT_MARGINS.x, 
      CONTENT_MARGINS.y, 
      CONTENT_MARGINS.width + 4, 
      10, 
      2, 2, 'F'
    );
  }
  
  pdf.setTextColor(COLORS.primary.black[0], COLORS.primary.black[1], COLORS.primary.black[2]);
  pdf.text('Lok', CONTENT_MARGINS.x + 2, logoY);
  
  pdf.setTextColor(COLORS.primary.ultramarine[0], COLORS.primary.ultramarine[1], COLORS.primary.ultramarine[2]);
  const lokWidth = pdf.getTextWidth('Lok');
  pdf.text('Lernen', CONTENT_MARGINS.x + 2 + lokWidth, logoY);
}

export function drawRegulationBadge(pdf: jsPDF, regulation: RegulationCategory) {
  // Enhanced badge with better styling - never draw for "both" or "all"
  if (!regulation || regulation === 'both') {
    return; // No badge for "both" regulation cards
  }
  
  pdf.setFontSize(TYPOGRAPHY.badge.size);
  pdf.setFont('helvetica', TYPOGRAPHY.badge.weight);
  
  // Professional badge design with enhanced colors
  const badgeColor = regulation === 'DS 301' 
    ? COLORS.primary.ultramarine 
    : COLORS.primary.sapphire;
  
  pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  
  const badgeText = regulation;
  const textWidth = pdf.getTextWidth(badgeText);
  const badgeWidth = textWidth + 5; // Increased padding
  const badgeHeight = 7; // Increased height
  const badgeX = CONTENT_MARGINS.x + CONTENT_MARGINS.width - badgeWidth - 2;
  const badgeY = CONTENT_MARGINS.y + 2;
  
  // Enhanced badge with more pronounced corners
  pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 2, 2, 'F');
  
  // Enhanced badge text - perfectly centered
  pdf.setTextColor(COLORS.backgrounds.white[0], COLORS.backgrounds.white[1], COLORS.backgrounds.white[2]);
  pdf.text(badgeText, badgeX + 2.5, badgeY + 4.7); // Adjusted positioning
}

// ===== ENHANCED TEXT FUNCTIONS =====

export function drawQuestionText(pdf: jsPDF, text: string, textArea: any, fontSize: number) {
  // Enhanced question text with better styling
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', TYPOGRAPHY.question.weight);
  pdf.setTextColor(COLORS.semantic.text.primary[0], COLORS.semantic.text.primary[1], COLORS.semantic.text.primary[2]);
  
  // Subtle background for text area (only for longer texts)
  if (text.length > 150) {
    pdf.setFillColor(COLORS.backgrounds.light[0], COLORS.backgrounds.light[1], COLORS.backgrounds.light[2]);
    pdf.roundedRect(
      textArea.x - 1, 
      textArea.y - 1, 
      textArea.width + 2, 
      textArea.height + 2, 
      2, 2, 'F'
    );
  }
  
  // Enhanced text rendering with optimal line spacing
  const lines = pdf.splitTextToSize(text, textArea.width);
  pdf.text(lines, textArea.x, textArea.y, { 
    lineHeightFactor: TYPOGRAPHY.question.lineHeight 
  });
}

export function drawSubcategory(pdf: jsPDF, subcategory: string, y: number) {
  // Enhanced subcategory with better styling
  pdf.setFontSize(TYPOGRAPHY.subcategory.size);
  pdf.setFont('helvetica', TYPOGRAPHY.subcategory.weight);
  pdf.setTextColor(COLORS.semantic.text.light[0], COLORS.semantic.text.light[1], COLORS.semantic.text.light[2]);
  
  // Draw line above subcategory
  pdf.setDrawColor(COLORS.borders.light[0], COLORS.borders.light[1], COLORS.borders.light[2]);
  pdf.setLineWidth(0.1);
  pdf.line(CONTENT_MARGINS.x + 2, y - 4, CONTENT_MARGINS.x + CONTENT_MARGINS.width - 2, y - 4);
  
  pdf.text(subcategory, CONTENT_MARGINS.x + 2, y);
}

export function drawHint(pdf: jsPDF, hint: string, y: number) {
  // Enhanced hint with better styling
  pdf.setFontSize(TYPOGRAPHY.hint.size);
  pdf.setFont('helvetica', TYPOGRAPHY.hint.weight);
  pdf.setTextColor(COLORS.semantic.info[0], COLORS.semantic.info[1], COLORS.semantic.info[2]);
  
  const maxWidth = CONTENT_MARGINS.width - 8; // Increased margin
  
  // Subtle background for hint
  pdf.setFillColor(COLORS.backgrounds.light[0], COLORS.backgrounds.light[1], COLORS.backgrounds.light[2]);
  pdf.roundedRect(
    CONTENT_MARGINS.x + 1, 
    y - 3, 
    CONTENT_MARGINS.width - 2, 
    10, 
    2, 2, 'F'
  );
  
  // Enhanced professional hint with icon
  pdf.text('💡', CONTENT_MARGINS.x + 2, y);
  const lines = pdf.splitTextToSize(hint, maxWidth - 4);
  pdf.text(lines, CONTENT_MARGINS.x + 7, y, { // Increased icon spacing
    lineHeightFactor: 1.3 // Increased from 1.2
  });
}

// ===== ENHANCED IMAGE FUNCTIONS =====

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
    
    // Enhanced image border with subtle shadow effect
    pdf.setDrawColor(COLORS.borders.medium[0], COLORS.borders.medium[1], COLORS.borders.medium[2]);
    pdf.setLineWidth(0.2);
    
    // Subtle background for image
    pdf.setFillColor(COLORS.backgrounds.white[0], COLORS.backgrounds.white[1], COLORS.backgrounds.white[2]);
    pdf.roundedRect(
      imageDimensions.x - 0.7,
      imageDimensions.y - 0.7,
      imageDimensions.width + 1.4,
      imageDimensions.height + 1.4,
      2, 2, 'FD'
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
    
    // Enhanced image border with better styling
    pdf.setDrawColor(COLORS.borders.medium[0], COLORS.borders.medium[1], COLORS.borders.medium[2]);
    pdf.setLineWidth(0.2);
    
    // Subtle background for image
    pdf.setFillColor(COLORS.backgrounds.white[0], COLORS.backgrounds.white[1], COLORS.backgrounds.white[2]);
    pdf.roundedRect(
      imageDimensions.x - 0.7,
      imageDimensions.y - 0.7,
      imageDimensions.width + 1.4,
      imageDimensions.height + 1.4,
      2, 2, 'FD'
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

// ===== ENHANCED ANSWER FUNCTIONS =====

export async function drawAnswers(pdf: jsPDF, question: Question, startY: number): Promise<number> {
  // Enhanced answer section with better styling
  // Subtle background for answer header
  pdf.setFillColor(COLORS.backgrounds.light[0], COLORS.backgrounds.light[1], COLORS.backgrounds.light[2]);
  pdf.roundedRect(
    CONTENT_MARGINS.x, 
    startY - 3, 
    CONTENT_MARGINS.width, 
    6, 
    2, 2, 'F'
  );
  
  // Professional answer header
  pdf.setFontSize(TYPOGRAPHY.answer.header);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(COLORS.primary.ultramarine[0], COLORS.primary.ultramarine[1], COLORS.primary.ultramarine[2]);
  pdf.text('ANTWORT', CONTENT_MARGINS.x + 2, startY);
  
  let currentY = startY + 7; // Increased spacing
  const maxWidth = CONTENT_MARGINS.width - 8; // Increased margin
  
  pdf.setFontSize(TYPOGRAPHY.answer.text);
  pdf.setFont('helvetica', TYPOGRAPHY.answer.weight);
  pdf.setTextColor(COLORS.semantic.text.primary[0], COLORS.semantic.text.primary[1], COLORS.semantic.text.primary[2]);
  
  if (question.question_type === 'open') {
    // Open questions with enhanced styling
    question.answers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth);
      
      if (index > 0) currentY += 3; // Increased spacing
      
      // Box around answers
      if (lines.length > 1 && answerText.length > 50) {
        pdf.setFillColor(COLORS.backgrounds.light[0], COLORS.backgrounds.light[1], COLORS.backgrounds.light[2]);
        pdf.roundedRect(
          CONTENT_MARGINS.x + 1,
          currentY - 3,
          maxWidth,
          lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35 + 4,
          1.5, 1.5, 'F'
        );
      }
      
      pdf.text(lines, CONTENT_MARGINS.x + 3, currentY, { // Increased margin
        lineHeightFactor: TYPOGRAPHY.answer.lineHeight 
      });
      currentY += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35 + 1;
    });
  } else {
    // Multiple choice with enhanced styling
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    correctAnswers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      
      // Enhanced professional checkmark with better styling
      pdf.setFillColor(COLORS.semantic.success[0], COLORS.semantic.success[1], COLORS.semantic.success[2]);
      pdf.circle(CONTENT_MARGINS.x + 2.5, currentY - 1.5, 1.2, 'F');
      
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text('✓', CONTENT_MARGINS.x + 1.8, currentY - 0.5);
      
      // Answer text
      pdf.setFontSize(TYPOGRAPHY.answer.text);
      pdf.setTextColor(COLORS.semantic.text.primary[0], COLORS.semantic.text.primary[1], COLORS.semantic.text.primary[2]);
      const lines = pdf.splitTextToSize(answerText, maxWidth - 5);
      pdf.text(lines, CONTENT_MARGINS.x + 6, currentY, { // Increased margin
        lineHeightFactor: TYPOGRAPHY.answer.lineHeight 
      });
      
      currentY += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35 + 1;
      if (index < correctAnswers.length - 1) currentY += 2; // Increased spacing
    });
  }
  
  return currentY + 3; // Increased final spacing
}
