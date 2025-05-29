
# Testing Guidelines for LokLernen

## Overview

This project uses Vitest as the testing framework with a standardized approach to ensure consistency and reliability across all tests.

## Core Principles

### 1. Use Vitest Globals Only
- **Always** use Vitest globals (`describe`, `it`, `expect`, `vi`, etc.)
- **Never** import these functions directly from 'vitest'
- The globals are configured in `vitest.config.ts` and declared in `src/vite-env.d.ts`

### 2. Consistent File Naming
- Test files: `*.test.tsx` or `*.test.ts`
- Test utilities: `*.test-utils.ts`
- Mock files: `*.mock.ts`
- Setup files: `setup.ts`

### 3. Standard Test Structure
```typescript
// ✅ CORRECT - No imports of vitest globals
import { render } from '@testing-library/react';
import { ComponentToTest } from '../ComponentToTest';

describe('ComponentToTest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText } = render(<ComponentToTest />);
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
```

```typescript
// ❌ WRONG - Don't import vitest globals
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
```

## Testing Categories

### Component Tests
- Location: `src/components/**/__tests__/`
- Focus: UI rendering, user interactions, prop handling
- Use `@testing-library/react` for rendering and queries

### Hook Tests
- Location: `src/hooks/**/__tests__/`
- Focus: Hook behavior, state changes, side effects
- Use `@testing-library/react` `renderHook` utility

### Utility Tests
- Location: `src/utils/**/__tests__/` or alongside utility files
- Focus: Pure function behavior, edge cases
- Direct function testing without React dependencies

### Integration Tests
- Location: `src/__tests__/` or component-specific directories
- Focus: Component interaction, data flow, user workflows

## Mock Patterns

### 1. Module Mocking
```typescript
// Mock external dependencies
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    isAuthenticated: true
  })
}));
```

### 2. Function Mocking
```typescript
// Mock specific functions
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});
```

### 3. Component Mocking
```typescript
// Mock complex components
vi.mock('../ComplexComponent', () => ({
  ComplexComponent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-complex-component">{children}</div>
  )
}));
```

## Common Test Utilities

### Wrapper Creation
```typescript
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
```

### Event Simulation
```typescript
// Touch events for swipe testing
const createMockTouchEvent = (x: number, y: number) => ({
  preventDefault: vi.fn(),
  touches: [{ clientX: x, clientY: y }]
} as unknown as React.TouchEvent);
```

## Timer Management

```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// In tests
act(() => {
  vi.advanceTimersByTime(300);
});
```

## Best Practices

### 1. Test Organization
- Group related tests with `describe` blocks
- Use descriptive test names that explain the expected behavior
- Keep tests focused on a single concern

### 2. Setup and Cleanup
- Use `beforeEach`/`afterEach` for common setup
- Clear mocks between tests: `vi.clearAllMocks()`
- Reset timers and other global state

### 3. Assertions
- Use specific Jest-DOM matchers when possible
- Test behavior, not implementation details
- Verify both positive and negative cases

### 4. Async Testing
```typescript
it('should handle async operations', async () => {
  const { result } = renderHook(() => useAsyncHook());
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

## Coverage Guidelines

- Aim for >80% code coverage
- Focus on critical business logic
- Don't test trivial getters/setters
- Prioritize integration over unit test coverage

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test ComponentName.test.tsx
```

## Debugging Tests

### Console Output
```typescript
// Use screen.debug() to see current DOM
import { screen } from '@testing-library/react';

it('should render component', () => {
  render(<Component />);
  screen.debug(); // Prints current DOM to console
});
```

### Query Debugging
```typescript
// Use getBy* for elements that should exist
// Use queryBy* for elements that might not exist
// Use findBy* for async elements

const button = screen.getByRole('button', { name: /submit/i });
const optionalElement = screen.queryByText('Optional Text');
const asyncElement = await screen.findByText('Loaded Content');
```

## Common Issues and Solutions

### 1. Mock Not Working
- Ensure mocks are declared before imports
- Use `vi.hoisted()` for hoisted mocks if needed
- Check mock paths are correct

### 2. Async Test Failures
- Use `waitFor` for async state changes
- Ensure proper cleanup with `act()`
- Check for race conditions

### 3. Component Not Rendering
- Verify all required props are provided
- Check for missing context providers
- Ensure imports are correct

## File Structure Example

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── __tests__/
│           ├── Button.test.tsx
│           └── Button.integration.test.tsx
├── hooks/
│   └── useAuth/
│       ├── useAuth.ts
│       └── __tests__/
│           └── useAuth.test.ts
└── test/
    ├── setup.ts
    ├── test-utils.tsx
    └── README.md (this file)
```

Remember: Consistency is key. Follow these guidelines to ensure all tests work reliably and maintainability is preserved.
