/**
 * Hand-written, promisified IndexedDB wrapper. No external library.
 *
 * Used only as an ephemeral bridge across a page refresh — see persist.ts.
 *
 * @author Rajkumar Rathod
 */

const DB_NAME = 'redux-toolkit-state';
const STORE = 'ephemeral';
const VERSION = 1;

/** Whether IndexedDB is usable in the current environment (guards SSR). */
export const idbAvailable = (): boolean =>
  typeof indexedDB !== 'undefined' && indexedDB !== null;

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const run = <T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> =>
  openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const req = fn(tx.objectStore(STORE));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
      })
  );

export const idbGet = <T>(key: string): Promise<T | undefined> =>
  run('readonly', (store) => store.get(key) as IDBRequest<T>);

export const idbSet = (key: string, value: unknown): Promise<IDBValidKey> =>
  run('readwrite', (store) => store.put(value, key));

export const idbDel = (key: string): Promise<undefined> =>
  run('readwrite', (store) => store.delete(key) as IDBRequest<undefined>);
