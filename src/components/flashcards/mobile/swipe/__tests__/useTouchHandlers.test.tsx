
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTouchHandlers } from '../useTouchHandlers';
import { SwipeState } from '../types';

describe('useTouchHandlers Hook', () => {
  const mockSwipeState: SwipeState = {
    dragStartX: null,
    dragStartY: null,
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  };
  
  const createMockDeps = () => ({
    swipeState: { ...mockSwipeState },
    updateSwipeState: vi.fn(),
    resetSwipeState: vi.fn(),
    animateSwipe: vi.fn(),
    resetCardPosition: vi.fn(),
    onSwipeLeft: vi.fn(),
    onSwipeRight: vi.fn(),
    onShowAnswer: vi.fn(),
    isFlipped: false,
    isAnswered: false,
    disableSwipe: false
  });

  it('should not handle touch events when swipe is disabled and card is flipped', () => {
    const deps = createMockDeps();
    deps.disableSwipe = true;
    deps.isFlipped = true;
    
    const { result } = renderHook(() => useTouchHandlers(deps));
    
    // Create mock event
    const mockEvent = {
      preventDefault: vi.fn(),
      touches: [{ clientX: 100, clientY: 100 }]
    } as unknown as React.TouchEvent;
    
    // Call all handlers
    result.current.handleTouchStart(mockEvent);
    result.current.handleTouchMove(mockEvent);
    result.current.handleTouchEnd();
    
    // Verify no state updates or animations were called
    expect(deps.updateSwipeState).not.toHaveBeenCalled();
    expect(deps.animateSwipe).not.toHaveBeenCalled();
    expect(deps.resetCardPosition).not.toHaveBeenCalled();
  });

  it('should handle touch start correctly', () => {
    const deps = createMockDeps();
    
    const { result } = renderHook(() => useTouchHandlers(deps));
    
    const mockEvent = {
      preventDefault: vi.fn(),
      touches: [{ clientX: 100, clientY: 150 }]
    } as unknown as React.TouchEvent;
    
    result.current.handleTouchStart(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(deps.updateSwipeState).toHaveBeenCalledWith({
      dragStartX: 100,
      dragStartY: 150,
      isDragging: true,
      swipeDirection: null
    });
  });

  it('should handle touch move correctly with horizontal movement', () => {
    const deps = createMockDeps();
    deps.swipeState = {
      ...mockSwipeState,
      dragStartX: 100,
      dragStartY: 100
    };
    
    const { result } = renderHook(() => useTouchHandlers(deps));
    
    const mockEvent = {
      preventDefault: vi.fn(),
      touches: [{ clientX: 150, clientY: 110 }] // 50px right, 10px down (within deadzone)
    } as unknown as React.TouchEvent;
    
    result.current.handleTouchMove(mockEvent);
    
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(deps.updateSwipeState).toHaveBeenCalledWith({
      dragDelta: 50,
      swipeDirection: "right"
    });
  });

  it('should trigger swipe left action when threshold exceeded', () => {
    const deps = createMockDeps();
    deps.isFlipped = true;
    deps.swipeState = {
      ...mockSwipeState,
      dragStartX: 100,
      dragDelta: -70 // Beyond threshold
    };
    
    const { result } = renderHook(() => useTouchHandlers(deps));
    
    // Mock setTimeout
    vi.useFakeTimers();
    
    result.current.handleTouchEnd();
    
    expect(deps.updateSwipeState).toHaveBeenCalledWith({ swipeDirection: "left" });
    expect(deps.animateSwipe).toHaveBeenCalledWith("left");
    
    vi.advanceTimersByTime(300);
    expect(deps.onSwipeLeft).toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('should trigger swipe right action when threshold exceeded', () => {
    const deps = createMockDeps();
    deps.isFlipped = true;
    deps.swipeState = {
      ...mockSwipeState,
      dragStartX: 100,
      dragDelta: 70 // Beyond threshold
    };
    
    const { result } = renderHook(() => useTouchHandlers(deps));
    
    // Mock setTimeout
    vi.useFakeTimers();
    
    result.current.handleTouchEnd();
    
    expect(deps.updateSwipeState).toHaveBeenCalledWith({ swipeDirection: "right" });
    expect(deps.animateSwipe).toHaveBeenCalledWith("right");
    
    vi.advanceTimersByTime(300);
    expect(deps.onSwipeRight).toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('should show answer when swiping on question side', () => {
    const deps = createMockDeps();
    deps.isFlipped = false; // Question side
    deps.swipeState = {
      ...mockSwipeState,
      dragStartX: 100,
      dragDelta: 70 // Beyond threshold
    };
    
    const { result } = renderHook(() => useTouchHandlers(deps));
    
    result.current.handleTouchEnd();
    
    expect(deps.onShowAnswer).toHaveBeenCalled();
  });

  it('should reset position when movement is below threshold', () => {
    const deps = createMockDeps();
    deps.isFlipped = true;
    deps.swipeState = {
      ...mockSwipeState,
      dragStartX: 100,
      dragDelta: 30 // Below threshold
    };
    
    const { result } = renderHook(() => useTouchHandlers(deps));
    
    result.current.handleTouchEnd();
    
    expect(deps.resetCardPosition).toHaveBeenCalled();
    expect(deps.resetSwipeState).toHaveBeenCalled();
    expect(deps.onSwipeRight).not.toHaveBeenCalled();
    expect(deps.onSwipeLeft).not.toHaveBeenCalled();
  });
});
