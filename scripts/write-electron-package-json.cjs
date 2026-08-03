// El package.json raíz declara "type": "module" (lo necesita Vite para su
// propio config). Pero el proceso principal de Electron se compila a
// CommonJS. Node resuelve el "type" por el package.json más cercano, así
// que escribimos uno propio dentro de dist-electron para forzar CommonJS
// ahí, sin afectar al resto del proyecto.
const fs = require('node:fs');
const path = require('node:path');

const outDir = path.join(__dirname, '..', 'dist-electron');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'package.json'),
  JSON.stringify({ type: 'commonjs' }, null, 2) + '\n',
);
console.log('[build:electron] dist-electron/package.json escrito (type: commonjs)');
