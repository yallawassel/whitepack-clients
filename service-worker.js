const CACHE_NAME = 'whitepack-pwa-v1';
const STATIC_ASSETS = [
  './site.webmanifest', './admin-manifest.webmanifest', './quotation-manifest.webmanifest',
  './logo.png', './icon-32.png', './icon-48.png', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './quotation-icon-32.png', './quotation-icon-48.png', './quotation-icon-180.png', './quotation-icon-192.png', './quotation-icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('whitepack-pwa-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Never cache cross-origin service calls (including Supabase auth, catalogue, image storage or orders).
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const exact = await cache.match(request);
      if (exact) return exact;
      const path = new URL(request.url).pathname;
      const filename = path.split('/').pop() || 'index.html';
      const local = await cache.match('./' + filename) || await cache.match('./index.html');
      return local || new Response('You are offline. Reconnect to use the live White Pack catalogue and admin tools.', {status: 503, headers: {'Content-Type':'text/plain; charset=utf-8'}});
    }));
    return;
  }
  if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset.replace(/^\.\//, '')))) {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    })));
  }
});
