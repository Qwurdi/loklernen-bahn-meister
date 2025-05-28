
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LearningPage from '../LearningPage';

// Mock the hooks
vi.mock('@/hooks/learning-session', () => ({
  useLearningSession: () => ({
    loading: false,
    error: null,
    questions: [],
    currentIndex: 0,
    setCurrentIndex: vi.fn(),
    correctCount: 0,
    sessionFinished: false,
    sessionTitle: 'Test Session',
    sessionOptions: {},
    handleAnswer: vi.fn(),
    handleComplete: vi.fn(),
    handleRestart: vi.fn(),
    canAccess: true,
    categoryRequiresAuth: false
  })
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' }
  })
}));

vi.mock('@/contexts/UserPreferencesContext', () => ({
  useUserPreferences: () => ({
    regulationPreference: 'DS 301'
  })
}));

describe('LearningPage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  it('renders without crashing', () => {
    renderWithRouter(<LearningPage />);
  });
});
