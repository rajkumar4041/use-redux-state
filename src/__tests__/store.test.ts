import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearSlices,
  createSliceForKey,
  getRegisteredKeys,
  getSliceForKey,
  getState,
  getStore,
  hydrate,
  isKeyRegistered,
  registerKey,
  resetKey,
  setKeyValue,
  subscribe,
  updateKeyValue,
} from '../store';

beforeEach(() => {
  clearSlices();
});

describe('registerKey', () => {
  it('seeds the initial value and marks the key registered', () => {
    registerKey('count', 0);
    expect(getState().count).toBe(0);
    expect(isKeyRegistered('count')).toBe(true);
  });

  it('is idempotent and preserves an existing value', () => {
    registerKey('count', 0);
    setKeyValue('count', 5);
    registerKey('count', 0); // e.g. a second component mounting
    expect(getState().count).toBe(5);
  });
});

describe('setKeyValue', () => {
  it('updates the value and produces a new state reference', () => {
    registerKey('count', 0);
    const before = getState();
    setKeyValue('count', 1);
    expect(getState().count).toBe(1);
    expect(getState()).not.toBe(before);
  });

  it('bails out (no notify, same reference) when the value is unchanged', () => {
    registerKey('count', 0);
    const ref = getState();
    const listener = vi.fn();
    subscribe(listener);
    setKeyValue('count', 0);
    expect(listener).not.toHaveBeenCalled();
    expect(getState()).toBe(ref);
  });
});

describe('updateKeyValue', () => {
  it('shallow-merges into an object value', () => {
    registerKey('user', { name: 'a', age: 1 });
    updateKeyValue('user', { age: 2 });
    expect(getState().user).toEqual({ name: 'a', age: 2 });
  });

  it('replaces a non-object value', () => {
    registerKey('count', 1);
    updateKeyValue('count', 9 as never);
    expect(getState().count).toBe(9);
  });
});

describe('resetKey', () => {
  it('restores the originally registered initial value', () => {
    registerKey('count', 10);
    setKeyValue('count', 99);
    resetKey('count');
    expect(getState().count).toBe(10);
  });
});

describe('subscribe', () => {
  it('notifies on change and stops after unsubscribe', () => {
    registerKey('count', 0);
    const listener = vi.fn();
    const unsub = subscribe(listener);
    setKeyValue('count', 1);
    expect(listener).toHaveBeenCalledTimes(1);
    unsub();
    setKeyValue('count', 2);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('hydrate', () => {
  it('bulk-merges a snapshot and registers its keys', () => {
    registerKey('a', 1);
    hydrate({ a: 100, b: 200 });
    expect(getState()).toMatchObject({ a: 100, b: 200 });
    expect(isKeyRegistered('b')).toBe(true);
  });
});

describe('backwards-compatible API', () => {
  it('createSliceForKey registers and exposes working actions', () => {
    const slice = createSliceForKey('count', 0);
    slice.actions.setValue(3);
    expect(getState().count).toBe(3);
    slice.actions.updateValue({} as never);
    slice.actions.reset();
    expect(getState().count).toBe(0);
    expect(slice.name).toBe('count');
    expect(slice.getInitialState()).toBe(0);
  });

  it('getSliceForKey returns null for unknown keys', () => {
    expect(getSliceForKey('nope')).toBeNull();
    createSliceForKey('known', 1);
    expect(getSliceForKey('known')).not.toBeNull();
  });

  it('getRegisteredKeys lists all keys', () => {
    createSliceForKey('x', 1);
    createSliceForKey('y', 2);
    expect(getRegisteredKeys().sort()).toEqual(['x', 'y']);
  });

  it('getStore exposes getState/subscribe/setValue', () => {
    const store = getStore();
    registerKey('count', 0);
    store.setValue('count', 7);
    expect(store.getState().count).toBe(7);
  });

  it('clearSlices wipes everything', () => {
    createSliceForKey('x', 1);
    clearSlices();
    expect(getRegisteredKeys()).toEqual([]);
    expect(getState()).toEqual({});
  });
});
