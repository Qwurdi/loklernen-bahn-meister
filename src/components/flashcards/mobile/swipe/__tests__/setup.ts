
import { vi } from 'vitest';

// Mock navigator.vibrate for tests
Object.defineProperty(navigator, 'vibrate', {
  value: vi.fn().mockImplementation(() => true),
  writable: true
});
