/**
 * Typed store factory. Define one store per file (convention) and get a bundle
 * of fully-typed, reusable hooks + imperative accessors. Built on top of the
 * existing vanilla primitives — no new runtime dependency.
 *
 * @author Rajkumar Rathod
 */
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

  // Hook members are implemented in Task 2; stubbed here so the type surface is
  // complete and Task 2's tests have a genuine RED.
  const notImplemented = (): never => {
    throw new Error('createStore hooks not implemented yet');
  };

  return {
    key: name,
    get,
    set,
    use: notImplemented,
    useValue: notImplemented,
    useSelector: notImplemented,
    useSet: notImplemented,
    useReset: notImplemented,
  };
};
