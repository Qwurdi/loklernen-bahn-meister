
import { jsPDF } from 'jspdf';
import { CARD_SIZE, MARGINS, COLORS } from './constants';

export function drawCardOutline(pdf: jsPDF) {
  // Professional card border with proper color typing
  pdf.setDrawColor(COLORS.borders.card[0], COLORS.borders.card[1], COLORS.borders.card[2]);
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
  pdf.setDrawColor(COLORS.primary.black[0], COLORS.primary.black[1], COLORS.primary.black[2]);
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
