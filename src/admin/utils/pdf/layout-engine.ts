
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
 * Enhanced professional layout engine with better spacing and constraints
 */
export function calculateQuestionLayout(pdf: jsPDF, question: Question): LayoutCalculation {
  const questionText = getTextValue(question.text);
  const hasImage = !!question.image_url;
  
  // Calculate available content area with enhanced spacing
  const contentStartY = CONTENT_MARGINS.y + LAYOUT_ZONES.header.height + LAYOUT_ZONES.header.margin;
  const contentEndY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - LAYOUT_ZONES.footer.height - LAYOUT_ZONES.footer.margin;
  const availableHeight = contentEndY - contentStartY;
  const availableWidth = CONTENT_MARGINS.width - 6; // Increased margin
  
  // Determine optimal font size with more dramatic differences
  const fontSize = calculateOptimalFontSize(questionText);
  pdf.setFontSize(fontSize);
  
  // Calculate text dimensions with enhanced line spacing
  const lines = pdf.splitTextToSize(questionText, availableWidth);
  const textHeight = lines.length * fontSize * TYPOGRAPHY.question.lineHeight * 0.35;
  
  let imageArea: LayoutCalculation['imageArea'] = null;
  let textY = contentStartY;
  
  if (hasImage) {
    // More conservative image sizing to prevent overlap
    const remainingHeight = availableHeight - textHeight - (LAYOUT_ZONES.content.spacing * 2);
    const maxImageHeight = Math.min(LAYOUT_ZONES.content.maxImageHeight, remainingHeight);
    
    if (maxImageHeight > 15) { // Higher minimum for better image quality
      imageArea = {
        x: CONTENT_MARGINS.x + 3, // Increased margin
        y: contentStartY,
        width: availableWidth - 2, // Reduced width for better padding
        height: maxImageHeight
      };
      textY = contentStartY + maxImageHeight + LAYOUT_ZONES.content.spacing;
    }
  }
  
  const textArea = {
    x: CONTENT_MARGINS.x + 3, // Increased margin
    y: textY,
    width: availableWidth - 2, // Consistent with image width
    height: Math.max(textHeight, LAYOUT_ZONES.content.minTextHeight)
  };
  
  const subcategoryY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - LAYOUT_ZONES.footer.height + 1;
  
  return {
    textArea,
    imageArea,
    subcategoryY,
    hasImage,
    fontSize
  };
}

/**
 * Enhanced optimal font size calculation with more dramatic differences
 */
function calculateOptimalFontSize(text: string): number {
  const length = text.length;
  
  if (length < 90) return TYPOGRAPHY.question.large;
  if (length < 180) return TYPOGRAPHY.question.medium;
  return TYPOGRAPHY.question.small;
}

/**
 * Enhanced answer layout with better spacing and constraints
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
  
  // Header with better spacing
  const headerY = currentY;
  currentY += 10; // Increased from 8
  
  // Answers with better spacing
  const answersY = currentY;
  
  // More accurate answer height estimation
  const answerHeight = estimateAnswerHeight(pdf, question);
  currentY += answerHeight + LAYOUT_ZONES.content.spacing;
  
  // Image area with more conservative sizing
  let imageY: number | null = null;
  let availableImageHeight = 0;
  
  if (question.image_url) {
    const remainingHeight = contentEndY - currentY - (question.hint ? 15 : 6);
    // More conservative image height to prevent overlap
    availableImageHeight = Math.min(30, Math.max(20, remainingHeight));
    
    if (availableImageHeight >= 20) { // Higher minimum for better image quality
      imageY = currentY;
      currentY += availableImageHeight + LAYOUT_ZONES.content.spacing;
    }
  }
  
  // Hint area with better spacing
  let hintY: number | null = null;
  if (question.hint) {
    hintY = Math.max(currentY, contentEndY - 13); // Increased from 10
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
 * Enhanced answer height estimation with better spacing
 */
function estimateAnswerHeight(pdf: jsPDF, question: Question): number {
  pdf.setFontSize(TYPOGRAPHY.answer.text);
  const maxWidth = CONTENT_MARGINS.width - 10; // Increased margin
  
  if (question.question_type === 'open') {
    let totalHeight = 0;
    question.answers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth);
      totalHeight += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35;
      if (index < question.answers.length - 1) totalHeight += 3; // Increased spacing between answers
    });
    return totalHeight;
  } else {
    const correctAnswers = question.answers.filter(a => a.isCorrect);
    let totalHeight = 0;
    correctAnswers.forEach((answer, index) => {
      const answerText = getTextValue(answer.text);
      const lines = pdf.splitTextToSize(answerText, maxWidth - 5); // Account for checkmark
      totalHeight += lines.length * TYPOGRAPHY.answer.text * TYPOGRAPHY.answer.lineHeight * 0.35;
      if (index < correctAnswers.length - 1) totalHeight += 3; // Increased spacing
    });
    return totalHeight;
  }
}
