import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

const SAVES_DIR = path.join(app.getPath('userData'), 'saves');
const SCHEMA_PATH = path.join(__dirname, '../../../src/database/schema.sql');

function ensureSavesDir(): void {
  if (!fs.existsSync(SAVES_DIR)) fs.mkdirSync(SAVES_DIR, { recursive: true });
}

/** Abre (o crea) la base de datos de una partida concreta y aplica el esquema. */
export function openSaveDatabase(dbFileName: string): Database.Database {
  ensureSavesDir();
  const fullPath = path.join(SAVES_DIR, dbFileName);
  const db = new Database(fullPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  db.exec(schema);

  return db;
}

export function listSaveFiles(): string[] {
  ensureSavesDir();
  return fs.readdirSync(SAVES_DIR).filter((f) => f.endsWith('.sqlite'));
}

export function deleteSaveFile(dbFileName: string): void {
  const fullPath = path.join(SAVES_DIR, dbFileName);
  for (const suffix of ['', '-wal', '-shm']) {
    const p = fullPath + suffix;
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

export function savesDir(): string {
  ensureSavesDir();
  return SAVES_DIR;
}
