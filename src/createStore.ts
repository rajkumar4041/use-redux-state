/**
 * Typed store factory. Define one store per file (convention) and get a bundle
 * of fully-typed, reusable hooks + imperative accessors. Built on top of the
 * existing vanilla primitives — no new runtime dependency.
 *
 * @author Rajkumar Rathod
 */
import { useCallback } from 'react';
import { useStoreSelector } from './react';
import { ensureKey, getState, resetKey, setKeyValue, updateKeyValue } from './store';

export type StoreSetValue<S> = (value: S | ((prev: S) => S)) => void;
export type StoreUpdate<S> = (partial: Partial<S>) => void;

export interface Store<S> {
  /** The underlying store key (for advanced/imperative interop). */
  key: string;
  /** useState-like tuple for the whole store. */
  use: () => [S, StoreSetValue<S>, { update: StoreUpdate<S>; reset: () => void }];
  /** Read the whole state object. */
  useValue: () => S;
  /** Read a derived slice; pass `shallow` as isEqual for object results. */
  useSelector: <R>(selector: (state: S) => R, isEqual?: (a: R, b: R) => boolean) => R;
  /** Write-only: setter + partial update (no value subscription). */
  useSet: () => [StoreSetValue<S>, StoreUpdate<S>];
  /** A reset function bound to this store. */
  useReset: () => () => void;
  /** Imperative read (for actions/utilities outside React). */
  get: () => S;
  /** Imperative write — direct value or updater function. */
  set: StoreSetValue<S>;
}

export const createStore = <S>(name: string, initialState: S): Store<S> => {
  // Eager, render-safe registration so read-only hooks and imperative actions
  // work even before any component mounts. Preserves an already-present value
  // (e.g. one restored from IndexedDB) over initialState.
  ensureKey(name, initialState);

  const get = (): S => {
    const s = getState();
    return (name in s ? s[name] : initialState) as S;
  };

  const set: StoreSetValue<S> = (value) => {
    const next =
      typeof value === 'function'
        ? (value as (prev: S) => S)(get())
        : value;
    setKeyValue(name, next);
  };

  const update: StoreUpdate<S> = (partial) => updateKeyValue(name, partial);
  const reset = (): void => resetKey(name);

  const readFrom = (s: Record<string, unknown>): S =>
    (name in s ? s[name] : initialState) as S;

  const useValue = (): S => useStoreSelector((s) => readFrom(s));

  const useSelector = <R,>(
    selector: (state: S) => R,
    isEqual?: (a: R, b: R) => boolean
  ): R => useStoreSelector((s) => selector(readFrom(s)), isEqual);

  const useSet = (): [StoreSetValue<S>, StoreUpdate<S>] => {
    // set/update/reset close over `name`, so their identity is already stable.
    const stableSet = useCallback<StoreSetValue<S>>(set, []);
    const stableUpdate = useCallback<StoreUpdate<S>>(update, []);
    return [stableSet, stableUpdate];
  };

  const use = (): [S, StoreSetValue<S>, { update: StoreUpdate<S>; reset: () => void }] => {
    const value = useValue();
    const [stableSet, stableUpdate] = useSet();
    const stableReset = useCallback(reset, []);
    return [value, stableSet, { update: stableUpdate, reset: stableReset }];
  };

  const useReset = (): (() => void) => useCallback(reset, []);

  return {
    key: name,
    get,
    set,
    use,
    useValue,
    useSelector,
    useSet,
    useReset,
  };
};
