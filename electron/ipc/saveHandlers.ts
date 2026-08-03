import type { IpcMain } from 'electron';
import { randomUUID } from 'node:crypto';
import { openSaveDatabase, listSaveFiles, deleteSaveFile } from '../database/connection';
import { seedNewWorld } from '../database/seedWorld';
import type { SaveMeta } from '../../src/types/career';

const openDatabases = new Map<string, ReturnType<typeof openSaveDatabase>>();

function getOrOpenDb(dbFileName: string) {
  let db = openDatabases.get(dbFileName);
  if (!db) {
    db = openSaveDatabase(dbFileName);
    openDatabases.set(dbFileName, db);
  }
  return db;
}

function readMetaFromDb(db: ReturnType<typeof openSaveDatabase>, dbFileName: string, saveId: string, name: string): SaveMeta {
  const managerRow = db.prepare('SELECT id FROM managers WHERE is_human = 1 LIMIT 1').get() as { id: string } | undefined;
  const seasonRow = db.prepare(`SELECT value FROM meta WHERE key = 'currentSeason'`).get() as { value: string } | undefined;

  return {
    id: saveId,
    name,
    managerId: managerRow?.id ?? '',
    currentSeason: seasonRow ? Number(seasonRow.value) : new Date().getFullYear(),
    currentDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dbFileName,
  };
}

export function registerSaveHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('saves:list', () => {
    return listSaveFiles().map((fileName) => {
      const saveId = fileName.replace('.sqlite', '');
      const db = getOrOpenDb(fileName);
      return readMetaFromDb(db, fileName, saveId, saveId);
    });
  });

  ipcMain.handle('saves:create', (_event, name: string, options: { managerFirstName: string; managerLastName: string; nationality: string }) => {
    const saveId = randomUUID();
    const dbFileName = `${saveId}.sqlite`;
    const db = getOrOpenDb(dbFileName);

    seedNewWorld(db);

    const managerId = randomUUID();
    db.prepare(`
      INSERT INTO managers (id, first_name, last_name, nationality, club_id, reputation, board_confidence, season_objective, is_human)
      VALUES (?, ?, ?, ?, NULL, 10, 60, 'Sin objetivo asignado todavía', 1)
    `).run(managerId, options.managerFirstName, options.managerLastName, options.nationality);

    return readMetaFromDb(db, dbFileName, saveId, name);
  });

  ipcMain.handle('saves:load', (_event, saveId: string) => {
    const dbFileName = `${saveId}.sqlite`;
    const db = getOrOpenDb(dbFileName);
    return readMetaFromDb(db, dbFileName, saveId, saveId);
  });

  ipcMain.handle('saves:delete', (_event, saveId: string) => {
    const dbFileName = `${saveId}.sqlite`;
    const db = openDatabases.get(dbFileName);
    if (db) {
      db.close();
      openDatabases.delete(dbFileName);
    }
    deleteSaveFile(dbFileName);
    return true;
  });
}

export function getOpenDatabase(dbFileName: string) {
  return getOrOpenDb(dbFileName);
}
