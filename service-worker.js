const CACHE_NAME = 'whitepack-pwa-shell-v1';
const SHELL = [
  './',
  './index.html',
  './admin.html',
  './quotation.html',
  './orders.html',
  './driver-tracking.html',
  './platform-admin.html',
  './admin-manifest.webmanifest',
  './quotation-manifest.webmanifest',
  './admin-icon-192.png',
  './admin-icon-512.png',
  './admin-icon-maskable-192.png',
  './admin-icon-maskable-512.png',
  './quotation-icon-192.png',
  './quotation-icon-512.png',
  './quotation-icon-maskable-192.png',
  './quotation-icon-maskable-512.png',
  './admin-icon-32.png',
  './admin-icon-180.png',
  './quotation-icon-32.png',
  './quotation-icon-180.png'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache the essential install shell; optional pages may not exist in every deployment.
    await Promise.all(SHELL.map(async url => {
      try { await cache.add(new Request(url, {cache:'reload'})); } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('whitepack-pwa-shell-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone()).catch(()=>{});
        return fresh;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(req)) || (await cache.match('./admin.html')) || (await cache.match('./index.html'));
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      if (fresh.ok) cache.put(req, fresh.clone()).catch(()=>{});
      return fresh;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});
