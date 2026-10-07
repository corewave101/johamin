// Offline support. After the first visit the whole app (code, pictures, background video) stays on the device,
// so it opens in Chrome without internet. The build fills in VERSION and PRECACHE (see vite.config.ts).
const VERSION = '__BUILD__';
const PRECACHE = [];
const CACHE = `johamin-${VERSION}`;
const RUNTIME = 'johamin-runtime'; // fonts from the CDN, picked up as they are used
const SHELL = './';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Skip the browser's HTTP cache so a new version never stores stale files.
    await cache.addAll([SHELL, ...PRECACHE].map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('johamin-') && key !== CACHE && key !== RUNTIME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') event.respondWith(page(request));
    else event.respondWith(asset(request));
  } else if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(fromCdn(request));
  }
  // Everything else (the card database) goes straight to the network; the app keeps its own copy of the cards.
});

// Pages: try the network for the newest version, fall back to the saved copy when offline or slow.
async function page(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await Promise.race([fetch(request), new Promise((_, reject) => setTimeout(reject, 4000))]);
    if (response.ok) await cache.put(SHELL, response.clone());
    return response;
  } catch {
    return (await cache.match(SHELL)) ?? Response.error();
  }
}

// Files: saved copy first (they never change under the same name within a version).
async function asset(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return request.headers.has('range') ? partial(request, cached) : cached;
  try {
    return await fetch(request);
  } catch {
    return Response.error();
  }
}

// The video element asks for byte ranges; answer them from the saved full file.
async function partial(request, cached) {
  const body = await cached.arrayBuffer();
  const size = body.byteLength;
  const match = /bytes=(\d*)-(\d*)/.exec(request.headers.get('range') ?? '');
  let start = 0, end = size - 1;
  if (match && match[1]) { start = Number(match[1]); if (match[2]) end = Math.min(Number(match[2]), size - 1); }
  else if (match && match[2]) start = Math.max(0, size - Number(match[2]));
  if (start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') ?? 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}

// Font stylesheet and font files: use the saved copy right away and refresh it in the background.
async function fromCdn(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request);
  const fresh = fetch(request).then(response => {
    if (response.ok || response.type === 'opaque') void cache.put(request, response.clone());
    return response;
  }).catch(() => undefined);
  return cached ?? (await fresh) ?? Response.error();
}
