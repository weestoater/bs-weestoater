import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

// Extend vitest's expect with @testing-library/jest-dom matchers
interface CustomMatchers<R = unknown>
  extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}

declare module "vitest" {
  interface Assertion extends CustomMatchers {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

afterEach(() => {
  cleanup();
});
