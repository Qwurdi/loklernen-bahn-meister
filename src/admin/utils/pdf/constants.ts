
import { CardDimensions, Margins, ContentMargins } from './types';

// Professional card dimensions in mm - optimized for premium print quality
export const CARD_SIZE: CardDimensions = {
  width: 59,
  height: 91,
  docWidth: 65,
  docHeight: 97,
  contentWidth: 51,
  contentHeight: 81,
  cornerRadius: 4
};

// Calculate margins to center the card
export const MARGINS: Margins = {
  x: (CARD_SIZE.docWidth - CARD_SIZE.width) / 2,
  y: (CARD_SIZE.docHeight - CARD_SIZE.height) / 2
};

// Professional content area margins - more conservative spacing
export const CONTENT_MARGINS: ContentMargins = {
  x: (CARD_SIZE.width - CARD_SIZE.contentWidth) / 2 + MARGINS.x,
  y: (CARD_SIZE.height - CARD_SIZE.contentHeight) / 2 + MARGINS.y,
  width: CARD_SIZE.contentWidth,
  height: CARD_SIZE.contentHeight
};

// Enhanced professional typography system with more dramatic differences
export const TYPOGRAPHY = {
  logo: {
    size: 9, // Increased from 8
    weight: 'bold'
  },
  badge: {
    size: 7, // Increased from 6.5
    weight: 'bold'
  },
  question: {
    large: 12, // Increased from 11
    medium: 10, // Same
    small: 8, // Decreased from 9 for more contrast
    weight: 'normal',
    lineHeight: 1.5 // Increased from 1.4
  },
  answer: {
    header: 8, // Increased from 7.5
    text: 10, // Increased from 9.5
    weight: 'normal',
    lineHeight: 1.4 // Increased from 1.3
  },
  subcategory: {
    size: 6, // Decreased from 6.5 for more subtlety
    weight: 'italic'
  },
  hint: {
    size: 7, // Increased from 6.5
    weight: 'normal'
  }
};

// Enhanced professional color system with better contrast
export const COLORS = {
  primary: {
    ultramarine: [63, 0, 255],
    sapphire: [15, 82, 186],
    black: [0, 0, 0]
  },
  semantic: {
    success: [34, 197, 94],
    info: [59, 130, 246],
    text: {
      primary: [20, 20, 20], // Darker for better contrast
      secondary: [80, 80, 80], // Darker
      light: [120, 120, 120] // Darker
    }
  },
  borders: {
    light: [220, 220, 220], // Slightly darker
    medium: [180, 180, 180], // Darker
    card: [160, 160, 160] // Darker for more definition
  },
  backgrounds: {
    light: [246, 246, 246], // Slightly darker
    white: [255, 255, 255],
    subtle: [252, 252, 252] // New subtle background
  }
};

// Enhanced layout zones with better spacing
export const LAYOUT_ZONES = {
  header: {
    height: 12, // Increased from 10
    margin: 3 // Increased from 2
  },
  content: {
    minTextHeight: 20, // Increased from 15
    maxImageHeight: 30, // Decreased from 35 for better balance
    spacing: 5 // Increased from 3 for better separation
  },
  footer: {
    height: 10, // Increased from 8
    margin: 3 // Increased from 2
  }
};
