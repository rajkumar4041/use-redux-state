import { useSelector } from 'react-redux';
import { ReturnAction, SetValueFunction } from '../impl/reduxStateImpl';
import type { RootState } from '../types';
import { useReduxState } from './useReduxState';

/**
 * Hook for selecting specific parts of global state
 * @param key - The global state key
 * @param selector - Function to select specific data from the state
 * @returns The selected value
 */
export function useReduxStateSelector<T, R>(
  key: string,
  selector: (state: T) => R
): R {
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
export const useMultipleGlobalStates = <T extends Record<string, any>>(
  keys: (keyof T)[]
): T => {
  return useSelector((state: RootState) => {
    const result = {} as T;
    keys.forEach((key) => {
      result[key] = (state as any)[key as string];
    });
    return result;
  });
};

export type ReduxStateSetValueReturnType<T> = [
  SetValueFunction<T>,
  ReturnAction<T>['update'],
];

/**
 * Hook for setting a value in the Redux-state
 * @param key - The unique identifier for the Redux-state
 * @param initialValue {T} - Initial value for the state (optional)
 *
 * @return {SetValueFunction<T>} setValue - Function to set the value
 * @return {ReturnAction<T>["update"]} update - Function to update ``partial Data``
 *
 * @returns {[SetValueFunction, ReturnAction<T>["update"]]} [setValue,update]
 */
export const useReduxStateSetValue = <T>(
  key: string,
  initialValue?: T
): ReduxStateSetValueReturnType<T> => {
  const [_, setValue, { update }] = useReduxState<T>(key, initialValue as T);

  return [setValue, update];
};

/**
 * Hook for resetting a Redux-state value
 * This hook provides a function to reset the value of a specific Redux-state slice to its initial state.
 *
 * @param key - The unique identifier for the Redux-state
 * @see key use existing for reset existing state
 *
 * @returns {() => void} reset - Function to reset the value to its initial state
 */
export const useResetReduxState = <T>(key: string): (() => void) => {
  const [_getter, _setter, { reset }] = useReduxState<T>(key);

  return reset;
};
