
import { jsPDF } from 'jspdf';
import { Question, RegulationCategory } from '@/types/questions';
import { getTextValue } from '@/types/rich-text';
import { drawCardOutline, drawCutMarks } from './card-layout';
import { 
  drawLogo, 
  drawRegulationBadge, 
  drawQuestionText, 
  drawSubcategory, 
  drawAnswers, 
  drawHint,
  drawQuestionImage,
  drawAnswerImage
} from './card-content';
import { calculateQuestionLayout, calculateAnswerLayout } from './layout-engine';

export async function generateCardFront(pdf: jsPDF, question: Question, regulation: RegulationCategory) {
  // Draw professional card foundation
  drawCardOutline(pdf);
  drawCutMarks(pdf);
  
  // Professional logo placement
  drawLogo(pdf, 'front');
  
  // Smart regulation badge (only for specific regulations)
  drawRegulationBadge(pdf, question.regulation_category || regulation);
  
  // Calculate optimal layout using professional layout engine
  const layout = calculateQuestionLayout(pdf, question);
  
  // Draw image first if present and space allows
  if (layout.imageArea && question.image_url) {
    try {
      await drawQuestionImage(pdf, question.image_url, layout.imageArea);
    } catch (error) {
      console.error('Error loading image for question:', question.id, error);
      // Continue without image if it fails
    }
  }
  
  // Draw question text with calculated optimal font size
  const questionText = getTextValue(question.text);
  if (questionText.trim()) {
    drawQuestionText(pdf, questionText, layout.textArea, layout.fontSize);
  }
  
  // Professional subcategory placement
  drawSubcategory(pdf, question.sub_category, layout.subcategoryY);
}

export async function generateCardBack(pdf: jsPDF, question: Question, regulation: RegulationCategory) {
  // Draw professional card foundation
  drawCardOutline(pdf);
  drawCutMarks(pdf);
  
  // Professional logo at bottom
  drawLogo(pdf, 'back');
  
  // Calculate optimal answer layout
  const layout = calculateAnswerLayout(pdf, question);
  
  // Draw answers with professional formatting
  const afterAnswersY = await drawAnswers(pdf, question, layout.answersY);
  
  // Draw image if available and space calculated
  if (question.image_url && layout.imageY && layout.availableImageHeight >= 15) {
    try {
      const maxWidth = CONTENT_MARGINS.width - 6;
      await drawAnswerImage(
        pdf, 
        question.image_url, 
        CONTENT_MARGINS.x + 3,
        layout.imageY,
        maxWidth,
        layout.availableImageHeight
      );
    } catch (error) {
      console.error('Error loading image for answer side:', question.id, error);
      // Continue without image if it fails
    }
  }
  
  // Professional hint placement if available
  if (question.hint && layout.hintY) {
    const hintText = getTextValue(question.hint);
    drawHint(pdf, hintText, layout.hintY);
  }
}
