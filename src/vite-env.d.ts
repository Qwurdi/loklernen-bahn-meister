
/// <reference types="vite/client" />
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
  }
}
