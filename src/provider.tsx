import React, { useEffect } from 'react';
import { initPersistence } from './persist';

interface GlobalStateProviderProps {
  children: React.ReactNode;
}

/**
 * Optional provider. The store itself is global and needs no Context, so this
 * only initialises the ephemeral IndexedDB persistence (survive-refresh) once.
 * Wrapping your app is only required if you want persistence.
 *
 * @author Rajkumar Rathod
 */
export function GlobalReduxProvider({ children }: GlobalStateProviderProps) {
  useEffect(() => {
    initPersistence();
  }, []);

  return <>{children}</>;
}
