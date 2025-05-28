
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LearningPage from '../LearningPage';

// Mock the hooks
vi.mock('@/hooks/learning-session', () => ({
  useLearningSession: () => ({
    loading: false,
    error: null,
    questions: [],
    currentQuestionIndex: 0,
    progress: { current: 0, total: 0 },
    submitAnswer: vi.fn(),
    loadQuestions: vi.fn(),
    sessionComplete: false
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
