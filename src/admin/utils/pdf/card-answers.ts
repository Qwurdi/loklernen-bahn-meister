
import { jsPDF } from 'jspdf';
import { Question } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { CONTENT_MARGINS, TYPOGRAPHY, COLORS } from './constants';

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
