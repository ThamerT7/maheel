// Maheel Service Worker
// Cache-first for static assets, network-first for API calls

const CACHE_VERSION = 'maheel-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// App shell resources to pre-cache on install
const APP_SHELL = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/manifest.json',
];

// --- Install Event: Pre-cache app shell ---
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

// --- Activate Event: Clean old caches ---
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// --- Helpers ---

function isStaticAsset(url) {
  return /\.(js|css|woff2?|ttf|otf|eot|png|jpe?g|gif|svg|webp|avif|ico)(\?.*)?$/i.test(
    url.pathname
  );
}

function isApiCall(url) {
  return url.pathname.startsWith('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// --- Cache-first strategy (static assets) ---
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // If it's an image, return nothing rather than error
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

// --- Network-first strategy (API calls) ---
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    return new Response(
      JSON.stringify({ error: 'offline', message: 'أنت غير متصل بالإنترنت' }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  }
}

// --- Navigation with offline fallback ---
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    return caches.match('/offline.html');
  }
}

// --- Fetch Event ---
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  if (isNavigationRequest(request)) {
    event.respondWith(navigationHandler(request));
  } else if (isApiCall(url)) {
    event.respondWith(networkFirst(request));
  } else if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  }
});
