const CACHE = '787gastronomia-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/images/logo.webp',
  '/images/herobg.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Skip non-GET, non-http, and analytics
  if (!url.protocol.startsWith('http') || url.hostname === 'challenges.cloudflare.com') return;

  // Static assets (images, fonts, css, js) → cache-first
  if (/\.(webp|avif|png|jpg|jpeg|svg|woff2?|css|js)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Navigation → network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Everything else → network-only
  event.respondWith(fetch(request));
});
