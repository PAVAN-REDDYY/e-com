import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite config is intentionally minimal and env-driven.
// - `@` alias keeps imports clean and refactor-safe as the app grows toward v2.
// - The dev server port is configurable via FRONTEND_PORT to avoid local port clashes.
//   (See README "Troubleshooting > Port conflicts".)
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(process.env.FRONTEND_PORT) || 5173,
      strictPort: false,
      host: true, // listen on 0.0.0.0 so it works inside containers later
    },
    preview: {
      port: Number(process.env.FRONTEND_PORT) || 4173,
      host: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: isDev,
      // Keep chunks reasonable; the storefront is small but this guards v2 growth.
      chunkSizeWarningLimit: 900,
    },
  };
});
