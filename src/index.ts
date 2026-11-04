/** Main exports */
export { useReduxState } from './hooks/useReduxState';
export {
  useReduxStateSelector,
  useMultipleGlobalStates,
  useReduxStateValue,
  useReduxStateSetValue,
  useReduxStateReset,
} from './hooks/useReduxStateSelector';
export { GlobalReduxProvider } from './provider';

export type { RootState } from './types';

/** Shallow equality helper for object/array selectors */
export { shallow } from './shallow';

/** Typed store factory */
export { createStore } from './createStore';
export type { Store, StoreSetValue, StoreUpdate } from './createStore';

/** advance imports */
export {
  getStore,
  createSliceForKey,
  getSliceForKey,
  getRegisteredKeys,
  clearSlices,
} from './store';

/** Default export */
export { GlobalReduxProvider as default } from './provider';
