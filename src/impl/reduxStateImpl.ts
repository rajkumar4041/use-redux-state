import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSliceForKey, getSliceForKey } from '../store';
import type { RootState } from '../types';

// Type for the setter function
type SetValueFunction<T> = (value: T | ((prevValue: T) => T)) => void;

// Type for the update function (for partial updates)
type UpdateValueFunction<T> = (updates: Partial<T>) => void;

// Type for the reset function
type ResetFunction = () => void;

// Type for the return action object
type ReturnAction<T> = {
  update: UpdateValueFunction<T>;
  reset: ResetFunction;
};

// Return type for the hook
export type useReduxStateReturn<T> = [T, SetValueFunction<T>, ReturnAction<T>];

/**
 * Custom hook for global state management
 * @param key - Unique identifier for the global state
 * @param initialValue - Initial value for the state
 * @returns [value, setValue, { update, reset }]
 */
export const useReduxStateWithInitial = <T>(
  key: string,
  initialValue: T
): useReduxStateReturn<T> => {
  const dispatch = useDispatch();

  // Create or get the slice for this key
  const slice = useMemo(() => {
    const existingSlice = getSliceForKey<T>(key);
    if (existingSlice) return existingSlice;

    return createSliceForKey<T>(key, initialValue);
  }, [key, initialValue]);

  /**  (getter Function)
   * This uses the useSelector hook to access the Redux store and retrieve the value associated with the given key.
   *
   * @param state - The Redux state
   * @returns The value associated with the key
   */
  const value = useSelector((state: RootState) => (state as any)[key] as T);

  // Setter function (similar to useState)
  const setValue = useCallback<SetValueFunction<T>>(
    (newValue) => {
      if (typeof newValue === 'function') {
        const updater = newValue as (prevValue: T) => T;
        dispatch(slice.actions.setValue(updater(value)));
      } else {
        dispatch(slice.actions.setValue(newValue));
      }
    },
    [dispatch, slice.actions, value]
  );

  // Update function for partial updates (useful for objects)
  const update = useCallback<UpdateValueFunction<T>>(
    (updates) => {
      dispatch(slice.actions.updateValue(updates));
    },
    [dispatch, slice.actions]
  );

  // Reset function to restore initial value
  const reset = useCallback<ResetFunction>(() => {
    dispatch(slice.actions.reset(undefined));
  }, [dispatch, slice.actions]);

  // Initialize the state if it doesn't exist
  useEffect(() => {
    if (value === undefined) {
      setValue(initialValue);
    }
  }, [value, initialValue, setValue]);

  // Return the value or initial value if undefined
  const currentValue = value !== undefined ? value : initialValue;

  return [currentValue, setValue, { update, reset }];
};

/**
 * Custom hook for accessing existing global state
 * @param key - Unique identifier for the global state
 * @returns [value, setValue, { update, reset }]
 */
export const useReduxStateExisting = <T>(key: string): useReduxStateReturn<T> => {
  const dispatch = useDispatch();

  // Try to get existing slice
  const existingSlice = getSliceForKey<T>(key);
  if (!existingSlice) {
    throw new Error(
      `Global state with key "${key}" does not exist. Please provide an initial value.`
    );
  }

  const value = useSelector((state: RootState) => {
    return (state as any)[key] as T;
  });

  const setValue = useCallback<SetValueFunction<T>>(
    (newValue) => {
      if (typeof newValue === 'function') {
        const updater = newValue as (prevValue: T) => T;
        dispatch(existingSlice.actions.setValue(updater(value)));
      } else {
        dispatch(existingSlice.actions.setValue(newValue));
      }
    },
    [dispatch, existingSlice.actions, value]
  );

  const update = useCallback<UpdateValueFunction<T>>(
    (updates) => {
      dispatch(existingSlice.actions.updateValue(updates));
    },
    [dispatch, existingSlice.actions]
  );

  const reset = useCallback<ResetFunction>(() => {
    dispatch(existingSlice.actions.reset(undefined));
  }, [dispatch, existingSlice.actions]);

  return [value, setValue, { update, reset }];
};
