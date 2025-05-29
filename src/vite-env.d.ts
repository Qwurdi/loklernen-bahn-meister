
/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

// Extend Vitest's expect with Jest DOM matchers
declare module 'vitest' {
  interface Assertion<T = any> {
    toBeInTheDocument(): T
    toHaveTextContent(text: string | RegExp): T
    toHaveClass(className: string): T
    toBeVisible(): T
    toBeDisabled(): T
    toBeEnabled(): T
    toHaveValue(value: string | number): T
    toBeChecked(): T
    toHaveFocus(): T
    toHaveAttribute(attr: string, value?: string): T
    toHaveStyle(style: string | object): T
    toBeEmptyDOMElement(): T
    toBeInvalid(): T
    toBeValid(): T
    toBeRequired(): T
    toBePartiallyChecked(): T
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): T
    toHaveErrorMessage(text: string | RegExp): T
  }
  
  interface AsymmetricMatchersContaining {
    toBeInTheDocument(): any
    toHaveTextContent(text: string | RegExp): any
    toHaveClass(className: string): any
    toBeVisible(): any
    toBeDisabled(): any
    toBeEnabled(): any
    toHaveValue(value: string | number): any
    toBeChecked(): any
    toHaveFocus(): any
    toHaveAttribute(attr: string, value?: string): any
    toHaveStyle(style: string | object): any
    toBeEmptyDOMElement(): any
    toBeInvalid(): any
    toBeValid(): any
    toBeRequired(): any
    toBePartiallyChecked(): any
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): any
    toHaveErrorMessage(text: string | RegExp): any
  }
}

// Make vitest globals available
declare global {
  const describe: typeof import('vitest').describe;
  const it: typeof import('vitest').it;
  const expect: typeof import('vitest').expect;
  const test: typeof import('vitest').test;
  const vi: typeof import('vitest').vi;
  const beforeEach: typeof import('vitest').beforeEach;
  const afterEach: typeof import('vitest').afterEach;
  const beforeAll: typeof import('vitest').beforeAll;
  const afterAll: typeof import('vitest').afterAll;
}
