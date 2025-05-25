
import { jsPDF } from 'jspdf';
import { RegulationCategory } from '@/types/questions';
import { CONTENT_MARGINS, TYPOGRAPHY, COLORS } from './constants';

export function drawLogo(pdf: jsPDF, side: 'front' | 'back') {
  pdf.setFontSize(TYPOGRAPHY.logo.size);
  pdf.setFont('helvetica', TYPOGRAPHY.logo.weight);
  
  const logoY = side === 'front' 
    ? CONTENT_MARGINS.y + 3 
    : CONTENT_MARGINS.y + CONTENT_MARGINS.height - 4;
  
  // Professional logo placement
  pdf.setTextColor(COLORS.primary.black[0], COLORS.primary.black[1], COLORS.primary.black[2]);
  pdf.text('Lok', CONTENT_MARGINS.x + 2, logoY);
  
  pdf.setTextColor(COLORS.primary.ultramarine[0], COLORS.primary.ultramarine[1], COLORS.primary.ultramarine[2]);
  const lokWidth = pdf.getTextWidth('Lok');
  pdf.text('Lernen', CONTENT_MARGINS.x + 2 + lokWidth, logoY);
}

export function drawRegulationBadge(pdf: jsPDF, regulation?: RegulationCategory) {
  // Only draw badge for specific regulations, not for "both"
  if (!regulation || regulation === 'both') {
    return; // No badge for "both" regulation cards
  }
  
  pdf.setFontSize(TYPOGRAPHY.badge.size);
  pdf.setFont('helvetica', TYPOGRAPHY.badge.weight);
  
  // Professional badge design with proper color typing
  const badgeColor = regulation === 'DS 301' 
    ? COLORS.primary.ultramarine 
    : COLORS.primary.sapphire;
  
  pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  
  const badgeText = regulation;
  const textWidth = pdf.getTextWidth(badgeText);
  const badgeWidth = textWidth + 4;
  const badgeHeight = 6;
  const badgeX = CONTENT_MARGINS.x + CONTENT_MARGINS.width - badgeWidth - 1;
  const badgeY = CONTENT_MARGINS.y + 2;
  
  // Draw professional badge with rounded corners
  pdf.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 1.5, 1.5, 'F');
  
  // Badge text - perfectly centered
  pdf.setTextColor(COLORS.backgrounds.white[0], COLORS.backgrounds.white[1], COLORS.backgrounds.white[2]);
  pdf.text(badgeText, badgeX + 2, badgeY + 4.2);
}
