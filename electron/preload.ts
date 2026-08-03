import { contextBridge, ipcRenderer } from 'electron';

/**
 * Puente seguro entre el renderer (React, sin acceso a Node) y el proceso
 * principal (que sí tiene acceso a SQLite/filesystem). El renderer nunca
 * toca better-sqlite3 directamente: todo pasa por IPC + este bridge.
 */
const api = {
  saves: {
    list: () => ipcRenderer.invoke('saves:list'),
    create: (name: string, options: unknown) => ipcRenderer.invoke('saves:create', name, options),
    load: (saveId: string) => ipcRenderer.invoke('saves:load', saveId),
    delete: (saveId: string) => ipcRenderer.invoke('saves:delete', saveId),
  },
  db: {
    query: (channel: string, payload: unknown) => ipcRenderer.invoke(`db:${channel}`, payload),
  },
};

export type FMApi = typeof api;

contextBridge.exposeInMainWorld('fm', api);
