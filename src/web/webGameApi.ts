import type { Database } from 'sql.js';
import type { SaveMeta } from '@/types/career';
import type { FMWindowApi } from '@/types/global';
import { createEmptyDatabase, openDatabaseFromBytes, seedNewWorld } from './webSeedWorld';
import {
  putSaveRecord, getSaveRecord, listSaveRecords, deleteSaveRecord,
} from './indexedDbStore';

// Bases de datos sql.js abiertas en memoria, indexadas por saveId (que en
// el modo web hace las veces del "dbFileName" del modo Electron).
const openDatabases = new Map<string, Database>();

function readSeason(db: Database): number {
  const res = db.exec(`SELECT value FROM meta WHERE key = 'currentSeason'`);
  const row = res[0]?.values[0];
  return row ? Number(row[0]) : new Date().getFullYear();
}

async function persist(saveId: string, name: string, db: Database, createdAt: string): Promise<void> {
  await putSaveRecord({
    id: saveId,
    name,
    currentSeason: readSeason(db),
    createdAt,
    updatedAt: new Date().toISOString(),
    bytes: db.export(),
  });
}

function rowsToObjects<T>(result: ReturnType<Database['exec']>): T[] {
  if (result.length === 0) return [];
  const { columns, values } = result[0]!;
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj as T;
  });
}

export const webGameApi: FMWindowApi = {
  saves: {
    async list() {
      const records = await listSaveRecords();
      return records.map((r) => ({
        id: r.id,
        name: r.name,
        managerId: '',
        currentSeason: r.currentSeason,
        currentDate: r.updatedAt,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        dbFileName: r.id,
      } satisfies SaveMeta));
    },

    async create(name, options) {
      const saveId = crypto.randomUUID();
      const db = await createEmptyDatabase();
      seedNewWorld(db);

      const managerId = crypto.randomUUID();
      db.run(
        `INSERT INTO managers (id, first_name, last_name, nationality, club_id, reputation, board_confidence, season_objective, is_human)
         VALUES (?, ?, ?, ?, NULL, 10, 60, 'Sin objetivo asignado todavía', 1)`,
        [managerId, options.managerFirstName, options.managerLastName, options.nationality],
      );

      const createdAt = new Date().toISOString();
      openDatabases.set(saveId, db);
      await persist(saveId, name, db, createdAt);

      return {
        id: saveId, name, managerId, currentSeason: readSeason(db),
        currentDate: createdAt, createdAt, updatedAt: createdAt, dbFileName: saveId,
      };
    },

    async load(saveId) {
      let db = openDatabases.get(saveId);
      const record = await getSaveRecord(saveId);
      if (!record) throw new Error(`No se encontró la partida ${saveId}`);
      if (!db) {
        db = await openDatabaseFromBytes(record.bytes);
        openDatabases.set(saveId, db);
      }
      return {
        id: saveId, name: record.name, managerId: '', currentSeason: readSeason(db),
        currentDate: record.updatedAt, createdAt: record.createdAt,
        updatedAt: record.updatedAt, dbFileName: saveId,
      };
    },

    async delete(saveId) {
      openDatabases.get(saveId)?.close();
      openDatabases.delete(saveId);
      await deleteSaveRecord(saveId);
      return true;
    },
  },

  db: {
    async query<T>(channel: string, payload: unknown): Promise<T> {
      const { dbFileName } = payload as { dbFileName: string };
      const db = openDatabases.get(dbFileName);
      if (!db) throw new Error('Base de datos no abierta. Carga la partida primero.');

      switch (channel) {
        case 'leagues':
          return rowsToObjects<T>(db.exec('SELECT * FROM leagues')) as unknown as T;

        case 'clubsInLeague': {
          const { leagueId } = payload as { leagueId: string };
          const res = db.exec('SELECT * FROM clubs WHERE league_id = ? ORDER BY reputation DESC', [leagueId]);
          return rowsToObjects<T>(res) as unknown as T;
        }

        case 'squad': {
          const { clubId } = payload as { clubId: string };
          const res = db.exec('SELECT * FROM players WHERE club_id = ? ORDER BY current_ability DESC', [clubId]);
          return rowsToObjects<T>(res) as unknown as T;
        }

        case 'playerCount': {
          const res = db.exec('SELECT COUNT(*) as count FROM players');
          const count = res[0]?.values[0]?.[0] ?? 0;
          return count as unknown as T;
        }

        default:
          throw new Error(`Canal de consulta desconocido: ${channel}`);
      }
    },
  },
};
