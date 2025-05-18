
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import useCardSwipe from '../useCardSwipe';

// Mock for the useTouchHandlers import
vi.mock('../useTouchHandlers', () => {
  return {
    useTouchHandlers: (options: any) => {
      // Return the original implementation or a mock as needed
      const original = vi.importActual('../useTouchHandlers');
      return (original as any).useTouchHandlers(options);
    }
  };
});

describe('Swipe System Integration', () => {
  const mockHandlers = {
    onSwipeLeft: vi.fn(),
    onSwipeRight: vi.fn(),
    onShowAnswer: vi.fn()
  };
  
  const createMockTouchEvent = (x: number, y: number) => ({
    preventDefault: vi.fn(),
    touches: [{ clientX: x, clientY: y }]
  } as unknown as React.TouchEvent);

  it('should handle a complete swipe interaction flow', () => {
    // Render the hook with required props
    const { result } = renderHook(() => 
      useCardSwipe({
        onSwipeLeft: mockHandlers.onSwipeLeft,
        onSwipeRight: mockHandlers.onSwipeRight,
        onShowAnswer: mockHandlers.onShowAnswer,
        isFlipped: true,
        isAnswered: false,
        disableSwipe: false
      })
    );

    // Initial state verification
    expect(result.current.swipeState.isDragging).toBe(false);
    expect(result.current.swipeState.dragStartX).toBeNull();
    
    // Start a swipe
    act(() => {
      result.current.handlers.handleTouchStart(createMockTouchEvent(100, 200));
    });
    
    // Drag phase
    act(() => {
      result.current.handlers.handleTouchMove(createMockTouchEvent(170, 210));
    });
    
    // End the swipe - this should trigger swipeRight since the threshold is 60px
    // and we moved 70px to the right
    vi.useFakeTimers();
    
    act(() => {
      result.current.handlers.handleTouchEnd();
    });
    
    // Fast-forward timer to allow setTimeout callbacks to execute
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    vi.useRealTimers();
    
    // Verify the right action was called
    expect(mockHandlers.onSwipeRight).toHaveBeenCalled();
    expect(mockHandlers.onSwipeLeft).not.toHaveBeenCalled();
  });

  it('should not trigger actions below threshold', () => {
    const { result } = renderHook(() => 
      useCardSwipe({
        onSwipeLeft: mockHandlers.onSwipeLeft,
        onSwipeRight: mockHandlers.onSwipeRight,
        onShowAnswer: mockHandlers.onShowAnswer,
        isFlipped: true,
        isAnswered: false,
        disableSwipe: false
      })
    );
    
    // Start a swipe
    act(() => {
      result.current.handlers.handleTouchStart(createMockTouchEvent(100, 200));
    });
    
    // Small drag, below threshold
    act(() => {
      result.current.handlers.handleTouchMove(createMockTouchEvent(130, 205));
    });
    
    // End the swipe - this should NOT trigger any swipe action
    act(() => {
      result.current.handlers.handleTouchEnd();
    });
    
    // Verify no actions were called
    expect(mockHandlers.onSwipeRight).not.toHaveBeenCalled();
    expect(mockHandlers.onSwipeLeft).not.toHaveBeenCalled();
  });

  it('should prevent vertical scrolling when swiping horizontally', () => {
    const { result } = renderHook(() => 
      useCardSwipe({
        onSwipeLeft: mockHandlers.onSwipeLeft,
        onSwipeRight: mockHandlers.onSwipeRight,
        onShowAnswer: mockHandlers.onShowAnswer,
        isFlipped: false,
        isAnswered: false,
        disableSwipe: false
      })
    );
    
    const mockStartEvent = createMockTouchEvent(100, 200);
    const mockMoveEvent = createMockTouchEvent(150, 210);
    
    // Start a swipe
    act(() => {
      result.current.handlers.handleTouchStart(mockStartEvent);
    });
    
    // Move horizontally
    act(() => {
      result.current.handlers.handleTouchMove(mockMoveEvent);
    });
    
    // Verify preventDefault was called to prevent scrolling
    expect(mockStartEvent.preventDefault).toHaveBeenCalled();
    expect(mockMoveEvent.preventDefault).toHaveBeenCalled();
  });
});
