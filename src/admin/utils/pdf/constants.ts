
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

// Professional typography system
export const TYPOGRAPHY = {
  logo: {
    size: 8,
    weight: 'bold'
  },
  badge: {
    size: 6.5,
    weight: 'bold'
  },
  question: {
    large: 11,
    medium: 10,
    small: 9,
    weight: 'normal',
    lineHeight: 1.4
  },
  answer: {
    header: 7.5,
    text: 9.5,
    weight: 'normal',
    lineHeight: 1.3
  },
  subcategory: {
    size: 6.5,
    weight: 'italic'
  },
  hint: {
    size: 6.5,
    weight: 'normal'
  }
};

// Professional color system
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
      primary: [30, 30, 30],
      secondary: [100, 100, 100],
      light: [140, 140, 140]
    }
  },
  borders: {
    light: [230, 230, 230],
    medium: [200, 200, 200],
    card: [180, 180, 180]
  },
  backgrounds: {
    light: [248, 248, 248],
    white: [255, 255, 255]
  }
};

// Layout zones for intelligent content placement
export const LAYOUT_ZONES = {
  header: {
    height: 10,
    margin: 2
  },
  content: {
    minTextHeight: 15,
    maxImageHeight: 35,
    spacing: 3
  },
  footer: {
    height: 8,
    margin: 2
  }
};
