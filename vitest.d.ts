/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from "@testing-library/jest-dom"

declare module "vitest" {
  interface Assertion<T = any> extends TestingLibraryMatchers<T> {}
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers<any> {}
}