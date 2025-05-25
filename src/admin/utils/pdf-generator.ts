
import { jsPDF } from 'jspdf';
import { Question, QuestionCategory, RegulationCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';

interface ExportOptions {
  category: QuestionCategory;
  regulation: RegulationCategory;
  filename: string;
}

// Card dimensions in mm
const CARD_SIZE = {
  width: 59,
  height: 91,
  docWidth: 65,
  docHeight: 97,
  contentWidth: 51,
  contentHeight: 83,
  cornerRadius: 5
};

// Calculate margins to center the card
const MARGINS = {
  x: (CARD_SIZE.docWidth - CARD_SIZE.width) / 2,
  y: (CARD_SIZE.docHeight - CARD_SIZE.height) / 2
};

// Content area margins from card edge
const CONTENT_MARGINS = {
  x: (CARD_SIZE.width - CARD_SIZE.contentWidth) / 2 + MARGINS.x,
  y: (CARD_SIZE.height - CARD_SIZE.contentHeight) / 2 + MARGINS.y
};

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

async function generateCardFront(pdf: jsPDF, question: Question, regulation: RegulationCategory) {
  // Draw card outline with rounded corners
  drawCardOutline(pdf);
  
  // Draw cut marks
  drawCutMarks(pdf);
  
  // Add LokLernen logo at top
  drawLogo(pdf, 'front');
  
  // Add regulation badge
  drawRegulationBadge(pdf, question.regulation_category || regulation);
  
  // Add question text
  const questionText = getTextValue(question.text);
  drawQuestionText(pdf, questionText);
  
  // Add subcategory
  drawSubcategory(pdf, question.sub_category);
}

async function generateCardBack(pdf: jsPDF, question: Question, regulation: RegulationCategory) {
  // Draw card outline with rounded corners
  drawCardOutline(pdf);
  
  // Draw cut marks
  drawCutMarks(pdf);
  
  // Add LokLernen logo at bottom
  drawLogo(pdf, 'back');
  
  // Add answers
  drawAnswers(pdf, question);
  
  // Add hint if available
  if (question.hint) {
    const hintText = getTextValue(question.hint);
    drawHint(pdf, hintText);
  }
}

function drawCardOutline(pdf: jsPDF) {
  // Set card border
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.1);
  
  // Draw rounded rectangle for card
  pdf.roundedRect(
    MARGINS.x, 
    MARGINS.y, 
    CARD_SIZE.width, 
    CARD_SIZE.height, 
    CARD_SIZE.cornerRadius, 
    CARD_SIZE.cornerRadius
  );
}

function drawCutMarks(pdf: jsPDF) {
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.1);
  
  const markLength = 2;
  
  // Corner cut marks
  const corners = [
    { x: 0, y: 0 }, // top-left
    { x: CARD_SIZE.docWidth, y: 0 }, // top-right
    { x: 0, y: CARD_SIZE.docHeight }, // bottom-left
    { x: CARD_SIZE.docWidth, y: CARD_SIZE.docHeight } // bottom-right
  ];
  
  corners.forEach(corner => {
    // Horizontal marks
    if (corner.x === 0) {
      pdf.line(corner.x, corner.y, corner.x + markLength, corner.y);
    } else {
      pdf.line(corner.x - markLength, corner.y, corner.x, corner.y);
    }
    
    // Vertical marks
    if (corner.y === 0) {
      pdf.line(corner.x, corner.y, corner.x, corner.y + markLength);
    } else {
      pdf.line(corner.x, corner.y - markLength, corner.x, corner.y);
    }
  });
}

function drawLogo(pdf: jsPDF, side: 'front' | 'back') {
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

function drawRegulationBadge(pdf: jsPDF, regulation?: RegulationCategory) {
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

function drawQuestionText(pdf: jsPDF, text: string) {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  
  const maxWidth = CONTENT_MARGINS.width - 4;
  const startY = CONTENT_MARGINS.y + 15;
  
  // Split text into lines that fit
  const lines = pdf.splitTextToSize(text, maxWidth);
  
  // Draw text with proper line spacing
  pdf.text(lines, CONTENT_MARGINS.x + 2, startY);
}

function drawSubcategory(pdf: jsPDF, subcategory: string) {
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 100, 100);
  
  const categoryY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - 12;
  pdf.text(subcategory, CONTENT_MARGINS.x + 2, categoryY);
}

function drawAnswers(pdf: jsPDF, question: Question) {
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

function drawHint(pdf: jsPDF, hint: string) {
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(60, 130, 246); // Blue color for hints
  
  const maxWidth = CONTENT_MARGINS.width - 4;
  const hintY = CONTENT_MARGINS.y + CONTENT_MARGINS.height - 20;
  
  const lines = pdf.splitTextToSize(`💡 ${hint}`, maxWidth);
  pdf.text(lines, CONTENT_MARGINS.x + 2, hintY);
}
