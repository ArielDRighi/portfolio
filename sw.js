/**
 * SERVICE WORKER - PRODUCTION OPTIMIZED
 * Cache estratégico avanzado para máxima performance del portfolio
 */

const CACHE_NAME = "portfolio-v1.0.0-production";
const STATIC_CACHE = [
  "/portfolio/",
  "/portfolio/index.html",
  "/portfolio/css/styles.css",
  "/portfolio/css/themes.css",
  "/portfolio/css/responsive-optimized.css",
  "/portfolio/css/animations.css",
  "/portfolio/css/desktop.css",
  "/portfolio/js/main.js",
  "/portfolio/js/theme-manager.js",
  "/portfolio/js/animation-controller.js",
  "/portfolio/js/performance-optimizer.js",
  "/portfolio/js/portfolio-tester.js",
  "/portfolio/js/cross-device-tester.js",
  "/portfolio/js/desktop.js",
  "/portfolio/js/experience.js",
  "/portfolio/js/contact.js",
  "/portfolio/data/projects.json",
  "/portfolio/data/experience.json",
  "/portfolio/site.webmanifest",
  // Fuentes críticas
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
];

// Cache dinámico para recursos adicionales
const DYNAMIC_CACHE = "portfolio-dynamic-v1.0.0";

// Estrategias de cache mejoradas
const CACHE_STRATEGIES = {
  image: "cache-first",
  font: "cache-first",
  css: "stale-while-revalidate",
  js: "stale-while-revalidate",
  json: "network-first",
  html: "network-first",
};

// Performance optimizations
const PERFORMANCE_CONFIG = {
  maxCacheAge: 30 * 24 * 60 * 60 * 1000, // 30 días
  maxCacheSize: 50, // máximo 50 items en cache dinámico
  preloadCritical: true,
  compressionEnabled: true,
};

// Install event - Cache static resources
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Caching static resources");
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => {
        console.log("✅ Service Worker installed successfully");
        return self.skipWaiting();
      })
  );
});

// Activate event - Clean old caches
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("🗑️ Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("✅ Service Worker activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - Cache strategy
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }

          // Clone response for caching
          const responseToCache = response.clone();

          // Cache new responses (for dynamic content)
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Fallback for offline scenarios
          if (event.request.destination === "document") {
            return caches.match("/portfolio/index.html");
          }
        });
    })
  );
});

// Background sync (if supported)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("🔄 Background sync triggered");
    // Aquí se pueden implementar tareas de sincronización
  }
});

// Push notifications (if implemented in the future)
self.addEventListener("push", (event) => {
  console.log("🔔 Push notification received");
  // Implementación futura de notificaciones
});

// Message handling from main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
