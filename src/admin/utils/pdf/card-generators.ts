
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
  drawQuestionImage
} from './card-content';

export async function generateCardFront(pdf: jsPDF, question: Question, regulation: RegulationCategory) {
  // Draw card outline with rounded corners
  drawCardOutline(pdf);
  
  // Draw cut marks
  drawCutMarks(pdf);
  
  // Add LokLernen logo at top
  drawLogo(pdf, 'front');
  
  // Add regulation badge
  drawRegulationBadge(pdf, question.regulation_category || regulation);
  
  const questionText = getTextValue(question.text);
  
  // Handle image if present
  if (question.image_url) {
    try {
      // Draw image first and get the Y position after it
      const nextY = await drawQuestionImage(pdf, question.image_url);
      
      // Draw question text after the image
      await drawQuestionText(pdf, questionText, nextY);
    } catch (error) {
      console.error('Error loading image for question:', question.id, error);
      // Fallback: draw text normally if image fails
      await drawQuestionText(pdf, questionText);
    }
  } else {
    // No image, draw text normally
    await drawQuestionText(pdf, questionText);
  }
  
  // Add subcategory
  drawSubcategory(pdf, question.sub_category);
}

export async function generateCardBack(pdf: jsPDF, question: Question, regulation: RegulationCategory) {
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
