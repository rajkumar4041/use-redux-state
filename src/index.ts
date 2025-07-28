/** Main exports */
export { useGlobalState } from './hooks/useGlobalState';
export { useGlobalStateSelector, useMultipleGlobalStates } from './hooks/useGlobalStateSelector';
export { GlobalStateProvider } from './provider';

export type { RootState } from './types';

export {} from './store';

export { GlobalStateProvider as default } from './provider';
