import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

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
global.URL = class URL {
  href: string;

  constructor(url: string, base?: string | URL) {
    if (base) {
      this.href = `${base}/${url}`;
    } else {
      this.href = url;
    }
  }
} as any;

// Mock import.meta.url
if (!global.import) {
  Object.defineProperty(global, "import", {
    value: {
      meta: {
        url: "file:///src/",
      },
    },
    configurable: true,
  });
}

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
