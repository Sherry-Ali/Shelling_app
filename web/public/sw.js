self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  return self.clients.claim();
});

// A simple fetch listener that just lets the network handle it,
// but fulfills the PWA requirement for having a fetch handler.
self.addEventListener('fetch', (event) => {
  // Can be expanded later for offline caching.
});
