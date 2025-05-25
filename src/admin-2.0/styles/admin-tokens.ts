
// Admin Panel 2.0 Design Tokens
export const adminTokens = {
  colors: {
    primary: {
      ultramarine: '#3F00FF',
      sapphire: '#0F52BA', 
      betriebsdienst: '#00B8A9'
    },
    accent: {
      digitalLavender: '#9683EC',
      neoMint: '#C7F0BD',
      tranquilBlue: '#5080FF',
      digitalCoral: '#FF6D70'
    },
    neutral: {
      white: '#FFFFFF',
      gray50: '#F6F6F7',
      gray100: '#F1F1F1',
      gray200: '#E0E0E0',
      gray300: '#CCCCCC',
      gray400: '#888888',
      gray500: '#555555',
      gray900: '#222222'
    }
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #3F00FF 0%, #0F52BA 100%)',
    success: 'linear-gradient(135deg, #00B8A9 0%, #C7F0BD 100%)',
    warning: 'linear-gradient(135deg, #FF6D70 0%, #9683EC 100%)'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem', 
    lg: '0.75rem',
    xl: '1rem'
  }
};

// Generate CSS custom properties for the admin panel
export const generateCSSVars = () => {
  const cssVars: Record<string, string> = {};
  
  // Colors
  Object.entries(adminTokens.colors.primary).forEach(([key, value]) => {
    cssVars[`--admin-color-primary-${key}`] = value;
  });
  
  Object.entries(adminTokens.colors.accent).forEach(([key, value]) => {
    cssVars[`--admin-color-accent-${key}`] = value;
  });
  
  Object.entries(adminTokens.colors.neutral).forEach(([key, value]) => {
    cssVars[`--admin-color-neutral-${key}`] = value;
  });
  
  // Gradients
  Object.entries(adminTokens.gradients).forEach(([key, value]) => {
    cssVars[`--admin-gradient-${key}`] = value;
  });
  
  return cssVars;
};
