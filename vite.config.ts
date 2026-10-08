import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

/**
 * Offline support: after the build, writes the list of every file into dist/sw.js so the service worker
 * saves them all on the first visit. The version is a hash of the files, so any change ships a fresh copy.
 */
function offline(): Plugin {
  let outDir = 'dist';
  return {
    name: 'johamin-offline',
    apply: 'build',
    configResolved(config) { outDir = config.build.outDir; },
    closeBundle() {
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const path = join(dir, name);
          if (statSync(path).isDirectory()) walk(path);
          else files.push(relative(outDir, path).split('\\').join('/'));
        }
      };
      walk(outDir);
      // index.html is saved as the app shell; the large original card PNG is not used by the app.
      const precache = files.filter(file => !['sw.js', 'index.html'].includes(file) && !/^images\/.*\.png$/.test(file)).sort();
      const swPath = join(outDir, 'sw.js');
      const hash = createHash('sha256');
      hash.update(readFileSync(swPath)); // Worker changes also need their own cache version.
      for (const file of [...precache, 'index.html']) hash.update(file).update(readFileSync(join(outDir, file)));
      const sw = readFileSync(swPath, 'utf8')
        .replace("'__BUILD__'", JSON.stringify(`${version}-${hash.digest('hex').slice(0, 10)}`))
        .replace('const PRECACHE = [];', `const PRECACHE = ${JSON.stringify(precache.map(file => `./${file}`))};`);
      if (sw.includes('__BUILD__') || sw.includes('const PRECACHE = [];')) throw new Error('sw.js placeholders not found');
      writeFileSync(swPath, sw);
    },
  };
}

export default defineConfig({
  // GitHub Pages serves the site under /johamin/; local dev and build stay at /.
  base: process.env.PAGES_BASE ?? '/',
  define: { __APP_VERSION__: JSON.stringify(version), __CHANGELOG__: JSON.stringify(readFileSync(new URL('./CHANGELOG.md', import.meta.url), 'utf8')) },
  plugins: [react(), offline()],
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  build: { outDir: 'dist' },
});
