import {
  combineReducers,
  configureStore,
  createSlice,
  PayloadAction,
  Slice,
} from '@reduxjs/toolkit';

/* Global store instance
   @singleton-pattern
 */
let store: ReturnType<typeof createStore> | null = null;

/**
 * Dynamic reducers object
 * This will hold the reducers that can be added dynamically.
 * It starts empty and can be populated as needed.
 */
let dynamicReducers: Record<string, any> = {};

// Registry to track created slices
const sliceRegistry = new Map<string, Slice>();

// Create the store with dynamic slice injection
const createStore = () => {
  return configureStore({
    /**
     *  Combine all dynamic reducers with any initial reducers
     *  This allows for dynamic addition of reducers at runtime.
     */
    reducer: combineReducers(dynamicReducers),
    /**
     * Middleware configuration
     * @param getDefaultMiddleware - The default middleware provided by Redux Toolkit
     * @returns The customized middleware
     */
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        /** This option is used to ignore certain actions from being checked for serializability.*/
        serializableCheck: {
          /** avoid warning for non serialize data */
          ignoredActions: ['persist/PERSIST'],
        },
      }),
  });
};

/**
 * Get or create store instance
 * @returns The singleton store instance
 */
export const getStore = () => {
  if (!store) store = createStore();

  return store;
};

/**
 * @description Creates a Redux slice for a given key with initial value.
 *
 * @param key - Unique identifier for the slice
 * @param initialValue - Initial value for the slice
 * @returns The created slice
 */
export const createSliceForKey = <T>(key: string, initialValue: T): Slice<T> => {
  /**
   * check if the slice already exists in the registry
   * If it does, return the existing slice.
   * to prevent duplicate slices creation (ensure each key has only one slice)
   */
  if (sliceRegistry.has(key)) return sliceRegistry.get(key)! as Slice<T>;

  const slice = createSlice({
    name: key,
    initialState: initialValue,
    reducers: {
      setValue: (_state, action: PayloadAction<T>) => {
        return action.payload;
      },
      updateValue: (state, action: PayloadAction<Partial<T>>) => {
        if (typeof state === 'object' && state !== null) {
          return { ...state, ...action.payload };
        }
        return action.payload as T;
      },
      reset: () => initialValue,
    },
  });

  // Register the slice
  sliceRegistry.set(key, slice);

  /**
   * This adds the slice's reducer to the dynamicReducers object.
   * This allows the reducer to be combined with others in the store.
   */
  dynamicReducers[key] = slice.reducer;

  /**
   * If the store already exists, replace its reducer with the new one.
   * This is necessary to ensure that the new slice is included in the store's reducer.
   */
  if (store) {
    const newRootReducer = combineReducers(dynamicReducers);
    store.replaceReducer(newRootReducer);
  }

  return slice;
};

/** * Get a slice for a given key
 * @param key - The unique identifier for the slice
 */
export const getSliceForKey = <T>(key: string): Slice<T> | null => {
  return sliceRegistry.get(key) as Slice<T> | null;
};

/**
 * Get all registered keys
 * @returns An array of keys for all registered slices
 */
export const getRegisteredKeys = (): string[] => {
  return Array.from(sliceRegistry.keys());
};

/** clear all slices to check slices registry and clean up */
export const clearSlices = () => {
  sliceRegistry.clear();
  dynamicReducers = {};
  store = null;
};
