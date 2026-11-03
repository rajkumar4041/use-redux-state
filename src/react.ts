/**
 * React binding over `useSyncExternalStore` — the officially-sanctioned way to
 * subscribe to an external store without tearing. Replaces react-redux's
 * `useSelector`/`useDispatch`/`Provider`.
 *
 * @author Rajkumar Rathod
 */

import { useCallback, useRef, useSyncExternalStore } from 'react';
import { getState, subscribe } from './store';

type State = Record<string, unknown>;

/**
 * Subscribe to a selected slice of the store.
 *
 * The snapshot is cached and compared with `isEqual` (default `Object.is`) so
 * selectors that build a new object/array each call don't trigger the
 * "getSnapshot should be cached" loop and only re-render when the result
 * actually changes.
 */
export const useStoreSelector = <R>(
  selector: (state: State) => R,
  isEqual: (a: R, b: R) => boolean = Object.is
): R => {
  const cache = useRef<{ has: boolean; value: R }>({
    has: false,
    value: undefined as unknown as R,
  });

  const getSnapshot = useCallback(() => {
    const next = selector(getState());
    const prev = cache.current;
    if (prev.has && isEqual(prev.value, next)) {
      return prev.value;
    }
    cache.current = { has: true, value: next };
    return next;
    // selector/isEqual are expected to be stable per hook call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
