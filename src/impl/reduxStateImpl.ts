/**
 * useReduxState hook implementation (vanilla store, no Redux).
 *
 * @author Rajkumar Rathod
 */
import { useCallback, useEffect, useRef } from 'react';
import { useStoreSelector } from '../react';
import {
  ensureKey,
  getState,
  isKeyRegistered,
  notify,
  resetKey,
  setKeyValue,
  updateKeyValue,
} from '../store';

// Type for the setter function
export type SetValueFunction<T> = (value: T | ((prevValue: T) => T)) => void;

// Type for the update function (for partial updates)
type UpdateValueFunction<T> = (updates: Partial<T>) => void;

// Type for the reset function
type ResetFunction = () => void;

// Type for the return action object
export type ReturnAction<T> = {
  update: UpdateValueFunction<T>;
  reset: ResetFunction;
};

// Return type for the hook
export type useReduxStateReturn<T> = [T, SetValueFunction<T>, ReturnAction<T>];

const readValue = <T>(key: string, fallback: T): T => {
  const s = getState();
  return key in s ? (s[key] as T) : fallback;
};

/**
 * Custom hook for global state management (useState-like API).
 * @param key - Unique identifier for the state slice
 * @param initialValue - Initial value for the state
 * @returns [value, setValue, { update, reset }]
 */
export const useReduxStateWithInitial = <T>(
  key: string,
  initialValue: T
): useReduxStateReturn<T> => {
  // Register the key synchronously during render so sibling consumers
  // (selector hooks) in the same render pass can read it. ensureKey does not
  // notify, so it is render-safe; we notify any pre-existing subscribers from
  // an effect after commit if this call created the key.
  const initKeyRef = useRef<string | null>(null);
  const createdRef = useRef(false);
  if (initKeyRef.current !== key) {
    createdRef.current = ensureKey(key, initialValue);
    initKeyRef.current = key;
  }
  useEffect(() => {
    if (createdRef.current) {
      createdRef.current = false;
      notify();
    }
  }, [key]);

  const value = useStoreSelector<T>((s) =>
    key in s ? (s[key] as T) : initialValue
  );

  const setValue = useCallback<SetValueFunction<T>>(
    (newValue) => {
      if (typeof newValue === 'function') {
        const updater = newValue as (prevValue: T) => T;
        setKeyValue(key, updater(readValue(key, initialValue)));
      } else {
        setKeyValue(key, newValue);
      }
    },
    [key, initialValue]
  );

  const update = useCallback<UpdateValueFunction<T>>(
    (updates) => updateKeyValue(key, updates),
    [key]
  );

  const reset = useCallback<ResetFunction>(() => resetKey(key), [key]);

  return [value, setValue, { update, reset }];
};

/**
 * Custom hook for accessing existing global state (no initial value).
 * @param key - Unique identifier for the state slice
 * @returns [value, setValue, { update, reset }]
 */
export const useReduxStateExisting = <T>(
  key: string
): useReduxStateReturn<T> => {
  if (!isKeyRegistered(key)) {
    throw new Error(
      `redux State with key "${key}" does not exist. Please provide an initial value.`
    );
  }

  const value = useStoreSelector<T>((s) => s[key] as T);

  const setValue = useCallback<SetValueFunction<T>>(
    (newValue) => {
      if (typeof newValue === 'function') {
        const updater = newValue as (prevValue: T) => T;
        setKeyValue(key, updater(getState()[key] as T));
      } else {
        setKeyValue(key, newValue);
      }
    },
    [key]
  );

  const update = useCallback<UpdateValueFunction<T>>(
    (updates) => updateKeyValue(key, updates),
    [key]
  );

  const reset = useCallback<ResetFunction>(() => resetKey(key), [key]);

  return [value, setValue, { update, reset }];
};
