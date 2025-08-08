import { beforeEach, vi } from "vitest";
import { type StateCreator } from "zustand";

// Mock zustand's create function
const actualCreate = vi.fn();
const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: StateCreator<T>): T => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();

  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

// Mock the create function
export const create = (<T>(stateCreator: StateCreator<T>) => {
  // Handle curried version (with middleware)
  if (typeof stateCreator === "function") {
    return createUncurried(stateCreator);
  }

  // Return a function that accepts the actual state creator
  return (actualStateCreator: StateCreator<T>) =>
    createUncurried(actualStateCreator);
}) as typeof import("zustand").create;

// Reset all stores function for tests
export const resetAllStores = () => {
  storeResetFns.forEach((resetFn) => resetFn());
};

// Mock persist middleware
export const persist = vi.fn((config: any, _: any) => config);

// Mock createJSONStorage
export const createJSONStorage = vi.fn(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}));

// Set up the actual create implementation
beforeEach(() => {
  actualCreate.mockImplementation((stateCreator) => {
    let state: any;
    const listeners = new Set<(state: any, prevState: any) => void>();

    const setState = (partial: any, replace = false) => {
      const prevState = state;
      state = replace ? partial : { ...state, ...partial };
      listeners.forEach((listener) => listener(state, prevState));
    };

    const getState = () => state;

    const subscribe = (listener: (state: any, prevState: any) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };

    const api = { setState, getState, subscribe };
    state = stateCreator(setState, getState, api);

    return api;
  });
});
