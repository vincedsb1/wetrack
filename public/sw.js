/**
 * Service Worker for Rituels de Notes
 * Minimal implementation - just network pass-through
 * Full offline support will be added in production
 */

// Install
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch: Pass through to network (development mode)
// In production, implement proper caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip cross-origin
  if (!request.url.startsWith(location.origin)) {
    return;
  }

  // Simple network pass-through
  event.respondWith(
    fetch(request).catch(() => {
      // Offline: return a basic response
      return new Response("Offline", {
        status: 503,
        statusText: "Service Unavailable",
      });
    })
  );
});
