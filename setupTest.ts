import "@testing-library/jest-dom";
import { expect, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import { create } from "@remix-run/router";

declare global {
  namespace Vi {
    interface Assertion extends TestingLibraryMatchers<any, void> {}
    interface AsymmetricMatchersContaining
      extends TestingLibraryMatchers<any, void> {}
  }
}

afterEach(() => {
  cleanup();
});
