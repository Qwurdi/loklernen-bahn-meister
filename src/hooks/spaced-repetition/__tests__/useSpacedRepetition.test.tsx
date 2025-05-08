
import { renderHook } from '@testing-library/react';
import { useSpacedRepetition } from '../useSpacedRepetition';
import { vi } from 'vitest';

// Mock spaced repetition services
vi.mock('../services', () => ({
  fetchDueCardsForSR: vi.fn().mockResolvedValue([]),
  fetchCategoryCardsForSR: vi.fn().mockResolvedValue([]),
  fetchSpecificCardsForSR: vi.fn().mockResolvedValue([]),
  fetchAllCardsForSR: vi.fn().mockResolvedValue([]),
  updateUserProgress: vi.fn().mockResolvedValue({}),
  updateUserStats: vi.fn().mockResolvedValue({}),
  fetchUserProgress: vi.fn().mockResolvedValue([])
}));

// Mock auth context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user' },
  }))
}));

describe('useSpacedRepetition', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(global.fetch).mockClear();
  });
  
  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSpacedRepetition('test-user'));
    
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.dueQuestions).toEqual([]);
  });
  
  it('should load cards on initialization', async () => {
    const { result } = renderHook(() => useSpacedRepetition('test-user'));
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.dueQuestions).toEqual([]);
  });
  
  it('should submit answers and update progress', async () => {
    const { result } = renderHook(() => useSpacedRepetition('test-user'));
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.pendingUpdatesCount).toBe(0);
  });
  
  it('should handle category-based sessions', async () => {
    const { result } = renderHook(() => useSpacedRepetition('test-user'));
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await result.current.startNewSession('category', 'Signale');
    
    expect(result.current.loading).toBe(false);
  });
  
  it('should handle specific card IDs', async () => {
    const { result } = renderHook(() => useSpacedRepetition('test-user'));
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await result.current.startNewSession('specific_ids', undefined, undefined, [1, 2, 3]);
    
    expect(result.current.loading).toBe(false);
  });
  
  it('should handle guest mode', async () => {
    const { result } = renderHook(() => useSpacedRepetition(undefined));
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    await result.current.startNewSession('guest', 'Signale');
    
    expect(result.current.loading).toBe(false);
  });
  
  it('should reload questions', async () => {
    const { result } = renderHook(() => useSpacedRepetition('test-user'));
    
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    result.current.reloadQuestions();
    
    expect(result.current.loading).toBe(true);
  });
});
