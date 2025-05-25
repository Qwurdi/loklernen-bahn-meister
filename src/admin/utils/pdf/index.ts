
import { jsPDF } from 'jspdf';
import { Question } from '@/types/questions';
import { ExportOptions } from './types';
import { CARD_SIZE } from './constants';
import { generateCardFront, generateCardBack } from './card-generators';

export async function generateFlashcardPDF(questions: Question[], options: ExportOptions) {
  // Create PDF with exact document dimensions
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [CARD_SIZE.docWidth, CARD_SIZE.docHeight]
  });

  // Set default font
  pdf.setFont('helvetica');

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    if (i > 0) {
      pdf.addPage();
    }

    // Generate front side (question)
    await generateCardFront(pdf, question, options.regulation);
    
    // Add new page for back side
    pdf.addPage();
    
    // Generate back side (answer)
    await generateCardBack(pdf, question, options.regulation);
  }

  // Download the PDF
  pdf.save(options.filename);
}

// Re-export types for convenience
export type { ExportOptions } from './types';
