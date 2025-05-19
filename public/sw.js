const CACHE_NAME = 'loklernen-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Install and precache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  // Force waiting service worker to become active
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Clean up old caches when new service worker activates
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  // Take control of uncontrolled clients
  self.clients.claim();
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve cached content with network fallback, using stale-while-revalidate for API routes
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // API routes - use stale-while-revalidate strategy
  if (url.pathname.startsWith('/api/') || url.pathname.includes('supabase')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        try {
          // Try network first
          const networkResponse = await fetch(event.request);
          // Update cache with fresh response
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // Fall back to cache if network fails
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If nothing in cache for API request, return generic offline JSON
          return new Response(JSON.stringify({ offline: true, error: 'You are offline' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 503
          });
        }
      })
    );
    return;
  }
  
  // For HTML navigation requests - network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html') || caches.match('/');
      })
    );
    return;
  }
  
  // For static assets - cache-first strategy
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached response immediately
        return cachedResponse;
      }
      
      // Not in cache, fetch from network and add to cache
      return fetch(event.request)
        .then(networkResponse => {
          // Check if response is valid to cache
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          
          // Clone response so we can add it to cache and return it
          const responseToCache = networkResponse.clone();
          
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return networkResponse;
        })
        .catch(() => {
          // If fetching fails for images or other resources, return placeholder
          if (event.request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
            return caches.match('/icons/placeholder-image.png');
          }
          
          // Return whatever we have (likely nothing, but keeps the promise chain intact)
          return new Response('Resource unavailable offline', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
    })
  );
});

// Handle message events from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
