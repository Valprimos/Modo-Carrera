import type { IpcMain } from 'electron';
import { getOpenDatabase } from './saveHandlers';

interface SquadQuery {
  dbFileName: string;
  clubId: string;
}

interface ClubsQuery {
  dbFileName: string;
  leagueId: string;
}

/** Consultas de solo lectura que la UI necesita para pintar el dashboard.
 * Se añadirán más en fases siguientes (mercado, tácticas, finanzas...). */
export function registerDatabaseHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('db:squad', (_event, query: SquadQuery) => {
    const db = getOpenDatabase(query.dbFileName);
    return db.prepare('SELECT * FROM players WHERE club_id = ? ORDER BY current_ability DESC')
      .all(query.clubId);
  });

  ipcMain.handle('db:leagues', (_event, payload: { dbFileName: string }) => {
    const db = getOpenDatabase(payload.dbFileName);
    return db.prepare('SELECT * FROM leagues').all();
  });

  ipcMain.handle('db:clubsInLeague', (_event, query: ClubsQuery) => {
    const db = getOpenDatabase(query.dbFileName);
    return db.prepare('SELECT * FROM clubs WHERE league_id = ? ORDER BY reputation DESC')
      .all(query.leagueId);
  });

  ipcMain.handle('db:playerCount', (_event, payload: { dbFileName: string }) => {
    const db = getOpenDatabase(payload.dbFileName);
    const row = db.prepare('SELECT COUNT(*) as count FROM players').get() as { count: number };
    return row.count;
  });
}
