# Modo Carrera FC — Fase 1 completada

Base sólida de un Football Manager moderno: Electron + Vite + React + TypeScript + SQLite.

## Arrancar

```bash
npm install
npm run dev            # solo el renderer, en el navegador (http://localhost:5173)
```

Para probar como app de escritorio real (Electron + SQLite):

```bash
npm run build:electron   # compila electron/ a dist-electron/ (CommonJS)
npm run dev:electron     # levanta Vite + Electron juntos, con la BD real
```

Build de producción completo:

```bash
npm run build            # renderer + electron compilados
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
