import { IDBFactory } from 'fake-indexeddb';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// persist.ts keeps module-level state (a `started` flag), so each test loads a
// fresh module graph and a fresh in-memory IndexedDB.
beforeEach(() => {
  vi.resetModules();
  globalThis.indexedDB = new IDBFactory();
});

const freshModules = async () => {
  const store = await import('../store');
  const persist = await import('../persist');
  const idb = await import('../idb');
  return { store, persist, idb };
};

describe('idb wrapper', () => {
  it('round-trips get/set/delete', async () => {
    const { idb } = await freshModules();
    await idb.idbSet('k', { hello: 'world' });
    expect(await idb.idbGet('k')).toEqual({ hello: 'world' });
    await idb.idbDel('k');
    expect(await idb.idbGet('k')).toBeUndefined();
  });
});

describe('initPersistence', () => {
  it('restores a saved snapshot into the store and then clears it', async () => {
    const { store, persist, idb } = await freshModules();
    await idb.idbSet('state', { count: 42 });

    persist.initPersistence();

    await vi.waitFor(() => {
      expect(store.getState().count).toBe(42);
    });
    // restore-and-clear: the bridge snapshot is deleted after hydration
    await vi.waitFor(async () => {
      expect(await idb.idbGet('state')).toBeUndefined();
    });
  });

  it('mirrors subsequent changes back to IndexedDB (debounced)', async () => {
    const { store, persist, idb } = await freshModules();
    persist.initPersistence();

    store.registerKey('count', 0);
    store.setKeyValue('count', 7);

    await vi.waitFor(async () => {
      const saved = (await idb.idbGet('state')) as { count?: number } | undefined;
      expect(saved?.count).toBe(7);
    });
  });

  it('no-ops when IndexedDB is unavailable', async () => {
    // @ts-expect-error simulate an environment without IndexedDB
    globalThis.indexedDB = undefined;
    const { persist } = await freshModules();
    expect(() => persist.initPersistence()).not.toThrow();
  });
});
