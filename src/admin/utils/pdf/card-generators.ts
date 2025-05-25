
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
      
      // Draw question text after the image if there is text
      if (questionText.trim()) {
        await drawQuestionText(pdf, questionText, nextY);
      }
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
  
  // Add answers and get the Y position after them
  const afterAnswersY = await drawAnswers(pdf, question);
  
  // Add image if available (between answers and hint)
  let afterImageY = afterAnswersY;
  if (question.image_url) {
    try {
      afterImageY = await drawAnswerImage(pdf, question.image_url, afterAnswersY);
    } catch (error) {
      console.error('Error loading image for answer side:', question.id, error);
      // Continue without image if it fails
    }
  }
  
  // Add hint if available, positioned after image or answers
  if (question.hint) {
    const hintText = getTextValue(question.hint);
    const hintY = Math.max(afterImageY + 3, 75); // Ensure hint doesn't overlap with logo
    drawHint(pdf, hintText, hintY);
  }
}
