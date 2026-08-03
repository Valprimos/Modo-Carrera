import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
// Config del renderer. El proceso principal de Electron se compila aparte
// (ver electron/tsconfig.json) porque corre en Node, no en el navegador.
export default defineConfig({
    plugins: [react()],
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        strictPort: true,
    },
});
