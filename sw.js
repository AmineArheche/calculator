/**
 * Calculator Pro & Math Learning Lab - Service Worker
 * Provides offline caching, network-first updates, and asset pre-caching.
 */

const CACHE_NAME = 'calc-pro-v2.1.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './src/main.js',
  './src/styles/variables.css',
  './src/styles/layout.css',
  './src/styles/calculator.css',
  './src/styles/keypad.css',
  './src/styles/history.css',
  './src/styles/responsive.css',
  './src/styles/learn.css',
  './src/styles/quiz.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cache but update in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
