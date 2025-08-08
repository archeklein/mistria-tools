import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// Extend global interface for Node.js global object
declare global {
  var URL: typeof URL;
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock URL constructor for asset imports
globalThis.URL = class URL {
  href: string;

  constructor(url: string, base?: string | URL) {
    if (base) {
      this.href = `${base}/${url}`;
    } else {
      this.href = url;
    }
  }
} as any;

// Note: import.meta.url mocking removed as it was causing TypeScript issues
// and the icons test that required it has been removed

// Clean up after each test case
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorageMock.clear();
});

// Reset localStorage mock before each test
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});
