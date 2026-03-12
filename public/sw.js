// Minimal service worker for PWA install prompt
// Does NOT cache anything — Next.js handles its own caching

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Only intercept same-origin GET requests
  // Non-GET (POST/PUT/DELETE) and cross-origin requests are left to the browser
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return;
  }
  event.respondWith(fetch(event.request));
});
