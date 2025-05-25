
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
  drawHint 
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
  
  // Add question text
  const questionText = getTextValue(question.text);
  drawQuestionText(pdf, questionText);
  
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
