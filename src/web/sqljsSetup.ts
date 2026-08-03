import initSqlJs, { type SqlJsStatic } from 'sql.js';

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

/**
 * Carga el motor SQLite compilado a WebAssembly (sql.js) una sola vez.
 * El .wasm se sirve como asset estático (public/sql-wasm.wasm) para que
 * funcione en GitHub Pages sin depender de un CDN externo.
 */
export function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs({
      locateFile: (file) => `${import.meta.env.BASE_URL}${file}`,
    });
  }
  return sqlJsPromise;
}
