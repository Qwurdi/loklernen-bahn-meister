
import { jsPDF } from 'jspdf';
import { Question } from '@/types/questions';
import { ExportOptions } from './types';
import { CARD_SIZE } from './constants';
import { generateCardFront, generateCardBack } from './card-generators';

export async function generateFlashcardPDF(questions: Question[], options: ExportOptions) {
  // Create PDF with exact document dimensions for professional printing
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [CARD_SIZE.docWidth, CARD_SIZE.docHeight]
  });

  // Set default font for consistent typography
  pdf.setFont('helvetica');

  // Show progress in console for large batches
  console.log(`Starting export of ${questions.length} flashcards`);
  let processedCount = 0;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    
    if (i > 0) {
      pdf.addPage();
    }

    try {
      // Generate front side with enhanced professional design
      await generateCardFront(pdf, question, options.regulation);
      
      // Add new page for back side
      pdf.addPage();
      
      // Generate back side with enhanced professional design
      await generateCardBack(pdf, question, options.regulation);
      
      // Update progress tracking
      processedCount++;
      if (processedCount % 10 === 0 || processedCount === questions.length) {
        console.log(`Processed ${processedCount}/${questions.length} cards`);
      }
    } catch (error) {
      console.error(`Error generating card ${i + 1}:`, error);
      // Continue with next card even if one fails
    }
  }

  console.log(`PDF export completed successfully for ${processedCount} cards`);
  
  // Download the PDF with consistent naming
  pdf.save(options.filename);
}

// Re-export types for convenience
export type { ExportOptions } from './types';
