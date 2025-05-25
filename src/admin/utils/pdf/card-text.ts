
import { jsPDF } from 'jspdf';
import { CONTENT_MARGINS, TYPOGRAPHY, COLORS } from './constants';

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
