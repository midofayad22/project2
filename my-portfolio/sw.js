const CACHE_NAME = "fayad-portfolio-v2";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/gallery.html",
  "/manifest.json",

  "/profile.jpg",

  "/icons/favicon.svg",
  "/icons/icon-180.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {

  event.waitUntil(

    caches
      .open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(STATIC_ASSETS);

      })

  );

  self.skipWaiting();

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches
      .keys()
      .then(cacheNames => {

        return Promise.all(

          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))

        );

      })

  );

  self.clients.claim();

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

  const request = event.request;

  if (request.method !== "GET") {
    return;
  }


  const url = new URL(request.url);


  /* Ignore external resources */

  if (url.origin !== self.location.origin) {
    return;
  }


  /* HTML navigation */

  if (request.mode === "navigate") {

    event.respondWith(

      fetch(request)
        .then(response => {

          const cloned = response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {
              cache.put(request, cloned);
            });

          return response;

        })
        .catch(() => {

          return caches.match(
            "/index.html"
          );

        })

    );

    return;
  }


  /* Static files */

  event.respondWith(

    caches
      .match(request)
      .then(cached => {

        if (cached) {
          return cached;
        }

        return fetch(request)
          .then(response => {

            if (
              !response ||
              response.status !== 200
            ) {
              return response;
            }

            const cloned =
              response.clone();

            caches
              .open(CACHE_NAME)
              .then(cache => {
                cache.put(
                  request,
                  cloned
                );
              });

            return response;

          });

      })

  );

});