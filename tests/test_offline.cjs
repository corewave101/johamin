// Offline app (PWA): manifest, icons, page links and the service worker template the build fills in.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const manifest = JSON.parse(fs.readFileSync('public/manifest.webmanifest', 'utf8'));
assert.equal(manifest.display, 'standalone');
assert.equal(manifest.start_url, './');
for (const icon of manifest.icons) assert.ok(fs.existsSync(`public/${icon.src}`), icon.src);
assert.ok(manifest.icons.some(i => i.sizes === '512x512' && i.purpose === 'maskable'));
const html = fs.readFileSync('index.html', 'utf8');
assert.ok(html.includes('rel="manifest"') && html.includes('apple-touch-icon'));
const sw = fs.readFileSync('public/sw.js', 'utf8');
assert.ok(sw.includes("const VERSION = '__BUILD__';") && sw.includes('const PRECACHE = [];'), 'vite.config.ts replaces these two lines');
assert.ok(fs.readFileSync('vite.config.ts', 'utf8').includes('offline()'));
assert.ok(fs.readFileSync('app/main.tsx', 'utf8').includes("serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)"));
console.log('PASS: offline app manifest, icons, links and service worker template.');
