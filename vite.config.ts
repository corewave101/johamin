import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves the site under /johamin/; local dev and build stay at /.
  base: process.env.PAGES_BASE ?? '/',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  build: { outDir: 'dist' },
});
