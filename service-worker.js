// White Pack PWA service worker — resilient install and offline shell
const CACHE_NAME = 'whitepack-pwa-v2';
const SHELL_FILES = [
  './', './index.html', './admin.html', './Admin.html', './quotation.html',
  './site.webmanifest', './admin-manifest.webmanifest', './quotation-manifest.webmanifest',
  './logo.png', './icon-32.png', './icon-48.png', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './quotation-icon-32.png', './quotation-icon-48.png', './quotation-icon-180.png', './quotation-icon-192.png', './quotation-icon-512.png'
];
const scopeUrl = (path) => new URL(path, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache independently so one missing optional file cannot break installation.
    await Promise.all(SHELL_FILES.map(async (path) => {
      try {
        const response = await fetch(scopeUrl(path), { cache: 'reload' });
        if (response.ok) await cache.put(scopeUrl(path), response);
      } catch (_) { /* optional asset unavailable; continue */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('whitepack-pwa-') && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  // Never intercept backend/API calls.
  if (/\/(rest|auth|storage|functions|graphql)(\/|$)/i.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          await cache.put(request, response.clone());
          await cache.put(new URL(url.pathname, self.registration.scope).href, response.clone());
        }
        return response;
      } catch (_) {
        const exact = await cache.match(request);
        if (exact) return exact;
        const pathMatch = await cache.match(new URL(url.pathname, self.registration.scope).href);
        if (pathMatch) return pathMatch;
        const filename = url.pathname.split('/').pop() || 'index.html';
        const fallback = await cache.match(scopeUrl('./' + filename)) || await cache.match(scopeUrl('./index.html')) || await cache.match(scopeUrl('./'));
        return fallback || new Response('You are offline. Reconnect to use the live White Pack catalogue and admin tools.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  const cacheable = SHELL_FILES.some((path) => url.href === scopeUrl(path)) || /\.(css|js|png|jpg|jpeg|webp|svg|ico|woff2?)$/i.test(url.pathname);
  if (!cacheable) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (_) {
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
