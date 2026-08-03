const DB_NAME = 'fm-career-manager';
const DB_VERSION = 1;
const SAVES_STORE = 'saves';

interface StoredSaveRecord {
  id: string;
  name: string;
  currentSeason: number;
  createdAt: string;
  updatedAt: string;
  bytes: Uint8Array;
}

function openIndexedDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SAVES_STORE)) {
        db.createObjectStore(SAVES_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openIndexedDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(SAVES_STORE, mode);
    const store = tx.objectStore(SAVES_STORE);
    const request = fn(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function putSaveRecord(record: StoredSaveRecord): Promise<void> {
  await withStore('readwrite', (store) => store.put(record));
}

export async function getSaveRecord(id: string): Promise<StoredSaveRecord | undefined> {
  return withStore('readonly', (store) => store.get(id));
}

export async function listSaveRecords(): Promise<StoredSaveRecord[]> {
  return withStore('readonly', (store) => store.getAll());
}

export async function deleteSaveRecord(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id));
}

export type { StoredSaveRecord };
