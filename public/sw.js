// Service worker do ScoutMe PRO.
// Troque a VERSION quando mudar este arquivo para limpar os caches antigos.
const VERSION = 'v1';
const STATIC_CACHE = `scoutme-static-${VERSION}`;
const PAGES_CACHE = `scoutme-pages-${VERSION}`;
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [OFFLINE_URL, '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, PAGES_CACHE];

  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => !currentCaches.includes(key)).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // A API roda em outro domínio: deixa passar direto, sem cache.
  if (url.origin !== self.location.origin) return;

  // Páginas: tenta a rede primeiro e usa o cache só quando estiver offline.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Arquivos do build têm hash no nome, então podem vir direto do cache.
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(PAGES_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) cache.put(request, response.clone());

    return response;
  } catch {
    return (await cache.match(request)) ?? (await caches.match(OFFLINE_URL));
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);

  if (cached) return cached;

  const response = await fetch(request);

  if (response.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());
  }

  return response;
}
