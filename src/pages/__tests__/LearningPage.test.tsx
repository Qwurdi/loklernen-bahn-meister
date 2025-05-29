
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LearningPage from '../LearningPage';

// Mock the hooks
const mockUseLearningSession = {
  loading: false,
  error: null,
  questions: [],
  currentIndex: 0,
  setCurrentIndex: () => {},
  correctCount: 0,
  sessionFinished: false,
  sessionTitle: 'Test Session',
  sessionOptions: {},
  handleAnswer: () => {},
  handleComplete: () => {},
  handleRestart: () => {},
  canAccess: true,
  categoryRequiresAuth: false
};

const mockUseAuth = {
  user: { id: 'test-user' }
};

const mockUseUserPreferences = {
  regulationPreference: 'DS 301'
};

// Create mock modules
vi.mock('@/hooks/learning-session', () => ({
  useLearningSession: () => mockUseLearningSession
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth
}));

vi.mock('@/contexts/UserPreferencesContext', () => ({
  useUserPreferences: () => mockUseUserPreferences
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
