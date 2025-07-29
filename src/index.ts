/** Main exports */
export { useReduxState } from './hooks/useReduxState';
export { useReduxStateSelector, useMultipleGlobalStates } from './hooks/useReduxStateSelector';
export { GlobalStateProvider } from './provider';

export type { RootState } from './types';

export {} from './store';

export { GlobalStateProvider as default } from './provider';
