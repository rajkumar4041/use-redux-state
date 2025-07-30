/** Main exports */
export { useReduxState } from './hooks/useReduxState';
export {
  useReduxStateSelector,
  useMultipleGlobalStates,
  useReduxStateValue,
} from './hooks/useReduxStateSelector';
export { GlobalReduxProvider } from './provider';

export type { RootState } from './types';

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
