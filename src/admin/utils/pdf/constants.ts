
import { CardDimensions, Margins, ContentMargins } from './types';

// Card dimensions in mm - optimized for better proportions
export const CARD_SIZE: CardDimensions = {
  width: 59,
  height: 91,
  docWidth: 65,
  docHeight: 97,
  contentWidth: 53, // Slightly larger content area
  contentHeight: 85, // More content space
  cornerRadius: 5
};

// Calculate margins to center the card
export const MARGINS: Margins = {
  x: (CARD_SIZE.docWidth - CARD_SIZE.width) / 2,
  y: (CARD_SIZE.docHeight - CARD_SIZE.height) / 2
};

// Content area margins from card edge - improved spacing
export const CONTENT_MARGINS: ContentMargins = {
  x: (CARD_SIZE.width - CARD_SIZE.contentWidth) / 2 + MARGINS.x,
  y: (CARD_SIZE.height - CARD_SIZE.contentHeight) / 2 + MARGINS.y,
  width: CARD_SIZE.contentWidth,
  height: CARD_SIZE.contentHeight
};
