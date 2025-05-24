
import { renderHook, act } from '@testing-library/react';
import { useSwipeState } from '../useSwipeState';
import { describe, it, expect } from 'vitest';

describe('useSwipeState Hook', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSwipeState());
    
    expect(result.current.swipeState).toEqual({
      dragStartX: null,
      dragStartY: null,
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    });
  });

  it('should update state correctly', () => {
    const { result } = renderHook(() => useSwipeState());
    
    act(() => {
      result.current.updateSwipeState({
        dragStartX: 100,
        isDragging: true
      });
    });
    
    expect(result.current.swipeState).toEqual({
      dragStartX: 100,
      dragStartY: null,
      dragDelta: 0,
      isDragging: true,
      swipeDirection: null
    });
  });

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useSwipeState());
    
    // First update the state
    act(() => {
      result.current.updateSwipeState({
        dragStartX: 100,
        dragStartY: 200,
        dragDelta: 50,
        isDragging: true,
        swipeDirection: 'right'
      });
    });
    
    // Then reset it
    act(() => {
      result.current.resetSwipeState();
    });
    
    // Check if it's back to initial state
    expect(result.current.swipeState).toEqual({
      dragStartX: null,
      dragStartY: null,
      dragDelta: 0,
      isDragging: false,
      swipeDirection: null
    });
  });
});
