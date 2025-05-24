
import React from 'react';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLearningSession } from '../useLearningSession';
import { AuthProvider } from '@/contexts/AuthContext';
import { describe, expect, it, beforeEach } from 'vitest';

// Create wrapper for providers
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

describe('useLearningSession', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    wrapper = createWrapper();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useLearningSession(), { wrapper });
    
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.correctCount).toBe(0);
    expect(result.current.sessionFinished).toBe(false);
    expect(typeof result.current.handleAnswer).toBe('function');
    expect(typeof result.current.handleComplete).toBe('function');
    expect(typeof result.current.handleRestart).toBe('function');
  });

  it('provides session options from URL parameters', () => {
    const { result } = renderHook(() => useLearningSession(), { wrapper });
    
    expect(result.current.sessionOptions).toBeDefined();
    expect(typeof result.current.sessionOptions.regulation).toBe('string');
    expect(typeof result.current.sessionOptions.mode).toBe('string');
  });

  it('provides navigation and actions', () => {
    const { result } = renderHook(() => useLearningSession(), { wrapper });
    
    expect(typeof result.current.handleRegulationChange).toBe('function');
    expect(result.current.navigate).toBeDefined();
    expect(typeof result.current.sessionTitle).toBe('string');
  });
});
