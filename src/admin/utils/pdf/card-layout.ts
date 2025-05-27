
import { jsPDF } from 'jspdf';
import { CARD_SIZE, MARGINS, COLORS } from './constants';

export function drawCardOutline(pdf: jsPDF) {
  // Professional card border
  pdf.setDrawColor(...COLORS.borders.card);
  pdf.setLineWidth(0.08);
  
  // Draw professional rounded rectangle
  pdf.roundedRect(
    MARGINS.x, 
    MARGINS.y, 
    CARD_SIZE.width, 
    CARD_SIZE.height, 
    CARD_SIZE.cornerRadius, 
    CARD_SIZE.cornerRadius
  );
}

export function drawCutMarks(pdf: jsPDF) {
  pdf.setDrawColor(...COLORS.primary.black);
  pdf.setLineWidth(0.08);
  
  const markLength = 1.5;
  
  // Professional corner cut marks
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
