
import { jsPDF } from 'jspdf';
import { Question } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { CONTENT_MARGINS, TYPOGRAPHY, LAYOUT_ZONES } from './constants';

export interface LayoutCalculation {
  textArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  imageArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  subcategoryY: number;
  hasImage: boolean;
  fontSize: number;
}

/**
 * Professional layout engine that calculates optimal space distribution
 */
export function calculateQuestionLayout(pdf: jsPDF, question: Question): LayoutCalculation {
  const questionText = getTextValue(question.text);
  const hasImage = !!question.image_url;
  
  // Calculate available content area
  const contentStartY = CONTENT_MARGINS.y + LAYOUT_ZONES.header.height + LAYOUT_ZONES.header.margin;
  const contentEndY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - LAYOUT_ZONES.footer.height - LAYOUT_ZONES.footer.margin;
  const availableHeight = contentEndY - contentStartY;
  const availableWidth = CONTENT_MARGINS.width - 4; // 2mm margin on each side
  
  // Determine optimal font size based on text length
  const fontSize = calculateOptimalFontSize(questionText);
  pdf.setFontSize(fontSize);
  
  // Calculate text dimensions
  const lines = pdf.splitTextToSize(questionText, availableWidth);
  const textHeight = lines.length * fontSize * TYPOGRAPHY.question.lineHeight * 0.35; // Convert to mm
  
  let imageArea: LayoutCalculation['imageArea'] = null;
  let textY = contentStartY;
  
  if (hasImage) {
    // Calculate optimal image size based on remaining space
    const remainingHeight = availableHeight - textHeight - LAYOUT_ZONES.content.spacing;
    const maxImageHeight = Math.min(LAYOUT_ZONES.content.maxImageHeight, remainingHeight);
    
    if (maxImageHeight > 10) { // Minimum viable image size
      imageArea = {
        x: CONTENT_MARGINS.x + 2,
        y: contentStartY,
        width: availableWidth,
        height: maxImageHeight
      };
      textY = contentStartY + maxImageHeight + LAYOUT_ZONES.content.spacing;
    }
  }
  
  const textArea = {
    x: CONTENT_MARGINS.x + 2,
    y: textY,
    width: availableWidth,
    height: Math.max(textHeight, LAYOUT_ZONES.content.minTextHeight)
  };
  
  const subcategoryY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - LAYOUT_ZONES.footer.height;
  
  return {
    textArea,
    imageArea,
    subcategoryY,
    hasImage,
    fontSize
  };
}

/**
 * Calculate optimal font size based on text length for readability
 */
function calculateOptimalFontSize(text: string): number {
  const length = text.length;
  
  if (length < 100) return TYPOGRAPHY.question.large;
  if (length < 200) return TYPOGRAPHY.question.medium;
  return TYPOGRAPHY.question.small;
}

/**
 * Calculate layout for answer side with proper spacing
 */
export function calculateAnswerLayout(pdf: jsPDF, question: Question): {
  headerY: number;
  answersY: number;
  imageY: number | null;
  hintY: number | null;
  availableImageHeight: number;
} {
  const contentStartY = CONTENT_MARGINS.y + LAYOUT_ZONES.header.margin;
  const contentEndY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - LAYOUT_ZONES.footer.height;
  
  let currentY = contentStartY;
  
  // Header
  const headerY = currentY;
  currentY += 8; // Header height
  
  // Answers
  const answersY = currentY;
  
  // Estimate answer height
  const answerHeight = estimateAnswerHeight(pdf, question);
  currentY += answerHeight + LAYOUT_ZONES.content.spacing;
  
  // Image area (if present)
  let imageY: number | null = null;
  let availableImageHeight = 0;
  
  if (question.image_url) {
    const remainingHeight = contentEndY - currentY - (question.hint ? 12 : 4);
    availableImageHeight = Math.min(25, Math.max(15, remainingHeight));
    
    if (availableImageHeight >= 15) {
      imageY = currentY;
      currentY += availableImageHeight + LAYOUT_ZONES.content.spacing;
    }
  }
  
  // Hint area
  let hintY: number | null = null;
  if (question.hint) {
    hintY = Math.max(currentY, contentEndY - 10);
  }
  
  return {
    headerY,
    answersY,
    imageY,
    hintY,
    availableImageHeight
  };
}

/**
 * Estimate the height needed for answers
 */
function estimateAnswerHeight(pdf: jsPDF, question: Question): number {
  pdf.setFontSize(TYPOGRAPHY.answer.text);
  const maxWidth = CONTENT_MARGINS.width - 8;
  
  if (question.question_type === 'open') {
    let totalHeight = 0;
    question.answers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth);
      totalHeight += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35;
      if (index < question.answers.length - 1) totalHeight += 2;
    });
    return totalHeight;
  } else {
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    let totalHeight = 0;
    correctAnswers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth - 4);
      totalHeight += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35;
      if (index < correctAnswers.length - 1) totalHeight += 2;
    });
    return totalHeight;
  }
}
