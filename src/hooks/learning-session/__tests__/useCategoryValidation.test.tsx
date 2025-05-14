
import { renderHook, act } from '@testing-library/react';
import { useCategoryValidation } from '../useCategoryValidation';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Category } from '@/api/categories/types';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({
    pathname: '/karteikarten/lernen/Signale'
  }))
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn()
  }
}));

// Mock category data
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Haupt- und Vorsignale',
    parent_category: 'Signale',
    description: 'Hauptsignale und Vorsignale',
    isPro: false,
    isPlanned: false,
    requiresAuth: false,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Grundlagen Bahnbetrieb',
    parent_category: 'Betriebsdienst',
    description: 'Grundlegende Konzepte des Bahnbetriebs',
    isPro: false,
    isPlanned: false,
    requiresAuth: true,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z'
  }
];

describe('useCategoryValidation hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ user: null });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCategoryValidation([], false, null, false));
    
    expect(result.current.categoryRequiresAuth).toBe(null);
    expect(result.current.categoryFound).toBe(null);
    expect(result.current.isParentCategory).toBe(false);
  });

  it('should handle parent category Signale correctly', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Signale', false));
    
    expect(result.current.categoryFound).toBe(true);
    expect(result.current.isParentCategory).toBe(true);
    expect(result.current.categoryRequiresAuth).toBe(false);
  });

  it('should handle parent category Betriebsdienst correctly', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Betriebsdienst', false));
    
    expect(result.current.categoryFound).toBe(true);
    expect(result.current.isParentCategory).toBe(true);
    expect(result.current.categoryRequiresAuth).toBe(true);
  });

  it('should handle categories with regulation info', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Signale (DS 301)', false));
    
    expect(result.current.categoryFound).toBe(true);
    expect(result.current.isParentCategory).toBe(true);
    expect(result.current.categoryRequiresAuth).toBe(false);
    
    // Test strip regulation info function
    expect(result.current.stripRegulationInfo('Signale (DS 301)')).toBe('Signale');
  });

  it('should redirect to login for auth-required categories', () => {
    const navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
    (useAuth as any).mockReturnValue({ user: null });
    
    renderHook(() => useCategoryValidation(mockCategories, false, 'Betriebsdienst', false));
    
    expect(navigateMock).toHaveBeenCalledWith('/login', expect.any(Object));
    expect(toast.info).toHaveBeenCalled();
  });

  it('should not redirect to login for auth-required categories if user is logged in', () => {
    const navigateMock = vi.fn();
    (useNavigate as any).mockReturnValue(navigateMock);
    (useAuth as any).mockReturnValue({ user: { id: 'test-user' } });
    
    renderHook(() => useCategoryValidation(mockCategories, false, 'Betriebsdienst', false));
    
    expect(navigateMock).not.toHaveBeenCalled();
    expect(toast.info).not.toHaveBeenCalled();
  });

  it('should handle subcategory correctly', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Haupt- und Vorsignale', false));
    
    expect(result.current.categoryFound).toBe(true);
    expect(result.current.isParentCategory).toBe(false);
    expect(result.current.categoryRequiresAuth).toBe(false);
  });

  it('should mark category as not found if it does not exist', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Non-existent Category', false));
    
    expect(result.current.categoryFound).toBe(false);
    expect(result.current.isParentCategory).toBe(false);
    expect(result.current.categoryRequiresAuth).toBe(null);
  });

  it('should skip category validation in due cards view', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Any Category', true));
    
    expect(result.current.categoryFound).toBe(true);
    expect(result.current.categoryRequiresAuth).toBe(false);
    expect(result.current.isParentCategory).toBe(false);
  });

  it('should return null for getCategoryForSpacedRepetition in due cards view', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Signale', true));
    
    expect(result.current.getCategoryForSpacedRepetition()).toBe(null);
  });

  it('should return the category as QuestionCategory for getCategoryForSpacedRepetition', () => {
    const { result } = renderHook(() => useCategoryValidation(mockCategories, false, 'Signale', false));
    
    expect(result.current.getCategoryForSpacedRepetition()).toBe('Signale');
  });

  it('should handle loading state correctly', () => {
    const { result } = renderHook(() => useCategoryValidation([], true, 'Signale', false));
    
    expect(result.current.categoryFound).toBe(null);
    expect(result.current.categoryRequiresAuth).toBe(null);
    expect(result.current.isParentCategory).toBe(false);
  });
});
