import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

/**
 * 중간고사 보관함(/johamin/midterm/): the same app page is copied to midterm/index.html, and every page gets
 * <base href> so relative files (figures/…, portraits/…) load from the site root on both addresses.
 */
function midterm(): Plugin {
  let base = '/';
  return {
    name: 'johamin-midterm',
    configResolved(config) { base = config.base; },
    transformIndexHtml: html => html.replace('<head>', `<head>\n<base href="${base}"/>`),
  };
}

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
      // 같은 앱을 /midterm/(중간고사 보관함) · /elice/(정보) · /lotte/(롯데)에도 둔다. 메뉴는 주소로 고른다(lib/exam.ts).
      for (const dir of ['midterm', 'elice', 'lotte']) {
        mkdirSync(join(outDir, dir), { recursive: true });
        copyFileSync(join(outDir, 'index.html'), join(outDir, dir, 'index.html'));
      }
      const files: string[] = [];
      const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
          const path = join(dir, name);
          if (statSync(path).isDirectory()) walk(path);
          else files.push(relative(outDir, path).split('\\').join('/'));
        }
      };
      walk(outDir);
      // index.html is saved as the app shell. The background videos are not precached: each device saves only the one
      // size it actually plays (Backdrop asks the worker for it), so phones never download the 1080p file.
      const precache = files.filter(file => !['sw.js', 'index.html'].includes(file) && !/^videos\/.*\.mp4$/.test(file)).sort();
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
  plugins: [react(), midterm(), offline()],
  server: { host: '127.0.0.1', port: 5175, strictPort: true },
  build: { outDir: 'dist' },
});
