
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import LearningPage from '../LearningPage';

// Mock the learning session hook
vi.mock('@/hooks/learning-session', () => ({
  useLearningSession: () => ({
    loading: false,
    error: null,
    canAccess: true,
    categoryRequiresAuth: false,
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    sessionFinished: false,
    sessionTitle: 'Test Session',
    sessionOptions: { mode: 'practice' },
    handleAnswer: vi.fn(),
    handleComplete: vi.fn(),
    handleRestart: vi.fn(),
    handleRegulationChange: vi.fn(),
    setCurrentIndex: vi.fn(),
  })
}));

// Mock mobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('LearningPage', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    wrapper = createWrapper();
  });

  it('renders without crashing', () => {
    render(<LearningPage />, { wrapper });
    
    const emptyStateHeading = screen.getByText('Keine Karten verfügbar');
    expect(emptyStateHeading).toBeInTheDocument();
  });

  it('shows no cards available message when questions array is empty', () => {
    render(<LearningPage />, { wrapper });
    
    const emptyStateHeading = screen.getByText('Keine Karten verfügbar');
    const emptyStateMessage = screen.getByText('Es sind keine Lernkarten für die ausgewählten Kriterien verfügbar.');
    
    expect(emptyStateHeading).toBeInTheDocument();
    expect(emptyStateMessage).toBeInTheDocument();
  });

  it('displays back button in empty state', () => {
    render(<LearningPage />, { wrapper });
    
    const backButton = screen.getByRole('button', { name: /zurück zur übersicht/i });
    expect(backButton).toBeInTheDocument();
  });
});
