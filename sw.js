const CACHE_NAME = "guess-game-v2";
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png"
];

// Install: cache core files
self.addEventListener("install", (e) => {
  self.skipWaiting(); // activate new SW immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
});

// Activate: clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: serve cache first, then network
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request);
    })
  );
});
