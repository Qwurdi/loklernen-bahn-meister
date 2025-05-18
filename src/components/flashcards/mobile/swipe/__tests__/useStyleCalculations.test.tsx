
import { describe, it, expect } from 'vitest';
import { useStyleCalculations } from '../useStyleCalculations';
import { SwipeState } from '../types';

describe('useStyleCalculations Hook', () => {
  const mockDefaultSwipeState: SwipeState = {
    dragStartX: null,
    dragStartY: null,
    dragDelta: 0,
    isDragging: false,
    swipeDirection: null
  };

  it('should return default card style when drag delta is 0', () => {
    const { getCardStyle } = useStyleCalculations(false, false);
    
    const style = getCardStyle(mockDefaultSwipeState);
    
    expect(style).toEqual({
      transform: 'none',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease'
    });
  });

  it('should disable dragging when card is flipped and swipe is disabled', () => {
    const { getCardStyle } = useStyleCalculations(true, true);
    
    const style = getCardStyle({
      ...mockDefaultSwipeState,
      dragDelta: 50
    });
    
    expect(style).toEqual({
      transform: 'none',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.2s ease'
    });
  });

  it('should calculate correct transform and background for right swipe', () => {
    const { getCardStyle } = useStyleCalculations(false, false);
    
    const style = getCardStyle({
      ...mockDefaultSwipeState,
      dragDelta: 50,
      isDragging: true
    });
    
    expect(style).toHaveProperty('transform');
    expect(style.transform).toContain('translateX(55px)');
    expect(style.transform).toContain('rotate(');
    expect(style).toHaveProperty('backgroundColor');
    expect(style.backgroundColor).toContain('rgba(209, 250, 229,');
    expect(style.transition).toBe('none');
  });

  it('should calculate correct transform and background for left swipe', () => {
    const { getCardStyle } = useStyleCalculations(false, false);
    
    const style = getCardStyle({
      ...mockDefaultSwipeState,
      dragDelta: -50,
      isDragging: true
    });
    
    expect(style).toHaveProperty('transform');
    expect(style.transform).toContain('translateX(-55px)');
    expect(style.transform).toContain('rotate(');
    expect(style).toHaveProperty('backgroundColor');
    expect(style.backgroundColor).toContain('rgba(254, 226, 226,');
  });

  it('should add appropriate classes based on swipe direction', () => {
    const { getCardClasses } = useStyleCalculations(false, false);
    
    const rightClasses = getCardClasses('right');
    const leftClasses = getCardClasses('left');
    const noSwipeClasses = getCardClasses(null);
    
    expect(rightClasses).toContain('animate-swipe-right');
    expect(leftClasses).toContain('animate-swipe-left');
    expect(noSwipeClasses).not.toContain('animate-swipe-right');
    expect(noSwipeClasses).not.toContain('animate-swipe-left');
  });
});
