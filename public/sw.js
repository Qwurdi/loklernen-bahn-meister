
const CACHE_NAME = 'loklernen-v2';
const OFFLINE_URL = '/offline.html';
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html',
  '/favicon.ico'
];

// Install a service worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell...');
        return cache.addAll(APP_SHELL_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
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
    }).then(() => {
      console.log('Service Worker: Now active, controlling all clients');
      return self.clients.claim();
    })
  );
});

// Improved fetch event handler with network-first strategy for API requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isApiRequest = url.pathname.includes('/rest/v1') || 
                      url.pathname.includes('/auth/v1');
                      
  // For API requests, try network first, then fall back to cache
  if (isApiRequest) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For navigation requests, use a cache-first approach
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              if (response) {
                return response;
              }
              // If navigation fails and there's no cache, show offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // For all other requests (assets, etc), try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request - request streams can only be used once
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it's going to be used by the browser and the cache
            const responseToCache = response.clone();
            
            // Add to cache for next time
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // For images and other non-essential resources, return a placeholder or nothing
            if (event.request.destination === 'image') {
              return new Response('', {
                status: 204,
                statusText: 'No Content'
              });
            }
          });
      })
  );
});

// Listen for sync events for background data synchronization
self.addEventListener('sync', event => {
  console.log('Service Worker: Sync event received', event.tag);
  
  if (event.tag === 'sync-pending-answers') {
    event.waitUntil(syncPendingAnswers());
  }
});

// Sync function to handle pending answer submissions
async function syncPendingAnswers() {
  console.log('Service Worker: Attempting to sync pending answers');
  
  // This would need IndexedDB access from the SW 
  // For now, we'll implement this in the main thread instead
  // and rely on the online/offline detection there
}
