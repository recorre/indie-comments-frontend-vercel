const CACHE_NAME = 'indie-comments-v1';
const urlsToCache = [
  '/',
  '/indie-comments-widget/widget.js',
  '/indie-comments-widget/css/widget.css',
  '/indie-comments-widget/widget.min.js',
  '/indie-comments-widget/css/widget.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});