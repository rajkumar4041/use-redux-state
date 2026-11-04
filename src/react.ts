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
  // Keep the latest selector/isEqual in refs so the stable getSnapshot below
  // always uses current values — even when the caller passes a fresh selector
  // or a changed `key` on each render.
  const selectorRef = useRef(selector);
  const isEqualRef = useRef(isEqual);
  selectorRef.current = selector;
  isEqualRef.current = isEqual;

  const cache = useRef<{ has: boolean; value: R }>({
    has: false,
    value: undefined as unknown as R,
  });

  // Stable identity (empty deps) so useSyncExternalStore does not re-subscribe
  // on every render; it reads the current selector/isEqual via the refs.
  const getSnapshot = useCallback(() => {
    const next = selectorRef.current(getState());
    const prev = cache.current;
    if (prev.has && isEqualRef.current(prev.value, next)) {
      return prev.value;
    }
    cache.current = { has: true, value: next };
    return next;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
