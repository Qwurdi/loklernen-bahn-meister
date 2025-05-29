
// Centralized route definitions for type-safe navigation
export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Learning routes - Updated to German structure
  CARDS: '/karteikarten',
  LEARNING: '/karteikarten/lernen',
  
  // User routes (require auth) - German structure
  DASHBOARD: '/dashboard',
  PROGRESS: '/fortschritt',
  SETTINGS: '/einstellungen',
  
  // Legal pages - German structure
  PRIVACY: '/datenschutz',
  IMPRINT: '/impressum',
  TERMS: '/agb',
  
  // Auth flow routes
  VERIFY_EMAIL: '/verify-email',
  RESET_PASSWORD: '/reset-password',
  REQUEST_PASSWORD_RESET: '/request-password-reset',
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_USERS: '/admin/users',
} as const;

// Route metadata for navigation components
export const ROUTE_METADATA = {
  [ROUTES.HOME]: { title: 'Home', requiresAuth: false },
  [ROUTES.CARDS]: { title: 'Karteikarten', requiresAuth: false },
  [ROUTES.PROGRESS]: { title: 'Fortschritt', requiresAuth: true },
  [ROUTES.SETTINGS]: { title: 'Einstellungen', requiresAuth: true },
  [ROUTES.PRIVACY]: { title: 'Datenschutz', requiresAuth: false },
  [ROUTES.IMPRINT]: { title: 'Impressum', requiresAuth: false },
  [ROUTES.TERMS]: { title: 'AGB', requiresAuth: false },
} as const;

// Helper function to check if route exists
export const isValidRoute = (path: string): boolean => {
  return Object.values(ROUTES).includes(path as any);
};
