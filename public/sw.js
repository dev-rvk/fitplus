/**
 * FitPlus Service Worker
 *
 * Provides offline caching and makes the app installable as a PWA.
 * Uses a "network-first, cache-fallback" strategy for pages and a
 * "cache-first" strategy for static assets.
 */

const CACHE_NAME = "fitplus-v1";

const PRECACHE_URLS = [
  "/",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

const STATIC_EXTENSIONS = [
  ".js", ".css", ".woff2", ".woff", ".ttf", ".png", ".jpg",
  ".jpeg", ".svg", ".ico", ".webp",
];

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))
  );
}

// === Install: pre-cache shell ===
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// === Activate: clean old caches ===
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// === Fetch: strategy router ===
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and API requests
  if (event.request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;

  if (isStaticAsset(url)) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached || fetch(event.request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
      )
    );
  } else {
    // Network-first for pages
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
