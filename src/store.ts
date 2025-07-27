import { combineReducers, configureStore, Slice } from '@reduxjs/toolkit';

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

// todo: Registry to track created slices
// const sliceRegistry = new Map<string, Slice>();

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
