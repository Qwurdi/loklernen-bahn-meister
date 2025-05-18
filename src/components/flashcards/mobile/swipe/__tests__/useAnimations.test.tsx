
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useAnimations } from '../useAnimations';

describe('useAnimations Hook', () => {
  let mockCardRef: { current: Partial<HTMLDivElement> | null };
  
  beforeEach(() => {
    // Reset the mock ref before each test
    mockCardRef = {
      current: {
        style: {} as CSSStyleDeclaration
      }
    };
    
    // Set the style properties we'll be testing
    if (mockCardRef.current && mockCardRef.current.style) {
      mockCardRef.current.style.transition = '';
      mockCardRef.current.style.transform = '';
      mockCardRef.current.style.backgroundColor = '';
      mockCardRef.current.style.opacity = '';
    }
    
    // Mock setTimeout
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not modify styles if cardRef.current is null', () => {
    mockCardRef.current = null;
    const { resetCardPosition, animateSwipe } = useAnimations(mockCardRef as any);
    
    // These should run without errors
    resetCardPosition();
    animateSwipe('right');
    
    // No assertions needed, we're just making sure it doesn't error
  });

  it('should reset card position with proper animation', () => {
    const { resetCardPosition } = useAnimations(mockCardRef as any);
    
    resetCardPosition();
    
    expect(mockCardRef.current!.style.transition).toBe('transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)');
    expect(mockCardRef.current!.style.transform).toBe('translateX(0) rotate(0deg)');
    
    // Fast-forward timer to check if background color gets reset
    vi.advanceTimersByTime(300);
    expect(mockCardRef.current!.style.backgroundColor).toBe('');
  });

  it('should animate swipe right correctly', () => {
    const { animateSwipe } = useAnimations(mockCardRef as any);
    
    animateSwipe('right');
    
    expect(mockCardRef.current!.style.transition).toBe('transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out');
    expect(mockCardRef.current!.style.transform).toContain('translateX(150%)');
    expect(mockCardRef.current!.style.transform).toContain('rotate(15deg)');
    expect(mockCardRef.current!.style.opacity).toBe('0.8');
  });

  it('should animate swipe left correctly', () => {
    const { animateSwipe } = useAnimations(mockCardRef as any);
    
    animateSwipe('left');
    
    expect(mockCardRef.current!.style.transition).toBe('transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out');
    expect(mockCardRef.current!.style.transform).toContain('translateX(-150%)');
    expect(mockCardRef.current!.style.transform).toContain('rotate(-15deg)');
    expect(mockCardRef.current!.style.opacity).toBe('0.8');
  });
});
