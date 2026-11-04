import { beforeEach, expect, it } from 'vitest';
import { createStore } from '../createStore';
import { clearSlices } from '../store';

beforeEach(() => {
  clearSlices();
});

it('registers eagerly and get() returns the initial state', () => {
  const s = createStore('counter', { count: 0 });
  expect(s.key).toBe('counter');
  expect(s.get()).toEqual({ count: 0 });
});

it('set replaces and set(updater) reads current value', () => {
  const s = createStore('counter', { count: 0 });
  s.set({ count: 5 });
  expect(s.get()).toEqual({ count: 5 });
  s.set((prev) => ({ count: prev.count + 1 }));
  expect(s.get()).toEqual({ count: 6 });
});

it('set works before any hook mounts (imperative-first)', () => {
  const s = createStore('n', { v: 1 });
  s.set((p) => ({ v: p.v + 10 }));
  expect(s.get()).toEqual({ v: 11 });
});

it('exposes a useReset hook on the bundle', () => {
  const s = createStore('counter', { count: 0 });
  expect(typeof s.useReset).toBe('function');
  // (useReset's reset behavior is exercised in createStore.hooks.test.tsx)
});

it('set(get()) is a consistent no-op write', () => {
  const s = createStore('counter', { count: 0 });
  s.set({ count: 9 });
  s.set(s.get());
  expect(s.get()).toEqual({ count: 9 });
});

it('primitive store: set replaces', () => {
  const s = createStore('count', 0);
  s.set(5);
  expect(s.get()).toBe(5);
});

it('two createStore calls with the same name share state and do not throw', () => {
  const a = createStore('dup', { x: 1 });
  const b = createStore('dup', { x: 1 });
  a.set({ x: 42 });
  expect(b.get()).toEqual({ x: 42 });
});

it('preserves an already-present value over initialState', () => {
  const first = createStore('pre', { n: 1 });
  first.set({ n: 99 });
  const second = createStore('pre', { n: 1 }); // re-create, e.g. after hydrate
  expect(second.get()).toEqual({ n: 99 });
});
