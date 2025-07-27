import React from 'react';
import { Provider } from 'react-redux';
import { getStore } from './store';

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

export function GlobalStateProvider({ children }: GlobalStateProviderProps) {
  const store = getStore();

  return <Provider store={store}>{children}</Provider>;
}
