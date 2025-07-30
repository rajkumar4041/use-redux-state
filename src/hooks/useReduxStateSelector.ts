import { useSelector } from 'react-redux';
import type { RootState } from '../types';

/**
 * Hook for selecting specific parts of global state
 * @param key - The global state key
 * @param selector - Function to select specific data from the state
 * @returns The selected value
 */
export function useReduxStateSelector<T, R>(key: string, selector: (state: T) => R): R {
  return useSelector((state: RootState) => {
    const globalState = (state as any)[key] as T;
    if (globalState === undefined) {
      throw new Error(`Global state with key "${key}" does not exist.`);
    }
    return selector(globalState);
  });
}

/**
 * This hook is useful for accessing a specific value from the global state without needing to provide a selector function.
 * Hook for selecting a specific global state value
 *
 * @param key - The global state key
 * @template T - The type of the global state value
 *
 * @returns The value of the global state
 */
export const useReduxStateValue = <T>(key: string): T => {
  return useSelector((state: RootState) => (state as any)[key] as T);
};

/**
 * Hook for selecting multiple global states at once
 * @param keys - Array of global state keys
 * @returns Object with selected states
 */
export function useMultipleGlobalStates<T extends Record<string, any>>(keys: (keyof T)[]): T {
  return useSelector((state: RootState) => {
    const result = {} as T;
    keys.forEach((key) => {
      result[key] = (state as any)[key as string];
    });
    return result;
  });
}
