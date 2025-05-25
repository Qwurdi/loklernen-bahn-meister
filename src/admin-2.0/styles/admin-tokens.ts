
// Admin Panel 2.0 - Design Tokens
export const adminTokens = {
  colors: {
    // Brand colors from LokLernen design system
    primary: {
      ultramarine: '#3F00FF',
      sapphire: '#0F52BA',
      betriebsdienst: '#00B8A9'
    },
    
    // Semantic colors
    success: '#22C55E',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutral colors
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    },
    
    // Admin specific
    admin: {
      bg: '#FAFBFC',
      sidebar: '#FFFFFF',
      surface: '#FFFFFF',
      border: '#E2E8F0',
      accent: '#F1F5F9'
    }
  },
  
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px  
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },
  
  typography: {
    fonts: {
      primary: 'Inter, system-ui, sans-serif'
    },
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'   // 36px
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  borders: {
    radius: {
      sm: '0.25rem',   // 4px
      md: '0.375rem',  // 6px
      lg: '0.5rem',    // 8px
      xl: '0.75rem'    // 12px
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '3px'
    }
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  
  transitions: {
    fast: '150ms ease-out',
    normal: '250ms ease-out', 
    slow: '400ms ease-out'
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
} as const;

// CSS Custom Properties Generator
export const generateCSSVars = () => {
  const vars: Record<string, string> = {};
  
  // Generate color variables
  Object.entries(adminTokens.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--admin-color-${key}`] = value;
    } else {
      Object.entries(value).forEach(([subKey, subValue]) => {
        vars[`--admin-color-${key}-${subKey}`] = subValue;
      });
    }
  });
  
  // Generate spacing variables
  Object.entries(adminTokens.spacing).forEach(([key, value]) => {
    vars[`--admin-spacing-${key}`] = value;
  });
  
  return vars;
};
