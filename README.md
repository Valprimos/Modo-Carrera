# Modo Carrera FC — Fase 1 completada

Base sólida de un Football Manager moderno: Electron + Vite + React + TypeScript + SQLite.

**Dos formas de correrlo:**
1. **Escritorio (Electron + better-sqlite3)** — la experiencia completa, con archivos `.sqlite` reales en disco.
2. **Web (SQLite compilado a WebAssembly con sql.js + IndexedDB)** — mismo motor de juego, mismo esquema, corre 100% en el navegador. Es la versión que se despliega en GitHub Pages.

Ambas comparten toda la lógica de generación del mundo (`src/generation/`, `src/database/schema.sql`) — no hay dos juegos distintos, solo dos capas de persistencia distintas detrás de la misma interfaz (`src/web/gameApi.ts` elige automáticamente cuál usar).

## Arrancar en local

```bash
npm install
npm run dev            # versión web, en el navegador (http://localhost:5173)
```

Como app de escritorio real (Electron + SQLite nativo):

```bash
npm run build:electron
npm run dev:electron
```

## Publicar en GitHub Pages (versión web)

1. Crea un repo en GitHub y sube este código:
   ```bash
   git init
   git add .
   git commit -m "Fase 1: base del proyecto"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
2. En GitHub → Settings → Pages → "Build and deployment" → Source: **GitHub Actions**.
3. El workflow `.github/workflows/deploy-pages.yml` ya está incluido: en cada push a `main` compila la versión web (`vite build`, sin Electron) y la publica automáticamente. En unos minutos estará en `https://TU_USUARIO.github.io/TU_REPO/`.

No hace falta tocar nada más — el `base: './'` de Vite y el `HashRouter` de React Router ya están configurados para funcionar en cualquier subruta de GitHub Pages.

### Limitaciones de la versión web (a diferencia de Electron)

- Las partidas se guardan en **IndexedDB del navegador**, no en archivos `.sqlite` — si el usuario borra datos de navegación, pierde sus partidas. No hay sincronización entre dispositivos.
- Cada pestaña/navegador tiene sus propias partidas; no se comparten con la versión de escritorio.
- El motor de simulación (fases futuras) puede ser más lento en WASM que en SQLite nativo para mundos muy grandes — si se vuelve un cuello de botella, se puede mover la simulación a un Web Worker sin tocar el esquema.

Build de producción completo (ambos):

```bash
npm run build            # renderer + electron compilados
npx vite build            # solo la versión web, para desplegar donde sea
```

## Qué hay ya funcionando (probado, no solo escrito)

- **Esquema SQLite real** (`src/database/schema.sql`): jugadores con todos los
  atributos 1-99 pedidos, clubes, ligas, fixtures, tácticas, cláusulas de
  contrato.
- **Generador de mundo**: 3 ligas de ejemplo × 20 clubes × 23+8 jugadores =
  ~1.860 jugadores en ~140ms, con calidad correlacionada a la reputación del
  club y potencial correlacionado a la edad. Añadir más ligas es solo tocar
  `LEAGUE_DEFS` en `electron/database/seedWorld.ts`.
- **Sistema de partidas**: cada save es un `.sqlite` independiente en
  `userData/saves/`. Crear, listar, cargar, borrar — todo por IPC seguro
  (el renderer nunca toca SQLite directamente, solo `window.fm`).
- **UI**: menú principal → nueva partida (formulario de entrenador) →
  dashboard con ligas → clubes (escudos generados por SVG, sin assets) →
  plantilla con tabla ordenable y buscador. Tema oscuro consistente.
- **TypeScript estricto** en ambos lados (renderer y proceso principal),
  `noUncheckedIndexedAccess` incluido. `tsc --noEmit` limpio.

## Lo que NO está hecho todavía (siguiente trabajo, por fases, como pediste)

| Fase | Contenido | Estado |
|---|---|---|
| 1 | Base del proyecto | ✅ Hecho |
| 2 | Base de datos (mundo completo, cientos de clubes, calendario) | 🟡 Parcial — falta calendario/fixtures reales, copas, ascensos/descensos |
| 3 | Simulación de partidos | ⬜ Sin empezar |
| 4 | Mercado (compra/venta/cesiones/renovaciones/cantera) | ⬜ Sin empezar |
| 5 | IA de los otros clubes | ⬜ Sin empezar |
| 6 | Interfaz avanzada (gráficas, tácticas visuales, entrenamiento) | ⬜ Sin empezar |
| 7 | Pulido | ⬜ Sin empezar |

## Notas de arquitectura importantes

- `electron/` = proceso principal (Node, acceso a SQLite/filesystem).
  `src/` = renderer (React, sin acceso a Node). Se comunican solo por el
  bridge `window.fm` definido en `electron/preload.ts` /
  `src/types/global.d.ts`.
- `src/types/` es la única carpeta que ambos lados importan directamente
  (son tipos puros, sin lógica), por eso el `tsconfig.json` de electron
  tiene un `include` especial para ella.
- El `package.json` raíz usa `"type": "module"` (lo necesita Vite). El
  código compilado de Electron es CommonJS, así que el build escribe un
  `dist-electron/package.json` con `"type": "commonjs"` para que Node no se
  confunda al arrancar `main.js`. Si tocas `scripts/build:electron`, no
  quites ese paso o Electron no arrancará.
- **`src/web/`** contiene la capa de persistencia para el navegador: `sqljsSetup.ts`
  (carga el WASM de sql.js desde `public/sql-wasm.wasm`), `webSeedWorld.ts`
  (mismo seeder que `electron/database/seedWorld.ts` pero con la API de
  sql.js), `indexedDbStore.ts` (guarda los bytes exportados de cada partida
  en IndexedDB) y `webGameApi.ts` (implementa la misma interfaz `FMWindowApi`
  que expone el preload de Electron). `gameApi.ts` decide en runtime cuál
  usar según exista o no `window.fm`. Las páginas de React solo importan
  `gameApi`, nunca `window.fm` ni sql.js directamente.
- `better-sqlite3` es un módulo nativo. Si el `npm install` falla al
  compilarlo, puede que necesites `python3` y herramientas de compilación
  (`build-essential` en Linux, Xcode CLT en Mac, `windows-build-tools` en
  Windows) — o cambiar a `electron-rebuild` si usas una versión de Electron
  distinta a la de Node.

## Recomendación para seguir

Este proyecto va a crecer mucho (meses, como bien dices). Te va a ir mejor
seguirlo en **Claude Code** en lugar de en el chat: puedes iterar fase a
fase directamente sobre el repo, con tests reales y control de versiones,
sin los límites de una respuesta de chat.
