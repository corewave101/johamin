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
    // Skip the browser's HTTP cache so a new version never stores stale files. Files under assets/ have the content hash
    // in their name, so the copy the page just downloaded is reused instead of fetching the big code file twice.
    // Code and the shell are essential. One unavailable picture/video must not disable offline learning.
    const mode = url => /^\.\/assets\//.test(url) ? 'default' : 'reload';
    const essential = PRECACHE.filter(url => /\.(?:js|css|webmanifest|woff2?)$/.test(url) || url.includes('/icons/'));
    await cache.addAll([SHELL, ...essential].map(url => new Request(url, { cache: mode(url) })));
    await Promise.allSettled(PRECACHE.filter(url => !essential.includes(url)).map(async url => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try { const response = await fetch(new Request(url, { cache: mode(url), signal: controller.signal })); if(response.ok) await cache.put(url,response); }
      finally { clearTimeout(timeout); }
    }));
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

// The page tells the worker which background video this device plays; only that one is saved for offline use.
self.addEventListener('message', event => {
  const data = event.data;
  if (!data || data.type !== 'cache-video' || typeof data.url !== 'string') return;
  const url = new URL(data.url, self.location.href);
  if (url.origin !== self.location.origin || !/\.mp4$/.test(url.pathname)) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    if (await cache.match(url.href, { ignoreSearch: true })) return;
    try { const response = await fetch(url.href, { cache: 'reload' }); if (response.ok && response.status === 200) await cache.put(url.href, response); }
    catch { /* try again on the next visit */ }
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
    // 정보 코딩 연습장의 파이썬(Pyodide)은 버전이 주소에 박혀 있어 바뀌지 않는다: 한 번 받으면 다시 받지 않는다.
    // (워커의 importScripts처럼 no-cors로 오는 작은 파일은 브라우저 캐시에 맡긴다.)
    if (url.pathname.startsWith('/npm/pyodide@')) { if (request.mode === 'cors') event.respondWith(pinned(request)); }
    else event.respondWith(fromCdn(request));
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

// Versioned files (Pyodide): the saved copy forever, the network only the first time.
async function pinned(request) {
  const cache = await caches.open(RUNTIME);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
}
