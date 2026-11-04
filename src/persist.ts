/**
 * Ephemeral persistence: bridge state across a page refresh via IndexedDB,
 * then wipe it.
 *
 * Model (reliable):
 *   - On load, read the saved snapshot, hydrate the store, then DELETE it
 *     immediately so IndexedDB never holds long-term data.
 *   - While running, mirror the latest state back to IndexedDB (debounced),
 *     and also write once on `pagehide` as a best-effort unload capture, so
 *     repeated refreshes keep working.
 *
 * @author Rajkumar Rathod
 */

import { idbAvailable, idbDel, idbGet, idbSet } from './idb';
import { getState, hydrate, subscribe } from './store';

const SNAPSHOT_KEY = 'state';
const DEBOUNCE_MS = 150;

let started = false;
let timer: ReturnType<typeof setTimeout> | undefined;

const save = (): void => {
  idbSet(SNAPSHOT_KEY, getState()).catch(() => {
    /* storage unavailable / quota — ignore, persistence is best-effort */
  });
};

/**
 * Initialise persistence exactly once. Safe to call from every provider
 * mount and in environments without IndexedDB (SSR) — it no-ops there.
 */
export const initPersistence = (): void => {
  if (started || !idbAvailable()) return;
  started = true;

  // Restore-and-clear: hydrate from the bridge snapshot, then remove it.
  idbGet<Record<string, unknown>>(SNAPSHOT_KEY)
    .then((saved) => {
      if (saved && typeof saved === 'object') {
        hydrate(saved);
        idbDel(SNAPSHOT_KEY).catch(() => {});
      }
    })
    .catch(() => {});

  // Mirror: debounced write of the latest state on every change.
  subscribe(() => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(save, DEBOUNCE_MS);
  });

  // Best-effort capture at unload so a refresh with no recent change survives.
  if (typeof addEventListener !== 'undefined') {
    addEventListener('pagehide', save);
  }
};
