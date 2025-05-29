
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

// Professional color system with category-specific colors
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
  },
  // Category-specific colors for signal types
  signalCategories: {
    // Hauptsignale - Red (traditional railway signal color)
    Hp: [220, 38, 27],
    // Vorsignale - Yellow/Orange (warning colors)
    Vr: [255, 152, 0],
    // Kombinationssignale - Purple (combination of red and blue)
    Ks: [147, 51, 234],
    // Fahrleitungssignale - Blue (electrical systems)
    El: [59, 130, 246],
    // Zusatzsignale - Green (auxiliary/secondary)
    Zs: [34, 197, 94],
    // Langsamfahrsignale - Amber (speed restriction)
    Lf: [245, 158, 11],
    // Rangiersignale - Teal (operational signals)
    Sh: [20, 184, 166],
    Ra: [20, 184, 166],
    // Weichensignale - Indigo (track equipment)
    Wn: [99, 102, 241],
    // Sonstige Signale - Gray (miscellaneous)
    So: [107, 114, 128],
    Ne: [107, 114, 128],
    // Bahnübergangssignale - Red-Orange (safety critical)
    Bü: [239, 68, 68],
    // Blocksignale - Dark Blue (block system)
    Bl: [30, 64, 175],
    // Zugsignale - Emerald (train operations)
    Zg: [16, 185, 129],
    // Default colors for other categories
    default: [107, 114, 128]
  },
  // Betriebsdienst category colors
  betriebsdienstCategories: {
    grundlagen: [63, 0, 255], // Ultramarine - foundational knowledge
    uvv: [220, 38, 27], // Red - safety critical
    rangieren: [20, 184, 166], // Teal - operational
    fahren: [34, 197, 94], // Green - active operations
    pzb: [147, 51, 234], // Purple - technical systems
    kommunikation: [59, 130, 246], // Blue - communication
    besonderheiten: [245, 158, 11], // Amber - special cases
    unregelmäßigkeiten: [239, 68, 68], // Red-Orange - irregularities
    default: [107, 114, 128] // Gray - default
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
