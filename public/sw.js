// Minimal service worker for PWA install prompt
// Does NOT cache anything — Next.js handles its own caching

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // This service worker exists only to make the app installable.
  // Do not proxy requests with respondWith(fetch(...)); when a dev-server
  // request is cancelled or unavailable, that rejected promise creates noisy
  // "FetchEvent resulted in a network error" console errors.
  return;
});
