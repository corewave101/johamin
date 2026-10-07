import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  // GitHub Pages serves the site under /johamin/; local dev and build stay at /.
  base: process.env.PAGES_BASE ?? '/',
  define: { __APP_VERSION__: JSON.stringify(version) },
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  build: { outDir: 'dist' },
});
