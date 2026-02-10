const CACHE_NAME = "najirah-v1";
const urlsToCache = [
  "/rest/",
  "/rest/index.html",
  "/rest/about.html",
  "/rest/styles.css",
  "/rest/manifest.json",
  "/rest/icons/icon-192.png",
  "/rest/icons/icon-512.png"
];

// نصب و کش اولیه
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching files...");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// فعال شدن SW
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// fetch با fallback برای آفلاین
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match("/rest/index.html"));
    })
  );
});
