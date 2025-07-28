import {
  useReduxStateExisting,
  useReduxStateReturn,
  useReduxStateWithInitial,
} from './reduxStateImpl';

/**
 * @description declaration for useReduxState hook
 *
 * Custom hook for accessing or creating global state
 * @param key - Unique identifier for the global state
 * @param initialValue - Initial value for the state (optional)
 * @returns [value, setValue, { update, reset }]
 */
export function useReduxState<T>(key: string, initialValue: T): useReduxStateReturn<T>;

/**
 * @description declaration for useReduxState hook
 * Custom hook for accessing existing global state without initial value
 *
 * @see useReduxStateExisting
 *
 * @param key
 * @returns [value, setValue, { update, reset }]
 */
export function useReduxState<T>(key: string): useReduxStateReturn<T>;

/**
 * Implementation of useReduxState hook
 *
 * @param key
 * @param initialValue
 * @returns
 */
export function useReduxState<T>(key: string, initialValue?: T): useReduxStateReturn<T> {
  if (initialValue === undefined) {
    return useReduxStateExisting<T>(key);
  }
  return useReduxStateWithInitial<T>(key, initialValue);
}
