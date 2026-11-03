/**
 * Vanilla, dependency-free keyed store.
 *
 * Replaces the previous Redux Toolkit implementation. There is no Redux, no
 * react-redux and no external dependency here — just a closure holding a
 * keyed state object plus a Set of listeners (the Zustand pattern).
 *
 * @author Rajkumar Rathod
 */

type Listener = () => void;

/** The whole app state, keyed by slice name. */
let state: Record<string, unknown> = {};

/** Listeners notified on every state change. */
const listeners = new Set<Listener>();

/** Declared initial values per key (used by `reset`). */
const initialValues = new Map<string, unknown>();

/** Keys that have been registered via a hook or `createSliceForKey`. */
const registeredKeys = new Set<string>();

/** Notify every subscriber that the state changed. */
const emit = (): void => {
  listeners.forEach((listener) => listener());
};

/** Current state snapshot (stable reference until the next change). */
export const getState = (): Record<string, unknown> => state;

/** Subscribe to state changes. Returns an unsubscribe function. */
export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Whether a key has been registered. */
export const isKeyRegistered = (key: string): boolean => registeredKeys.has(key);

/**
 * Register a key with its initial value. Idempotent: an existing value
 * (e.g. one restored from IndexedDB) is preserved, only the initial value
 * used by `reset` is (re)recorded.
 */
export const registerKey = <T>(key: string, initialValue: T): void => {
  initialValues.set(key, initialValue);
  registeredKeys.add(key);
  if (!(key in state)) {
    state = { ...state, [key]: initialValue };
    emit();
  }
};

/** Replace the value at `key`. No-op if the reference is unchanged. */
export const setKeyValue = <T>(key: string, value: T): void => {
  if (Object.is(state[key], value)) return;
  state = { ...state, [key]: value };
  emit();
};

/** Shallow-merge a partial into the value at `key` (objects only). */
export const updateKeyValue = <T>(key: string, partial: Partial<T>): void => {
  const current = state[key];
  const next =
    typeof current === 'object' && current !== null
      ? { ...(current as object), ...(partial as object) }
      : (partial as unknown as T);
  setKeyValue(key, next);
};

/** Reset a key back to the initial value it was registered with. */
export const resetKey = (key: string): void => {
  setKeyValue(key, initialValues.get(key));
};

/** Bulk-apply a restored snapshot (used by the persistence layer). */
export const hydrate = (saved: Record<string, unknown>): void => {
  state = { ...state, ...saved };
  Object.keys(saved).forEach((key) => registeredKeys.add(key));
  emit();
};

/* ------------------------------------------------------------------ */
/* Backwards-compatible "advanced" API                                 */
/* These keep the names/shapes the previous Redux version exported so  */
/* existing consumers don't break, implemented in vanilla terms.       */
/* ------------------------------------------------------------------ */

/** A lightweight, slice-like handle for a key. */
export interface KeySlice<T> {
  name: string;
  getInitialState: () => T;
  actions: {
    setValue: (value: T) => void;
    updateValue: (partial: Partial<T>) => void;
    reset: () => void;
  };
}

const makeSlice = <T>(key: string): KeySlice<T> => ({
  name: key,
  getInitialState: () => initialValues.get(key) as T,
  actions: {
    setValue: (value: T) => setKeyValue(key, value),
    updateValue: (partial: Partial<T>) => updateKeyValue(key, partial),
    reset: () => resetKey(key),
  },
});

/** The singleton store handle. */
export const getStore = () => ({
  getState,
  subscribe,
  setValue: setKeyValue,
  updateValue: updateKeyValue,
  reset: resetKey,
});

/** Create (or return the existing) slice handle for a key. */
export const createSliceForKey = <T>(key: string, initialValue: T): KeySlice<T> => {
  registerKey(key, initialValue);
  return makeSlice<T>(key);
};

/** Get the slice handle for a key, or null if it was never registered. */
export const getSliceForKey = <T>(key: string): KeySlice<T> | null =>
  registeredKeys.has(key) ? makeSlice<T>(key) : null;

/** All registered keys. */
export const getRegisteredKeys = (): string[] => Array.from(registeredKeys);

/** Clear everything — state, registry and initial values. */
export const clearSlices = (): void => {
  state = {};
  initialValues.clear();
  registeredKeys.clear();
  emit();
};
