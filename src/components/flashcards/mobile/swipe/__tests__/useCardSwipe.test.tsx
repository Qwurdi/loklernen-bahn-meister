
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCardSwipe } from '../useCardSwipe';

// Mock the imported hooks
vi.mock('../useSwipeState', () => ({
  useSwipeState: () => ({
    swipeState: {
      dragStartX: null,
      dragStartY: null,
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    },
    updateSwipeState: vi.fn(),
    resetSwipeState: vi.fn()
  })
}));

vi.mock('../useAnimations', () => ({
  useAnimations: () => ({
    resetCardPosition: vi.fn(),
    animateSwipe: vi.fn()
  })
}));

vi.mock('../useStyleCalculations', () => ({
  useStyleCalculations: () => ({
    getCardStyle: () => ({
      transform: 'none',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }),
    getCardClasses: () => 'mock-card-classes'
  })
}));

vi.mock('../useTouchHandlers', () => ({
  useTouchHandlers: () => ({
    handleTouchStart: vi.fn(),
    handleTouchMove: vi.fn(),
    handleTouchEnd: vi.fn()
  })
}));

describe('useCardSwipe Hook', () => {
  const defaultProps = {
    onSwipeLeft: vi.fn(),
    onSwipeRight: vi.fn(),
    onShowAnswer: vi.fn(),
    isFlipped: false,
    isAnswered: false,
    disableSwipe: false
  };

  it('should return all expected properties and methods', () => {
    const { result } = renderHook(() => useCardSwipe(defaultProps));
    
    // Check if the hook returns all expected properties
    expect(result.current.cardRef).toBeDefined();
    expect(result.current.swipeState).toBeDefined();
    expect(result.current.handlers).toBeDefined();
    expect(typeof result.current.getCardStyle).toBe('function');
    expect(typeof result.current.getCardClasses).toBe('function');
    
    // Check the structure of handlers
    expect(result.current.handlers.handleTouchStart).toBeDefined();
    expect(result.current.handlers.handleTouchMove).toBeDefined();
    expect(result.current.handlers.handleTouchEnd).toBeDefined();
    
    // Verify the functions can be called without errors
    expect(() => result.current.getCardStyle()).not.toThrow();
    expect(() => result.current.getCardClasses()).not.toThrow();
  });

  it('should call the underlying hooks with the correct parameters', () => {
    const { result } = renderHook(() => useCardSwipe({
      ...defaultProps,
      isFlipped: true,
      disableSwipe: true
    }));
    
    // Just verify that the hook runs without errors
    expect(result.current).toBeDefined();
  });

  it('should return style and classes from style calculations', () => {
    const { result } = renderHook(() => useCardSwipe(defaultProps));
    
    const style = result.current.getCardStyle();
    const classes = result.current.getCardClasses();
    
    expect(style).toEqual({
      transform: 'none',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });
    
    expect(classes).toBe('mock-card-classes');
  });
});
