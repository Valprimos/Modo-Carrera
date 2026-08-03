import type { FMWindowApi } from '@/types/global';
import { webGameApi } from './webGameApi';

/**
 * En Electron, `electron/preload.ts` inyecta `window.fm` antes de que React
 * cargue. Si no existe (estamos en un navegador normal, p.ej. GitHub Pages),
 * usamos la implementación 100% en el navegador (sql.js + IndexedDB) que
 * expone exactamente la misma interfaz. Las páginas importan `gameApi` y no
 * necesitan saber en qué entorno están corriendo.
 */
export const gameApi: FMWindowApi = typeof window !== 'undefined' && window.fm
  ? window.fm
  : webGameApi;

export const isElectron: boolean = typeof window !== 'undefined' && Boolean(window.fm);
